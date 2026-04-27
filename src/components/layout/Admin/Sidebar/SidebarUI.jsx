import React from "react";
import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export function SidebarNavLink({ href, label, icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
          ? "bg-emerald-700 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
    >
      <span className={active ? "text-white" : "text-slate-500 dark:text-slate-400"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function SidebarProfile({ profile, role, permissionContext }) {
  const compactName = String(profile?.full_name || "").trim() || String(profile?.email || "").split("@")[0] || "Admin";

  return (
    <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Login sebagai</p>
        <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900 dark:text-slate-100">{compactName}</p>
        <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{profile?.email || "-"}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600">Role: {role || "-"}</span>
          {role === "editor" && (
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${permissionContext?.approved && permissionContext?.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-700" : "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700"}`}>
              {permissionContext?.approved && permissionContext?.isActive ? "Editor aktif" : "Menunggu verifikasi"}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4"><AdminLogoutButton /></div>
    </div>
  );
}
