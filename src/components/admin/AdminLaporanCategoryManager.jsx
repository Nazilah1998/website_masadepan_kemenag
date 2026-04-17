"use client";

import Link from "next/link";
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
        soft: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
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

export default function AdminLaporanCategoryManager({ category, categories = [] }) {
    const router = useRouter();
    const [docForm, setDocForm] = useState(emptyDocForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState(
        Array.isArray(category?.documents) ? category.documents : [],
    );
    const [savingDocument, setSavingDocument] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const [yearFilter, setYearFilter] = useState("");

    const yearOptions = useMemo(() => {
        return [
            ...new Set(
                documents
                    .map((item) => item?.year)
                    .filter(Boolean)
                    .map((item) => Number(item)),
            ),
        ].sort((a, b) => b - a);
    }, [documents]);

    const filteredDocuments = useMemo(() => {
        if (!yearFilter) return documents;
        return documents.filter((item) => String(item?.year || "") === yearFilter);
    }, [documents, yearFilter]);

    function updateDocField(field, value) {
        setDocForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSwitchCategory(nextSlug) {
        if (!nextSlug || nextSlug === category.slug) return;
        router.push(`/admin/laporan/${nextSlug}`);
    }

    async function handleUploadDocument(event) {
        event.preventDefault();

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
            formData.append("categoryId", category.id || "");
            formData.append("categorySlug", category.slug || "");
            formData.append("title", docForm.title);
            formData.append("description", docForm.description);
            formData.append("year", String(docForm.year || ""));
            formData.append("is_published", String(Boolean(docForm.is_published)));

            const response = await fetch("/api/admin/laporan/upload", {
                method: "POST",
                body: formData,
            });

            const contentType = response.headers.get("content-type") || "";
            const json = contentType.includes("application/json")
                ? await response.json()
                : null;

            if (!response.ok) {
                throw new Error(
                    json?.message || "Upload dokumen gagal. Respons server tidak valid.",
                );
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

    async function handleDocumentAction(id, action, payload = {}) {
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

            setFeedback({
                type: "success",
                message: json?.message || "Dokumen berhasil diperbarui.",
            });

            router.refresh();
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.message || "Gagal memperbarui dokumen.",
            });
        }
    }

    async function togglePublish(doc) {
        await handleDocumentAction(doc.id, "update", {
            title: doc.title,
            description: doc.description || "",
            year: doc.year || "",
            is_published: !doc.is_published,
        });
    }

    async function deleteDocument(doc) {
        const ok = window.confirm(`Hapus dokumen "${doc.title}"?`);
        if (!ok) return;
        await handleDocumentAction(doc.id, "delete");
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
            <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Kategori Aktif</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Ganti kategori kapan saja. Halaman akan langsung berpindah ke submenu yang dipilih.
                        </p>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                            Pilih salah satu dari 7 kategori
                        </span>
                        <select
                            value={category.slug}
                            onChange={(e) => handleSwitchCategory(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        >
                            {categories.map((item) => (
                                <option key={item.slug} value={item.slug}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                        <p className="text-sm font-bold text-emerald-900">{category.title}</p>
                        <p className="mt-1 text-sm leading-6 text-emerald-800">
                            {category.description}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Upload Dokumen PDF</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Semua file yang diupload di sini otomatis masuk ke kategori {category.title}.
                        </p>
                    </div>

                    {feedback.message ? (
                        <div
                            className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${feedback.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-rose-200 bg-rose-50 text-rose-800"
                                }`}
                        >
                            {feedback.message}
                        </div>
                    ) : null}

                    <form onSubmit={handleUploadDocument} className="space-y-4">
                        <Input
                            label="Judul Dokumen"
                            value={docForm.title}
                            onChange={(e) => updateDocField("title", e.target.value)}
                            placeholder={`Contoh: ${category.title} Tahun 2025`}
                        />

                        <Input
                            label="Tahun"
                            type="number"
                            min="2000"
                            max="2100"
                            value={docForm.year}
                            onChange={(e) => updateDocField("year", e.target.value)}
                            hint="Contoh: 2025"
                        />

                        <TextArea
                            label="Deskripsi Singkat"
                            value={docForm.description}
                            onChange={(e) => updateDocField("description", e.target.value)}
                            placeholder="Opsional"
                        />

                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-800">File PDF</span>
                            <input
                                id="pdf-upload-input"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                            />
                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
                                Hanya file PDF. Sistem akan mencoba kompres otomatis agar ukuran lebih ringan.
                                {selectedFile ? (
                                    <div className="mt-2 font-medium text-slate-800">
                                        {selectedFile.name} ({formatBytes(selectedFile.size)})
                                    </div>
                                ) : null}
                            </div>
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={Boolean(docForm.is_published)}
                                onChange={(e) => updateDocField("is_published", e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Langsung tampil di publik
                        </label>

                        <Button type="submit" disabled={savingDocument}>
                            {savingDocument ? "Mengupload..." : "Upload Dokumen"}
                        </Button>
                    </form>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Daftar Dokumen</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Dokumen khusus kategori {category.title}.
                        </p>
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
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
                    </div>
                </div>

                {filteredDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                        Belum ada dokumen pada kategori ini.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                                            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-600">
                                                {doc.year || "Tanpa Tahun"}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-[11px] font-bold ${doc.is_published
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {doc.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-6 text-slate-600">
                                            {doc.description || "Tidak ada deskripsi."}
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                                            <span>{doc.file_name || "-"}</span>
                                            <span>{formatBytes(doc.file_size)}</span>
                                            <span>{doc.mime_type || "-"}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" tone="soft" onClick={() => togglePublish(doc)}>
                                            {doc.is_published ? "Jadikan Draft" : "Publish"}
                                        </Button>
                                        <Button type="button" tone="danger" onClick={() => deleteDocument(doc)}>
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}