import React from "react";
import {
  AVAILABLE_EDITOR_PERMISSION_GROUPS,
  getEditorPermissionGroupLabel,
} from "@/lib/permissions";

export function PermissionsModal({
  open,
  editor,
  selectedPermissions,
  onTogglePermission,
  onClose,
  onSave,
  saving,
}) {
  if (!open || !editor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Permission Editor
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {editor.full_name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {AVAILABLE_EDITOR_PERMISSION_GROUPS.map((permissionGroup) => {
            const checked = selectedPermissions.includes(permissionGroup);

            return (
              <label
                key={permissionGroup}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${checked
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onTogglePermission(permissionGroup)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {getEditorPermissionGroupLabel(permissionGroup)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {permissionGroup}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VerifyStatusModal({
  open,
  editor,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  if (!open || !editor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Verifikasi Editor
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {editor.full_name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pilih status verifikasi lalu simpan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${value === "approve"
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Approve
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Setujui akun editor
              </p>
            </div>
            <input
              type="radio"
              name="verify-status"
              value="approve"
              checked={value === "approve"}
              onChange={() => onChange("approve")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label
            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${value === "reject"
              ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Reject
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Tolak akun editor
              </p>
            </div>
            <input
              type="radio"
              name="verify-status"
              value="reject"
              checked={value === "reject"}
              onChange={() => onChange("reject")}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToggleActiveModal({
  open,
  editor,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  if (!open || !editor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Status Akun Editor
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {editor.full_name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pilih status akun lalu simpan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${value === "activate"
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Aktifkan akun
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Editor dapat mengakses panel sesuai izin
              </p>
            </div>
            <input
              type="radio"
              name="active-status"
              value="activate"
              checked={value === "activate"}
              onChange={() => onChange("activate")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label
            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${value === "deactivate"
              ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
              : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Nonaktifkan akun
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Editor tidak dapat mengakses panel
              </p>
            </div>
            <input
              type="radio"
              name="active-status"
              value="deactivate"
              checked={value === "deactivate"}
              onChange={() => onChange("deactivate")}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RoleModal({
  open,
  editor,
  roleDraft,
  onChangeRole,
  onClose,
  onSave,
  saving,
}) {
  if (!open || !editor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Ubah Role Akun
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {editor.full_name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Editor
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Hanya mengelola konten sesuai permission yang diberikan
              </p>
            </div>
            <input
              type="radio"
              name="role"
              value="editor"
              checked={roleDraft === "editor"}
              onChange={() => onChangeRole("editor")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Admin
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Akses lebih luas untuk mengelola konten dan pengaturan
              </p>
            </div>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={roleDraft === "admin"}
              onChange={() => onChangeRole("admin")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
