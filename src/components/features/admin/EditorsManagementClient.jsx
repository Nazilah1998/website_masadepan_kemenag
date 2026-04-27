"use client";

import React from "react";
import { useEditorsManagement } from "@/hooks/useEditorsManagement";
import { EditorCard } from "./editors/EditorCard";
import { EditorHeader, EditorFilters } from "./editors/EditorManagementUI";
import { EditorConfirmDialog, EditorToast } from "./editors/EditorDialogs";
import {
  PermissionsModal,
  VerifyStatusModal,
  ToggleActiveModal,
  RoleModal,
} from "./editors/EditorModals";

export default function EditorsManagementClient({ initialEditors = [] }) {
  const e = useEditorsManagement(initialEditors);

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-7">
          <EditorHeader 
            pendingCount={e.pendingCount} 
            filteredCount={e.filteredEditors.length} 
            totalCount={e.editors.length} 
          />
          <EditorFilters 
            search={e.search} setSearch={e.setSearch} 
            filterRole={e.filterRole} setFilterRole={e.setFilterRole} 
          />
        </div>

        <div className="space-y-3">
          {e.loading ? (
            <p className="text-sm text-slate-500">Memuat data editor...</p>
          ) : e.filteredEditors.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada data editor yang sesuai.</p>
          ) : (
            e.filteredEditors.map((item, idx) => (
              <EditorCard
                key={item.user_id} index={idx + 1} editor={item}
                onOpenToggleActiveModal={e.openToggleActiveModal}
                onOpenPermissions={e.openPermissions}
                onOpenRoleModal={e.openRoleModal}
                onDelete={e.handleDelete}
                onOpenVerifyModal={e.openVerifyModal}
                busyAction={e.busyAction}
                getPermissionCount={e.getPermissionCount}
              />
            ))
          )}
        </div>

        {(e.message || e.error) && (
          <p className={`text-sm ${e.message ? "text-emerald-600" : "text-rose-600"}`}>
            {e.message || e.error}
          </p>
        )}
      </div>

      <PermissionsModal
        open={e.modalOpen} editor={e.activeEditor} selectedPermissions={e.selectedPermissions}
        onTogglePermission={e.togglePermission} onClose={e.closePermissions}
        onSave={e.savePermissions} saving={e.savingPermissions}
      />

      <VerifyStatusModal
        open={e.verifyModalOpen} editor={e.verifyEditor} value={e.verifyDecision}
        onChange={e.setVerifyDecision} onClose={e.closeVerifyModal}
        onSave={e.saveVerifyDecision}
        saving={Boolean(e.verifyEditor) && (e.busyAction === `approve:${e.verifyEditor.user_id}` || e.busyAction === `reject:${e.verifyEditor.user_id}`)}
      />

      <ToggleActiveModal
        open={e.toggleActiveModalOpen} editor={e.toggleActiveEditor} value={e.toggleActiveDecision}
        onChange={e.setToggleActiveDecision} onClose={e.closeToggleActiveModal}
        onSave={e.saveToggleActiveDecision}
        saving={Boolean(e.toggleActiveEditor) && e.busyAction === `toggle:${e.toggleActiveEditor.user_id}`}
      />

      <RoleModal
        open={e.roleModalOpen} editor={e.roleEditor} roleDraft={e.roleDraft}
        onChangeRole={e.setRoleDraft} onClose={e.closeRoleModal}
        onSave={e.saveRole} saving={e.savingRole}
      />

      <EditorConfirmDialog dialog={e.confirmDialog} onClose={e.closeConfirmDialog} />
      <EditorToast toast={e.toast} />
    </>
  );
}
