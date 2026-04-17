"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const emptyDocForm = {
    title: "",
    description: "",
    year: "",
    is_published: true,
};

function Button({ children, tone = "primary", className = "", ...props }) {
    const tones = {
        primary: "bg-emerald-700 text-white hover:bg-emerald-800",
        ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        danger: "bg-rose-600 text-white hover:bg-rose-700",
        soft:
            "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    };

    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone] || tones.primary} ${className}`.trim()}
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

function Textarea({ label, hint, ...props }) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <textarea
                {...props}
                className={`min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${props.className || ""}`.trim()}
            />
            {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
        </label>
    );
}

function Feedback({ type, message }) {
    if (!message) return null;
    return (
        <div
            className={`rounded-2xl px-4 py-3 text-sm ${type === "error"
                ? "border border-rose-200 bg-rose-50 text-rose-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
        >
            {message}
        </div>
    );
}

function formatBytes(size) {
    const bytes = Number(size || 0);
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function normalizeDocUrl(doc) {
    return String(doc?.file_url || doc?.href || "").trim();
}

function normalizeCategoryMap(category) {
    if (!category?.slug) return {};
    return {
        [category.slug]: Array.isArray(category.documents) ? category.documents : [],
    };
}

export default function AdminLaporanCategoryManager({
    category: initialCategory,
    categories = [],
}) {
    const router = useRouter();

    const initialSlug =
        initialCategory?.slug || categories?.[0]?.slug || "";

    const [activeSlug, setActiveSlug] = useState(initialSlug);
    const [docsBySlug, setDocsBySlug] = useState(() =>
        normalizeCategoryMap(initialCategory),
    );
    const [loadingSlug, setLoadingSlug] = useState(null);
    const [docForm, setDocForm] = useState(emptyDocForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [savingDocument, setSavingDocument] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const [yearFilter, setYearFilter] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(emptyDocForm);

    const activeCategory = useMemo(() => {
        return categories.find((item) => item.slug === activeSlug) || initialCategory || null;
    }, [activeSlug, categories, initialCategory]);

    const documents = useMemo(() => {
        const current = docsBySlug?.[activeSlug];
        return Array.isArray(current) ? current : [];
    }, [docsBySlug, activeSlug]);

    const yearOptions = useMemo(() => {
        return [
            ...new Set(
                documents.map((item) => item?.year).filter(Boolean).map((item) => Number(item)),
            ),
        ].sort((a, b) => b - a);
    }, [documents]);

    const filteredDocuments = useMemo(() => {
        if (!yearFilter) return documents;
        return documents.filter((item) => String(item?.year || "") === yearFilter);
    }, [documents, yearFilter]);

    async function handleSwitchCategory(slug) {
        if (!slug || slug === activeSlug) return;

        setActiveSlug(slug);
        setYearFilter("");
        setEditingId(null);
        setFeedback({ type: "", message: "" });

        if (Array.isArray(docsBySlug?.[slug])) return;

        setLoadingSlug(slug);
        try {
            const response = await fetch(
                `/api/admin/laporan?slug=${encodeURIComponent(slug)}`,
                { cache: "no-store" },
            );

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Gagal memuat dokumen kategori.");
            }

            const categoryData = Array.isArray(json?.categories)
                ? json.categories.find((item) => item.slug === slug)
                : null;

            setDocsBySlug((prev) => ({
                ...prev,
                [slug]: Array.isArray(categoryData?.documents) ? categoryData.documents : [],
            }));
        } catch (error) {
            setDocsBySlug((prev) => ({
                ...prev,
                [slug]: [],
            }));
            setFeedback({
                type: "error",
                message: error?.message || "Gagal memuat dokumen kategori.",
            });
        } finally {
            setLoadingSlug(null);
        }
    }

    async function handleUpload(event) {
        event.preventDefault();

        if (!activeCategory?.slug) {
            setFeedback({ type: "error", message: "Kategori aktif tidak ditemukan." });
            return;
        }

        if (!docForm.title.trim()) {
            setFeedback({ type: "error", message: "Judul dokumen wajib diisi." });
            return;
        }

        if (!selectedFile) {
            setFeedback({ type: "error", message: "Pilih file PDF yang ingin diupload." });
            return;
        }

        const isPdf =
            selectedFile.type === "application/pdf" || /\.pdf$/i.test(selectedFile.name);

        if (!isPdf) {
            setFeedback({ type: "error", message: "Hanya file PDF yang diizinkan." });
            return;
        }

        setSavingDocument(true);
        setFeedback({ type: "", message: "" });

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("categoryId", activeCategory.id || "");
            formData.append("categorySlug", activeCategory.slug || "");
            formData.append("title", docForm.title.trim());
            formData.append("description", docForm.description.trim());
            formData.append("year", String(docForm.year || ""));
            formData.append("is_published", String(Boolean(docForm.is_published)));

            const response = await fetch("/api/admin/laporan/upload", {
                method: "POST",
                body: formData,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Upload dokumen gagal.");
            }

            if (json?.document) {
                setDocsBySlug((prev) => ({
                    ...prev,
                    [activeCategory.slug]: [json.document, ...(prev?.[activeCategory.slug] || [])],
                }));
            }

            setDocForm(emptyDocForm);
            setSelectedFile(null);

            const fileInput = document.getElementById("pdf-upload-input");
            if (fileInput) fileInput.value = "";

            setFeedback({
                type: "success",
                message: json?.message || "Dokumen berhasil diupload.",
            });

            router.refresh();
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.message || "Upload dokumen gagal.",
            });
        } finally {
            setSavingDocument(false);
        }
    }

    async function handleDocAction(id, action, payload = {}) {
        setFeedback({ type: "", message: "" });

        try {
            const response = await fetch(`/api/admin/laporan/${id}`, {
                method: action === "delete" ? "DELETE" : "PUT",
                headers:
                    action === "delete"
                        ? undefined
                        : { "Content-Type": "application/json" },
                body: action === "delete" ? undefined : JSON.stringify(payload),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Gagal memperbarui dokumen.");
            }

            if (action === "delete") {
                setDocsBySlug((prev) => ({
                    ...prev,
                    [activeSlug]: (prev?.[activeSlug] || []).filter((item) => item.id !== id),
                }));
            } else if (json?.document) {
                setDocsBySlug((prev) => ({
                    ...prev,
                    [activeSlug]: (prev?.[activeSlug] || []).map((item) =>
                        item.id === id ? json.document : item,
                    ),
                }));
            }

            setFeedback({
                type: "success",
                message: json?.message || "Dokumen berhasil diperbarui.",
            });

            router.refresh();
            return json;
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.message || "Gagal memperbarui dokumen.",
            });
            return null;
        }
    }

    async function togglePublish(doc) {
        await handleDocAction(doc.id, "update", {
            title: doc.title,
            description: doc.description || "",
            year: doc.year || "",
            is_published: !doc.is_published,
        });
    }

    async function saveEdit(doc) {
        if (!editForm.title.trim()) {
            setFeedback({ type: "error", message: "Judul dokumen wajib diisi." });
            return;
        }

        const result = await handleDocAction(doc.id, "update", {
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            year: editForm.year || "",
            is_published: Boolean(editForm.is_published),
        });

        if (result) {
            setEditingId(null);
        }
    }

    async function deleteDocument(doc) {
        const ok = window.confirm(`Hapus dokumen "${doc.title}"?`);
        if (!ok) return;
        await handleDocAction(doc.id, "delete");
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-base font-bold text-slate-900">Pilih Kategori</h2>
                <p className="mb-4 text-sm text-slate-500">
                    Pilih submenu laporan. Daftar dokumen dan form upload di bawah akan
                    menyesuaikan kategori yang dipilih secara otomatis.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            type="button"
                            onClick={() => handleSwitchCategory(cat.slug)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${activeSlug === cat.slug
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                                }`}
                        >
                            {cat.title}
                            {loadingSlug === cat.slug ? (
                                <span className="ml-2 text-xs font-normal text-slate-400">
                                    Memuat…
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>

                {activeCategory ? (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-sm font-bold text-emerald-900">{activeCategory.title}</p>
                        {activeCategory.description ? (
                            <p className="mt-1 text-sm leading-6 text-emerald-800">
                                {activeCategory.description}
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-base font-bold text-slate-900">Upload Dokumen PDF</h2>
                <p className="mb-5 text-sm text-slate-500">
                    File yang diupload otomatis masuk ke kategori{" "}
                    <span className="font-semibold text-emerald-700">
                        {activeCategory?.title || "—"}
                    </span>
                    .
                </p>

                <form className="space-y-4" onSubmit={handleUpload}>
                    <Input
                        label="Judul Dokumen"
                        placeholder="Contoh: Laporan Kinerja Tahun 2025"
                        value={docForm.title}
                        onChange={(e) => setDocForm((prev) => ({ ...prev, title: e.target.value }))}
                    />

                    <Textarea
                        label="Deskripsi Singkat"
                        placeholder="Ringkasan isi dokumen..."
                        value={docForm.description}
                        onChange={(e) =>
                            setDocForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Tahun"
                            type="number"
                            min="2000"
                            max="2100"
                            placeholder="2025"
                            value={docForm.year}
                            onChange={(e) => setDocForm((prev) => ({ ...prev, year: e.target.value }))}
                        />

                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-800">File PDF</span>
                            <input
                                id="pdf-upload-input"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            <span className="block text-xs text-slate-500">
                                Hanya file PDF, maks. 10 MB.
                            </span>
                        </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={docForm.is_published}
                            onChange={(e) =>
                                setDocForm((prev) => ({ ...prev, is_published: e.target.checked }))
                            }
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">Langsung publish setelah upload</span>
                    </label>

                    <Feedback {...feedback} />

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={savingDocument}>
                            {savingDocument ? "Mengupload…" : "Upload Dokumen"}
                        </Button>
                        <Button
                            type="button"
                            tone="ghost"
                            onClick={() => {
                                setDocForm(emptyDocForm);
                                setSelectedFile(null);
                                const fileInput = document.getElementById("pdf-upload-input");
                                if (fileInput) fileInput.value = "";
                            }}
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Daftar Dokumen</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Kategori:{" "}
                            <span className="font-semibold text-emerald-700">
                                {activeCategory?.title || "—"}
                            </span>
                            {" · "}
                            {filteredDocuments.length} dokumen
                        </p>
                    </div>

                    {yearOptions.length > 0 ? (
                        <label className="block w-full sm:w-48">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Filter Tahun
                            </span>
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            >
                                <option value="">Semua Tahun</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={String(year)}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                </div>

                {loadingSlug === activeSlug ? (
                    <p className="py-10 text-center text-sm text-slate-400">Memuat dokumen…</p>
                ) : filteredDocuments.length > 0 ? (
                    <div className="space-y-3">
                        {filteredDocuments.map((doc, index) => {
                            const previewUrl = normalizeDocUrl(doc);
                            const isEditing = editingId === doc.id;

                            return (
                                <article
                                    key={doc.id}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    {!isEditing ? (
                                        <div className="flex flex-wrap items-start gap-4">
                                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                                {index + 1}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900">{doc.title}</p>
                                                {doc.description ? (
                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                                        {doc.description}
                                                    </p>
                                                ) : null}
                                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                                    {doc.year ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1">
                                                            Tahun {doc.year}
                                                        </span>
                                                    ) : null}
                                                    <span className="rounded-full bg-slate-100 px-3 py-1">
                                                        {formatBytes(doc.file_size)}
                                                    </span>
                                                    {typeof doc.view_count === "number" ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1">
                                                            Dibaca {doc.view_count}x
                                                        </span>
                                                    ) : null}
                                                    <span
                                                        className={`rounded-full px-3 py-1 ${doc.is_published
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                            }`}
                                                    >
                                                        {doc.is_published ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {previewUrl ? (
                                                    <a
                                                        href={previewUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                    >
                                                        Preview
                                                    </a>
                                                ) : null}
                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={() => {
                                                        setEditingId(doc.id);
                                                        setEditForm({
                                                            title: doc.title || "",
                                                            description: doc.description || "",
                                                            year: doc.year || "",
                                                            is_published:
                                                                typeof doc.is_published === "boolean"
                                                                    ? doc.is_published
                                                                    : true,
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={() => togglePublish(doc)}
                                                >
                                                    {doc.is_published ? "Unpublish" : "Publish"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    tone="danger"
                                                    onClick={() => deleteDocument(doc)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Input
                                                    label="Judul Dokumen"
                                                    value={editForm.title}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({ ...prev, title: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    label="Tahun"
                                                    type="number"
                                                    min="2000"
                                                    max="2100"
                                                    value={editForm.year}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({ ...prev, year: e.target.value }))
                                                    }
                                                />
                                            </div>

                                            <Textarea
                                                label="Deskripsi"
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                                                }
                                            />

                                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(editForm.is_published)}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            is_published: e.target.checked,
                                                        }))
                                                    }
                                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm text-slate-700">
                                                    Dokumen dipublikasikan
                                                </span>
                                            </label>

                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" onClick={() => saveEdit(doc)}>
                                                    Simpan
                                                </Button>
                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                        Belum ada dokumen pada kategori ini.
                    </div>
                )}
            </div>
        </div>
    );
}