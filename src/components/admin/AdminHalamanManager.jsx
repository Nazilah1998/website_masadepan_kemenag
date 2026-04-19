"use client";

import { useCallback, useEffect, useState } from "react";

const emptyForm = {
  id: null,
  slug: "",
  title: "",
  description: "",
  content: "",
  is_published: false,
};

function fmtDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

export default function AdminHalamanManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/halaman", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal memuat halaman.");
      setItems(data.items || []);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleChange = (field) => (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      slug: item.slug || "",
      title: item.title || "",
      description: item.description || "",
      content: item.content || "",
      is_published: Boolean(item.is_published),
    });
    setMessage(null);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/halaman", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan halaman.");

      setMessage(form.id ? "Halaman diperbarui." : "Halaman dibuat.");
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus halaman "${item.title}"? Aksi ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/halaman?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal menghapus halaman.");
      setMessage("Halaman dihapus.");
      await loadItems();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          CMS Halaman Statis
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Kelola halaman informatif yang dapat diakses lewat{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800 dark:text-slate-200">/halaman/[slug]</code>.
        </p>
      </header>

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-900/20 dark:text-emerald-300">
          {message}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
          {errorMessage}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mb-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {form.id ? "Edit Halaman" : "Halaman Baru"}
          </h2>
          {form.id ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Batal Edit
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <input
              required
              minLength={3}
              maxLength={200}
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Slug (opsional)
            </span>
            <input
              type="text"
              value={form.slug}
              onChange={handleChange("slug")}
              placeholder="otomatis dari judul"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Deskripsi singkat (SEO)
          </span>
          <input
            type="text"
            maxLength={500}
            value={form.description}
            onChange={handleChange("description")}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Konten HTML *</span>
          <textarea
            required
            minLength={10}
            rows={12}
            value={form.content}
            onChange={handleChange("content")}
            placeholder="<p>Isi halaman dalam HTML sederhana.</p>"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            Tag yang diperbolehkan dibersihkan otomatis (anti XSS).
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={handleChange("is_published")}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Terbitkan sekarang
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Buat Halaman"}
          </button>
        </div>
      </form>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Daftar Halaman
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat daftar halaman...</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
            Belum ada halaman statis. Buat halaman pertama Anda di atas.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Diperbarui</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <a
                        href={`/halaman/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-emerald-700 hover:underline"
                      >
                        /{item.slug}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {item.is_published ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Publish
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {fmtDate(item.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="mr-2 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="text-xs font-semibold text-rose-700 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
