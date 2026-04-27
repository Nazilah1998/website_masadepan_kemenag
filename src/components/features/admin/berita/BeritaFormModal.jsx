import React from "react";
import {
  ToolbarButton,
  ToggleSwitch,
  CoverThumb
} from "./BeritaUI";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconH2,
  IconH3,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconJustify,
  IconQuote,
  IconBullet,
  IconNumber,
  IconLink,
  IconClear
} from "./BeritaIcons";
import { BERITA_CATEGORIES } from "@/lib/berita-utils";

export function BeritaFormModal({
  open,
  editingId,
  form,
  dirty,
  saving,
  uploadingCover,
  wordCount,
  readingTime,
  previewSlug,
  coverPreviewSrc,
  editorRef,
  onClose,
  onChange,
  onPublishedToggle,
  onEditorInput,
  onEditorPaste,
  onRunCommand,
  onInsertLink,
  onCoverChange,
  onClearCover,
  onSave,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4">
      <div className="mx-auto flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl dark:bg-slate-950">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Form berita
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {editingId ? "Edit berita" : "Tambah berita"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {dirty
                ? "Ada perubahan yang belum disimpan."
                : "Form siap disimpan."}
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

        <div className="min-h-0 overflow-y-auto p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Judul berita
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={onChange}
                      placeholder="Masukkan judul berita"
                      className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Slug
                    </label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={onChange}
                      placeholder="slug-berita"
                      className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Preview URL: /berita/{previewSlug}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={onChange}
                      className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {BERITA_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tanggal publish
                    </label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      value={form.published_at}
                      onChange={onChange}
                      className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Editor isi berita
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fokus pada struktur yang rapi dan mudah dibaca.
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {wordCount} kata • {readingTime} menit baca
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <ToolbarButton
                    title="Bold"
                    onClick={() => onRunCommand("bold")}
                  >
                    <IconBold />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Italic"
                    onClick={() => onRunCommand("italic")}
                  >
                    <IconItalic />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Underline"
                    onClick={() => onRunCommand("underline")}
                  >
                    <IconUnderline />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Heading 2"
                    onClick={() => onRunCommand("formatBlock", "h2")}
                  >
                    <IconH2 />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Heading 3"
                    onClick={() => onRunCommand("formatBlock", "h3")}
                  >
                    <IconH3 />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Rata kiri"
                    onClick={() => onRunCommand("justifyLeft")}
                  >
                    <IconAlignLeft />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Tengah"
                    onClick={() => onRunCommand("justifyCenter")}
                  >
                    <IconAlignCenter />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Rata kanan"
                    onClick={() => onRunCommand("justifyRight")}
                  >
                    <IconAlignRight />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Rata penuh"
                    onClick={() => onRunCommand("justifyFull")}
                  >
                    <IconJustify />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Quote"
                    onClick={() =>
                      onRunCommand("formatBlock", "blockquote")
                    }
                  >
                    <IconQuote />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Bullet list"
                    onClick={() => onRunCommand("insertUnorderedList")}
                  >
                    <IconBullet />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Number list"
                    onClick={() => onRunCommand("insertOrderedList")}
                  >
                    <IconNumber />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Insert link"
                    onClick={onInsertLink}
                  >
                    <IconLink />
                  </ToolbarButton>

                  <ToolbarButton
                    title="Clear format"
                    onClick={() => onRunCommand("removeFormat")}
                  >
                    <IconClear />
                  </ToolbarButton>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onEditorInput}
                  onPaste={onEditorPaste}
                  className="h-125 overflow-y-auto rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:**:bg-transparent dark:**:text-inherit"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Status</h4>

                <div className="mt-4">
                  <ToggleSwitch
                    checked={form.is_published}
                    onChange={onPublishedToggle}
                    label={`Status ${form.is_published ? "Tayang" : "Draft"
                      }`}
                    description="Atur apakah berita langsung dipublikasikan atau disimpan sebagai draft."
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-lg font-bold text-slate-900">
                    Cover image
                  </h4>

                  {(form.cover_image || form.cover_upload_base64) && (
                    <button
                      type="button"
                      onClick={onClearCover}
                      className="text-sm font-semibold text-rose-700 transition hover:text-rose-800"
                    >
                      Hapus cover
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onCoverChange}
                    />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        {uploadingCover
                          ? "Memproses cover..."
                          : "Upload cover berita"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, atau WEBP. Sistem Kompres Otomatis Maksimal 100 KB.
                      </p>
                    </div>
                  </label>

                  <CoverThumb
                    key={coverPreviewSrc || "cover-empty"}
                    src={coverPreviewSrc}
                    alt="Preview cover berita"
                    className="h-56 w-full"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={() => onSave(false)}
                    disabled={saving || uploadingCover}
                    className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : "Simpan sebagai draft"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSave(true)}
                    disabled={saving || uploadingCover}
                    className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : "Simpan & tayangkan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
