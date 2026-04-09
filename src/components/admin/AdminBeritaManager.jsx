"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

const BERITA_CATEGORIES = [
  "Umum",
  "Kegiatan",
  "Madrasah",
  "Pelayanan",
  "Pengumuman",
  "Agenda",
  "Pendidikan",
  "Keagamaan",
];

const emptyForm = {
  title: "",
  slug: "",
  category: "Umum",
  excerpt: "",
  content: "",
  cover_image: "",
  is_published: true,
  published_at: "",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

function slugPreview(title = "") {
  return String(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMeaningfulHtml(html = "") {
  return stripHtml(html).length > 0;
}

function isHttpUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getAllowedCoverHosts() {
  const hosts = new Set(["drive.google.com", "docs.google.com"]);

  if (typeof window !== "undefined") {
    hosts.add(window.location.hostname);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname);
    } catch {
      // abaikan env yang tidak valid
    }
  }

  return hosts;
}

function isAllowedCoverUrl(value = "") {
  if (!value) return true;
  if (!isHttpUrl(value)) return false;

  try {
    const url = new URL(value);
    return getAllowedCoverHosts().has(url.hostname);
  } catch {
    return false;
  }
}

function ToolbarButton({ type = "button", onClick, children, title }) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function CoverThumb({ src, alt = "Cover berita", className = "" }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-slate-100 text-[11px] font-medium text-slate-500 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`rounded-xl object-cover ${className}`}
        loading="lazy"
      />
    </>
  );
}

export default function AdminBeritaManager() {
  const editorRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });

  const titleForm = useMemo(() => {
    return editingId ? "Edit berita" : "Tambah berita";
  }, [editingId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/berita", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data berita.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message || "Gagal memuat data berita.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!openForm || !editorRef.current) return;

    const nextHtml = form.content || "";
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [openForm, form.content]);

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setEditingId(null);
    setSlugManuallyEdited(false);

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }

  function handleOpenCreate() {
    setMessage("");
    setError("");
    resetForm();
    setOpenForm(true);
  }

  function handleOpenEdit(item) {
    setMessage("");
    setError("");
    setEditingId(item.id);

    const normalizedCoverImage = normalizeCoverImageUrl(item.cover_image || "");

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Umum",
      excerpt: item.excerpt || "",
      content: item.content || "",
      cover_image: normalizedCoverImage,
      is_published: Boolean(item.is_published),
      published_at: toDateTimeLocal(item.published_at),
    });

    setSlugManuallyEdited(true);
    setOpenForm(true);
  }

  function handleCloseForm() {
    setOpenForm(false);
    resetForm();
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      if (name === "title") {
        const nextTitle = value;
        return {
          ...prev,
          title: nextTitle,
          slug: slugManuallyEdited ? prev.slug : slugPreview(nextTitle),
        };
      }

      if (name === "slug") {
        return {
          ...prev,
          slug: value,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }
  }

  function syncEditorToState() {
    const html = editorRef.current?.innerHTML || "";
    setForm((prev) => ({ ...prev, content: html }));
    return html;
  }

  function handleEditorInput() {
    syncEditorToState();
  }

  function runEditorCommand(command, value = null) {
    editorRef.current?.focus();

    if (typeof document.execCommand !== "function") {
      setError(
        "Toolbar editor tidak didukung browser ini. Anda masih bisa menulis isi berita secara manual.",
      );
      return;
    }

    document.execCommand(command, false, value);
    syncEditorToState();
  }

  function handleBlockFormatChange(event) {
    const value = event.target.value;
    if (!value) return;

    runEditorCommand("formatBlock", value);
    event.target.value = "";
  }

  function enableCssStyling() {
    if (
      typeof document !== "undefined" &&
      typeof document.execCommand === "function"
    ) {
      document.execCommand("styleWithCSS", false, true);
    }
  }

  function handleFontFamilyChange(event) {
    const value = event.target.value;
    if (!value) return;

    editorRef.current?.focus();
    enableCssStyling();
    runEditorCommand("fontName", value);
    event.target.value = "";
  }

  function handleFontSizeChange(event) {
    const value = event.target.value;
    if (!value) return;

    editorRef.current?.focus();
    enableCssStyling();
    runEditorCommand("fontSize", value);
    event.target.value = "";
  }

  function handleCoverLinkChange(event) {
    const nextValue = event.target.value;
    const normalizedUrl = normalizeCoverImageUrl(nextValue);

    setForm((prev) => ({
      ...prev,
      cover_image: normalizedUrl,
    }));
  }

  function clearCoverImage() {
    setForm((prev) => ({
      ...prev,
      cover_image: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const currentContent = syncEditorToState();
    const normalizedCoverImage = normalizeCoverImageUrl(form.cover_image);

    if (!form.title.trim()) {
      setError("Judul berita wajib diisi.");
      return;
    }

    if (!form.excerpt.trim()) {
      setError("Ringkasan berita wajib diisi.");
      return;
    }

    if (!isMeaningfulHtml(currentContent || form.content)) {
      setError("Isi berita wajib diisi.");
      return;
    }

    if (normalizedCoverImage && !isAllowedCoverUrl(normalizedCoverImage)) {
      setError(
        "Link cover hanya mendukung Google Drive, domain website sendiri, atau Supabase Storage publik.",
      );
      return;
    }

    let publishedAtIso = "";
    if (form.published_at) {
      const publishedDate = new Date(form.published_at);
      if (Number.isNaN(publishedDate.getTime())) {
        setError("Tanggal publish tidak valid.");
        return;
      }
      publishedAtIso = publishedDate.toISOString();
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        slug: form.slug.trim(),
        is_published: Boolean(form.is_published),
        cover_image: normalizedCoverImage,
        content: currentContent || form.content || "",
        published_at: publishedAtIso,
      };

      const response = await fetch(
        editingId ? `/api/admin/berita/${editingId}` : "/api/admin/berita",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan berita.");
      }

      setMessage(data?.message || "Berita berhasil disimpan.");
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus berita "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/berita/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus berita.");
      }

      setMessage(data?.message || "Berita berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus berita.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${error
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
          {error || message}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Berita
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Daftar berita admin
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Kelola berita website: tambah, edit, hapus, cover image,
              kategori, tanggal publish, dan status tayang.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Tambah Berita
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-4">No</th>
                  <th className="px-4 py-4">Judul</th>
                  <th className="px-4 py-4">Kategori</th>
                  <th className="px-4 py-4">Publish</th>
                  <th className="px-4 py-4">Dibaca</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      Memuat data berita...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      Belum ada berita.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4 font-semibold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-4">
                          <CoverThumb
                            src={item.cover_image || ""}
                            alt={item.title || "Cover berita"}
                            className="h-16 w-20 shrink-0"
                          />

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 break-all text-xs text-slate-500">
                              /berita/{item.slug}
                            </p>
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.category || "Umum"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(item.published_at)}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {Number(item.views || 0).toLocaleString("id-ID")}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.is_published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {item.is_published ? "Tayang" : "Draft"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-4xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Form berita
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {titleForm}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Judul berita
                  </span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul berita"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Slug
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Slug akan dibuat otomatis"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">
                    Kosongkan jika ingin dibuat otomatis dari judul.
                  </p>
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Kategori
                  </span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    {BERITA_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Tanggal publish
                  </span>
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Ringkasan
                  </span>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tulis ringkasan singkat berita"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </label>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Cover image
                    </span>
                    <p className="text-xs text-slate-500">
                      Cover berita sekarang hanya memakai link URL. Gunakan link
                      gambar dari Google Drive, Supabase Storage publik, atau domain
                      website ini.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={form.cover_image ?? ""}
                      onChange={handleCoverLinkChange}
                      placeholder="Tempel link gambar cover"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-slate-500">
                      Pastikan link gambar bisa diakses publik agar cover tampil di
                      website.
                    </p>
                  </div>

                  {form.cover_image ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-800">
                        Cover saat ini
                      </p>
                      <div className="mt-3 overflow-hidden rounded-xl">
                        <CoverThumb
                          src={form.cover_image}
                          alt="Preview cover berita"
                          className="h-64 w-full"
                        />
                      </div>
                      <p className="mt-3 break-all text-xs text-slate-500">
                        {form.cover_image}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={form.cover_image}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Lihat cover
                        </a>
                        <button
                          type="button"
                          onClick={clearCoverImage}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Hapus cover
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Isi berita
                    </span>
                    <p className="text-xs text-slate-500">
                      Gunakan toolbar untuk format teks seperti bold, italic,
                      heading, list, dan justify.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <ToolbarButton
                      onClick={() => runEditorCommand("bold")}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("italic")}
                      title="Italic"
                    >
                      <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("underline")}
                      title="Underline"
                    >
                      <span className="underline">U</span>
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("insertUnorderedList")}
                      title="Bullet List"
                    >
                      • List
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("insertOrderedList")}
                      title="Number List"
                    >
                      1. List
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyLeft")}
                      title="Rata kiri"
                    >
                      Left
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyCenter")}
                      title="Rata tengah"
                    >
                      Center
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyRight")}
                      title="Rata kanan"
                    >
                      Right
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyFull")}
                      title="Rata kanan-kiri"
                    >
                      Justify
                    </ToolbarButton>

                    <select
                      onChange={handleFontFamilyChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Font
                      </option>
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </select>

                    <select
                      onChange={handleFontSizeChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Ukuran Font
                      </option>
                      <option value="1">Sangat Kecil</option>
                      <option value="2">Kecil</option>
                      <option value="3">Normal</option>
                      <option value="4">Sedang</option>
                      <option value="5">Besar</option>
                      <option value="6">Sangat Besar</option>
                      <option value="7">Ekstra Besar</option>
                    </select>

                    <select
                      onChange={handleBlockFormatChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Ukuran / Heading
                      </option>
                      <option value="p">Paragraf Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    className="min-h-70 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-emerald-500"
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Langsung tayang ke publik
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Update Berita"
                      : "Simpan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
