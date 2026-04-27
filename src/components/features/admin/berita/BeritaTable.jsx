import React from "react";
import { StatusPill, ActionIconButton } from "./BeritaUI";
import { IconPencil, IconTrash, IconGallery } from "./BeritaIcons";
import { formatDate, getItemBaseDate, getItemPublishedState } from "@/lib/berita-utils";

export function BeritaTable({
  items,
  loading,
  startIndex,
  onEdit,
  onDelete,
  onGallery,
  deletingId,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-300 w-full border-collapse bg-white dark:bg-slate-900/40">
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "54%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>

          <thead className="bg-slate-50 dark:bg-slate-800/70">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                No
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Judul
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Kategori
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Dibaca
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Memuat data berita...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Belum ada data yang cocok.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 align-top dark:border-slate-800"
                >
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-4">
                    <div className="pr-10">
                      <p className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="mt-1 wrap-break-word text-xs text-slate-500 dark:text-slate-400">
                        /berita/{item.slug}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(getItemBaseDate(item))}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {item.category || "-"}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {Number(item.views || 0)}
                  </td>

                  <td className="px-4 py-4">
                    <StatusPill published={getItemPublishedState(item)} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <ActionIconButton
                        title="Edit berita"
                        onClick={() => onEdit(item)}
                        variant="neutral"
                      >
                        <IconPencil />
                      </ActionIconButton>

                      <ActionIconButton
                        title={
                          deletingId === item.id
                            ? "Menghapus berita"
                            : "Hapus berita"
                        }
                        onClick={() => onDelete(item)}
                        disabled={deletingId === item.id}
                        variant="danger"
                      >
                        <IconTrash />
                      </ActionIconButton>

                      <ActionIconButton
                        title="Kirim atau edit galeri"
                        onClick={() => onGallery(item)}
                        variant="sky"
                      >
                        <IconGallery />
                      </ActionIconButton>
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
