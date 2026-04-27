import React from "react";
import { Badge, FilterButton } from "./EditorUI";
import { SearchIcon } from "./EditorIcons";

export function EditorHeader({ pendingCount, filteredCount, totalCount }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Super Admin Only
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Manajemen Editor
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Verifikasi akun editor baru, aktifkan atau nonaktifkan akun, dan
          tentukan akses menu sesuai kebutuhan kerja masing-masing editor.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="amber">Pending: {pendingCount}</Badge>
        <Badge tone="blue">Total tampil: {filteredCount}</Badge>
        <Badge tone="slate">Total data: {totalCount}</Badge>
      </div>
    </div>
  );
}

export function EditorFilters({ 
  search, 
  setSearch, 
  filterRole, 
  setFilterRole 
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, email, unit kerja, role, atau status"
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-emerald-900/40"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "admin", "editor"].map((role) => (
          <FilterButton
            key={role}
            active={filterRole === role}
            onClick={() => setFilterRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </FilterButton>
        ))}
      </div>
    </div>
  );
}
