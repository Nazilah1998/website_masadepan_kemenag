import React from "react";

export function SlideFormModal({
  open, editingId, form, imagePreview,
  saving, uploadingImage,
  onClose, onChange, onFileChange, onSave,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-slate-950/70 p-4">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <ModalHeader editingId={editingId} onClose={onClose} />

        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4">
            <FormInput label="Judul" name="title" value={form.title} onChange={onChange} placeholder="Judul slide" />
            <FormTextarea label="Caption" name="caption" value={form.caption} onChange={onChange} placeholder="Teks di bawah gambar" />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Urutan" type="number" name="sort_order" value={form.sort_order} onChange={onChange} />
              <label className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input type="checkbox" name="is_published" checked={Boolean(form.is_published)} onChange={onChange} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                Publish
              </label>
            </div>

            <ImageUploadSection onFileChange={onFileChange} uploading={uploadingImage} />

            <div className="flex flex-wrap gap-3">
              <button onClick={onClose} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Batal</button>
              <button onClick={onSave} disabled={saving || uploadingImage} className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Slide"}</button>
            </div>
          </div>

          <ImagePreviewSection preview={imagePreview} />
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ editingId, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 px-6 py-5 dark:border-slate-800">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Form Slider</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{editingId ? "Edit Slide" : "Tambah Slide"}</h3>
      </div>
      <button onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300">Tutup</button>
    </div>
  );
}

function FormInput({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input {...props} type={type} className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
    </div>
  );
}

function FormTextarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <textarea {...props} rows={4} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
    </div>
  );
}

function ImageUploadSection({ onFileChange, uploading }) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">Upload gambar slide</label>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">JPG/PNG/WEBP. Gambar akan diproses sebelum disimpan.</p>
      <input type="file" accept="image/*" onChange={onFileChange} className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
      {uploading && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">Memproses gambar...</p>}
    </div>
  );
}

function ImagePreviewSection({ preview }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preview gambar</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {preview ? (
          <img src={preview} alt="Preview slide" className="h-64 w-full object-contain bg-slate-100 dark:bg-slate-800" />
        ) : (
          <div className="flex h-48 items-center justify-center px-4 text-center text-sm text-slate-500 dark:text-slate-400">Preview gambar akan muncul di sini.</div>
        )}
      </div>
    </div>
  );
}
