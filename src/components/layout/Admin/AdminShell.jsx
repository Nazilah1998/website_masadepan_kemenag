"use client";

import React from "react";
import { useAdminShell } from "@/hooks/useAdminShell";
import { useTheme } from "@/context/ThemeContext";
import AdminSidebar from "./Sidebar/AdminSidebar";
import AdminThemeToggle from "./Header/AdminThemeToggle";
import { MenuIcon, CloseIcon } from "./AdminShellUI";

export default function AdminShell({ children }) {
  const a = useAdminShell();
  const { isDark, toggleTheme } = useTheme();

  if (a.loading) return <AdminLoading />;

  // If we are not loading and not an admin/editor, 
  // just render the children (which might be the Login form)
  if (!a.role) {
    return <div className="admin-unauthenticated-root">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="sticky top-0 h-screen border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <AdminSidebar profile={a.profile} role={a.role} permissionContext={a.permissionContext} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar a={a} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <div className="min-w-0 flex items-center gap-3">
              <button type="button" onClick={() => a.setSidebarOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 lg:hidden">
                <MenuIcon />
              </button>
              <AdminBrand />
            </div>

            <div className="flex items-center gap-2">
              <AdminThemeToggle isDark={isDark} toggle={toggleTheme} />
              <AdminUserBadge name={a.compactName} email={a.profile?.email} />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-700" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Memuat panel admin...</p>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
      <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">Kemenag Barito Utara</h1>
    </div>
  );
}

function AdminUserBadge({ name, email }) {
  return (
    <div className="hidden w-55 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 sm:block">
      <p className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{name}</p>
      <p className="truncate text-xs leading-5 text-slate-500 dark:text-slate-400">{email || "-"}</p>
    </div>
  );
}

function MobileSidebar({ a }) {
  if (!a.sidebarOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" onClick={() => a.setSidebarOpen(false)} className="absolute inset-0 bg-slate-950/45" />
      <div className="relative h-full w-[85%] max-w-[320px] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Kemenag Barito Utara</p>
          </div>
          <button type="button" onClick={() => a.setSidebarOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:text-rose-400">
            <CloseIcon />
          </button>
        </div>
        <AdminSidebar profile={a.profile} role={a.role} permissionContext={a.permissionContext} onNavigate={() => a.setSidebarOpen(false)} />
      </div>
    </div>
  );
}