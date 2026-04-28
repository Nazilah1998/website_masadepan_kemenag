import React from "react";
import { CoverThumb } from "./BeritaUI";

export function BeritaGalleryModal({
  open,
  form,
  previewSrc,
  sendingId,
  uploading,
  prefillLoading,
  isAlreadyInGallery,
  onClose,
  onChange,
  onFileChange,
  onClearImage,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 p-4">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
                Form galeri
              </p>
              {isAlreadyInGallery && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <span className="mr-1 h-1 w-1 rounded-full bg-emerald-500"></span>
                  Terdaftar di Galeri
                </span>
              )}
            </div>
            <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isAlreadyInGallery ? "Perbarui Galeri" : "Kirim ke Galeri"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isAlreadyInGallery
                ? "Data galeri sudah ada. Anda dapat memperbarui informasi atau mengganti foto."
                : "Upload cover galeri dengan kompres otomatis."}
            </p>
          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:text-rose-300"
          >
            Tutup
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Judul galeri
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Judul galeri"
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tautan berita (Link URL)
                </label>
                <input
                  name="link_url"
                  value={form.link_url}
                  onChange={onChange}
                  placeholder="/berita/judul-slug"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tanggal galeri
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={form.published_at ? form.published_at.slice(0, 16) : ""}
                  onChange={onChange}
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Gambar galeri
                </label>
                {(form.image_url || form.gallery_upload_base64) && (
                  <button
                    type="button"
                    onClick={onClearImage}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                  >
                    Hapus gambar
                  </button>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <div>
                  <p className="text-sm font-semibold text-sky-700">
                    {uploading
                      ? "Memproses..."
                      : isAlreadyInGallery
                        ? "Ganti Foto Galeri (Portrait)"
                        : "Pilih Foto Galeri (Portrait)"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Auto Compress Gambar
                  </p>
                </div>
              </label>

              <CoverThumb
                key={previewSrc || "gallery-empty"}
                src={previewSrc}
                alt="Preview gambar galeri"
                className="aspect-[3/4] w-full max-w-[240px] mx-auto rounded-2xl shadow-md"
                fallbackText={
                  prefillLoading ? "Memuat data..." : "Belum ada gambar"
                }
              />

            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-3xl border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              Boolean(sendingId) || uploading || prefillLoading
            }
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingId
              ? "Mengirim..."
              : isAlreadyInGallery
                ? "Perbarui Data Galeri"
                : "Simpan ke Galeri"}
          </button>

        </div>
      </div>
    </div>
  );
}
