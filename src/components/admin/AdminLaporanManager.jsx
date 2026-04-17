"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const emptyCategoryForm = {
    categoryId: "",
    title: "",
    description: "",
    intro: "",
    sort_order: 0,
    is_active: true,
};

const emptyDocForm = {
    title: "",
    description: "",
    year: "",
    sort_order: 0,
    is_published: true,
};

function Button({ children, tone = "primary", ...props }) {
    const tones = {
        primary: "bg-emerald-700 text-white hover:bg-emerald-800",
        dark: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
        danger: "bg-rose-600 text-white hover:bg-rose-700",
        soft: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
    };

    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${tones[tone] || tones.primary} ${props.className || ""}`.trim()}
        >
            {children}
        </button>
    );
}

function Input({ label, hint, ...props }) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <input
                {...props}
                className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${props.className || ""}`.trim()}
            />
            {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
        </label>
    );
}

function TextArea({ label, hint, ...props }) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <textarea
                {...props}
                className={`min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${props.className || ""}`.trim()}
            />
            {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
        </label>
    );
}

function formatBytes(size) {
    const bytes = Number(size || 0);
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminLaporanManager() {
    const [categories, setCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState("");
    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
    const [docForm, setDocForm] = useState(emptyDocForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingCategory, setSavingCategory] = useState(false);
    const [savingDocument, setSavingDocument] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const activeCategory = useMemo(
        () => categories.find((item) => item.id === activeCategoryId) || null,
        [categories, activeCategoryId],
    );

    const loadData = useCallback(async (preferredCategoryId = "") => {
        setLoading(true);
        setFeedback({ type: "", message: "" });

        try {
            const response = await fetch("/api/admin/laporan", {
                method: "GET",
                cache: "no-store",
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Gagal memuat data laporan.");
            }

            const nextCategories = Array.isArray(json?.categories) ? json.categories : [];
            setCategories(nextCategories);

            const chosenId =
                preferredCategoryId ||
                activeCategoryId ||
                nextCategories[0]?.id ||
                "";

            setActiveCategoryId(chosenId);
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.message || "Terjadi kesalahan saat memuat data laporan.",
            });
        } finally {
            setLoading(false);
        }
    }, [activeCategoryId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!activeCategory) {
            setCategoryForm(emptyCategoryForm);
            setDocuments([]);
            return;
        }

        setCategoryForm({
            categoryId: activeCategory.id,
            title: activeCategory.title || "",
            description: activeCategory.description || "",
            intro: activeCategory.intro || "",
            sort_order: Number(activeCategory.sort_order || 0),
            is_active:
                typeof activeCategory.is_active === "boolean"
                    ? activeCategory.is_active
                    : true,
        });

        const nextDocs = Array.isArray(activeCategory.documents)
            ? [...activeCategory.documents].sort(
                (a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0),
            )
            : [];

        setDocuments(nextDocs);
    }, [activeCategory]);

    function updateCategoryField(field, value) {
        setCategoryForm((prev) => ({ ...prev, [field]: value }));
    }

    function updateDocField(field, value) {
        setDocForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSaveCategory(event) {
        event.preventDefault();
        if (!categoryForm.categoryId) return;

        setSavingCategory(true);
        setFeedback({ type: "", message: "" });

        try {
            const response = await fetch("/api/admin/laporan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "update-category",
                    categoryId: categoryForm.categoryId,
                    title: categoryForm.title,
                    description: categoryForm.description,
                    intro: categoryForm.intro,
                    sort_order: Number(categoryForm.sort_order || 0),
                    is_active: Boolean(categoryForm.is_active),
                }),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Gagal menyimpan kategori laporan.");
            }

            setFeedback({ type: "success", message: json?.message || "Perubahan berhasil disimpan." });
            await loadData(categoryForm.categoryId);
        } catch (error) {
            setFeedback({ type: "error", message: error?.message || "Gagal menyimpan data." });
        } finally {
            setSavingCategory(false);
        }
    }

    async function handleUploadDocument(event) {
        event.preventDefault();

        if (!activeCategoryId) {
            setFeedback({ type: "error", message: "Pilih kategori laporan terlebih dahulu." });
            return;
        }

        if (!selectedFile) {
            setFeedback({ type: "error", message: "Pilih file dokumen yang ingin diupload." });
            return;
        }

        setSavingDocument(true);
        setFeedback({ type: "", message: "" });

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("categoryId", activeCategoryId);
            formData.append("title", docForm.title);
            formData.append("description", docForm.description);
            formData.append("year", String(docForm.year || ""));
            formData.append("sort_order", String(docForm.sort_order || 0));
            formData.append("is_published", String(Boolean(docForm.is_published)));

            const response = await fetch("/api/admin/laporan/upload", {
                method: "POST",
                body: formData,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Upload dokumen gagal.");
            }

            setDocForm(emptyDocForm);
            setSelectedFile(null);
            setFeedback({ type: "success", message: json?.message || "Dokumen berhasil diupload." });
            await loadData(activeCategoryId);
        } catch (error) {
            setFeedback({ type: "error", message: error?.message || "Upload dokumen gagal." });
        } finally {
            setSavingDocument(false);
        }
    }

    async function handleDocumentAction(id, action, payload = {}) {
        setFeedback({ type: "", message: "" });

        try {
            const response = await fetch(`/api/admin/laporan/${id}`, {
                method: action === "delete" ? "DELETE" : "PUT",
                headers:
                    action === "delete"
                        ? undefined
                        : {
                            "Content-Type": "application/json",
                        },
                body: action === "delete" ? undefined : JSON.stringify(payload),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Gagal memperbarui dokumen.");
            }

            setFeedback({ type: "success", message: json?.message || "Dokumen berhasil diperbarui." });
            await loadData(activeCategoryId);
        } catch (error) {
            setFeedback({ type: "error", message: error?.message || "Gagal memperbarui dokumen." });
        }
    }

    async function togglePublish(doc) {
        await handleDocumentAction(doc.id, "update", {
            title: doc.title,
            description: doc.description || "",
            year: doc.year || "",
            sort_order: Number(doc.sort_order || 0),
            is_published: !doc.is_published,
        });
    }

    async function saveSortOrder(doc, nextSortOrder) {
        await handleDocumentAction(doc.id, "update", {
            title: doc.title,
            description: doc.description || "",
            year: doc.year || "",
            sort_order: Number(nextSortOrder || 0),
            is_published: Boolean(doc.is_published),
        });
    }

    async function deleteDocument(doc) {
        const ok = window.confirm(`Hapus dokumen "${doc.title}"?`);
        if (!ok) return;
        await handleDocumentAction(doc.id, "delete");
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
            {/* lanjutkan JSX lama Anda di bawah sini tanpa perubahan */}
        </div>
    );
}