import React from "react";
import { IconTrashWarning, IconAlertCircle } from "./BeritaIcons";

export function DeleteConfirmModal({
  open,
  item,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] dark:border-rose-900/60 dark:bg-slate-900">
        <div className="flex items-start gap-4 px-6 py-5">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
            <IconTrashWarning />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Konfirmasi hapus berita
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tutup konfirmasi hapus"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-2">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 dark:border-rose-900/40 dark:bg-rose-950/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
              Berita yang akan dihapus
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-100">
              {item.title}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Ya, hapus berita"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CloseFormConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] dark:border-amber-900/60 dark:bg-slate-900">
        <div className="flex items-start gap-4 px-6 py-5">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
            <IconAlertCircle />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Tutup form berita?
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Perubahan belum disimpan. Tutup form dan buang perubahan?
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tutup konfirmasi tutup form"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-2">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
              Jika ditutup sekarang, semua perubahan pada form akan hilang.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Lanjut mengedit
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Ya, tutup & buang
          </button>
        </div>
      </div>
    </div>
  );
}
