import React from "react";

export function SlideTable({ items, loading, onEdit, onDelete, deletingId, toNumber }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white dark:bg-slate-900/40">
          <thead className="bg-slate-50 dark:bg-slate-800/70">
            <tr>
              {["Judul", "Caption", "Urutan", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableMessage colSpan={5} message="Memuat data slide..." />
            ) : items.length === 0 ? (
              <TableMessage colSpan={5} message="Belum ada slide." />
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top dark:border-slate-800">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{item.caption || "-"}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{toNumber(item.sort_order, 0)}</td>
                  <td className="px-4 py-4 text-sm">
                    <StatusBadge isPublished={item.is_published} />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => onEdit(item)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                      <button onClick={() => onDelete(item.id)} disabled={deletingId === item.id} className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/60 dark:text-rose-300">
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
  );
}

function TableMessage({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-slate-500">{message}</td>
    </tr>
  );
}

function StatusBadge({ isPublished }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}>
      {isPublished ? "Publish" : "Draft"}
    </span>
  );
}
