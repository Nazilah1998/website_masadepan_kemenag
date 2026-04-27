import React from "react";
import Link from "next/link";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function GalleryHeader({ count }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">Dokumentasi</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">Galeri Kegiatan</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base dark:text-slate-300">
          Kumpulan dokumentasi visual yang terhubung langsung ke berita dan publikasi resmi.
        </p>
      </div>
      <div className="w-fit rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Total item</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{count}</p>
      </div>
    </div>
  );
}

export function GalleryCard({ item, onOpen }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <button type="button" onClick={onOpen} className="block w-full cursor-zoom-in text-left">
        <div className="relative aspect-3/4 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">Lihat gambar</div>
        </div>
      </button>
      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{formatDate(item.publishedAt)}</p>
        <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-slate-900 dark:text-slate-100">{item.title}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onOpen} className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">Preview</button>
          {item.linkUrl && (
            <Link href={item.linkUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
              Buka berita <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function GalleryEmpty() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">Galeri</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Belum ada item galeri</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">Item galeri akan tampil di halaman ini setelah berita dikirim dari panel admin ke galeri.</p>
    </div>
  );
}
