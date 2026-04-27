import React from "react";
import { IconPlus } from "./BeritaIcons";

export function BeritaFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  yearOptions,
  monthOptions,
  onAddClick,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Berita
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Daftar berita
          </h3>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <IconPlus />
          Tambah berita
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2.3fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)] xl:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Cari berita
          </label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul, slug, kategori, atau ringkasan..."
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Filter status
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua status</option>
            <option value="published">Tayang</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Filter tahun
          </label>
          <select
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua tahun</option>
            {yearOptions.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label} ({item.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Filter bulan
          </label>
          <select
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua bulan</option>
            {monthOptions.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label} ({item.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Menampilkan {filteredCount} dari {totalCount} berita.
      </div>
    </div>
  );
}
