import React from "react";
import { Badge, IconButton } from "./EditorUI";
import {
  CheckIcon,
  PowerIcon,
  ShieldIcon,
  TrashIcon
} from "./EditorIcons";

export function EditorCard({
  index,
  editor,
  onOpenToggleActiveModal,
  onOpenPermissions,
  onOpenRoleModal,
  onDelete,
  onOpenVerifyModal,
  busyAction,
  getPermissionCount,
}) {
  const role = editor.role === "admin" ? "admin" : "editor";
  const isPending = editor.status === "pending";
  const isApproved = editor.status === "approved";
  const isRejected = editor.status === "rejected";
  const isActive = Boolean(editor.is_active);

  const verifying =
    busyAction === `approve:${editor.user_id}` ||
    busyAction === `reject:${editor.user_id}`;
  const toggling = busyAction === `toggle:${editor.user_id}`;
  const deleting = busyAction === `delete:${editor.user_id}`;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
              {index}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editor.full_name}
              </h3>
              <p className="mt-0.5 break-all text-sm text-slate-600 dark:text-slate-400">
                {editor.email}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Unit kerja
              </p>
              <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                {editor.unit_name || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Role
              </p>
              <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                {role}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Permission
              </p>
              <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                {getPermissionCount(editor)} akses
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isPending ? <Badge tone="amber">Pending</Badge> : null}
            {isApproved ? <Badge tone="emerald">Approved</Badge> : null}
            {isRejected ? <Badge tone="rose">Rejected</Badge> : null}
            <Badge tone={isActive ? "blue" : "slate"}>
              {isActive ? "Akun aktif" : "Akun nonaktif"}
            </Badge>
            <Badge tone="violet">{role === "admin" ? "Admin" : "Editor"}</Badge>
          </div>
        </div>

        <div className="lg:w-auto lg:min-w-47">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Aksi cepat
          </p>

          <div className="flex flex-wrap gap-2">
            <IconButton
              label={verifying ? "Memproses verifikasi" : "Verifikasi editor"}
              icon={<CheckIcon />}
              onClick={() => onOpenVerifyModal(editor)}
              disabled={verifying}
              loading={verifying}
              tone="emerald"
            />
            <IconButton
              label={
                toggling
                  ? "Memproses status akun"
                  : "Atur status akun"
              }
              icon={<PowerIcon />}
              onClick={() => onOpenToggleActiveModal(editor)}
              disabled={toggling}
              loading={toggling}
              tone="slate"
            />
            <IconButton
              label="Atur permission"
              icon={<ShieldIcon />}
              onClick={() => onOpenPermissions(editor)}
              tone="blue"
            />
            <IconButton
              label="Ubah role"
              icon={<span className="text-xs font-bold">R</span>}
              onClick={() => onOpenRoleModal(editor)}
              tone="slate"
            />
            <IconButton
              label={deleting ? "Menghapus akun..." : "Hapus akun"}
              icon={<TrashIcon />}
              onClick={() => onDelete(editor)}
              disabled={deleting}
              loading={deleting}
              tone="rose"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
