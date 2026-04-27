"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/lib/permissions";
import { SidebarNavLink, SidebarProfile } from "./SidebarUI";
import { DashboardIcon, NewsIcon, FolderIcon, SliderIcon, UsersIcon, AuditIcon } from "./SidebarIcons";

function hasAccess(context, permission) {
  if (!context) return false;
  if (context.isSuperAdmin) return true;
  return Array.isArray(context.permissions) ? context.permissions.includes(permission) : false;
}

export default function AdminSidebar({ profile, role, permissionContext, onNavigate }) {
  const pathname = usePathname();
  const ctx = permissionContext;

  const links = [
    { href: "/admin", label: "Dashboard", icon: <DashboardIcon />, active: pathname === "/admin", show: hasAccess(ctx, PERMISSIONS.DASHBOARD_VIEW) },
    { href: "/admin/berita", label: "Berita", icon: <NewsIcon />, active: pathname.startsWith("/admin/berita"), show: hasAccess(ctx, PERMISSIONS.BERITA_VIEW) },
    { href: "/admin/laporan", label: "Dokumen Laporan", icon: <FolderIcon />, active: pathname === "/admin/laporan" || pathname.startsWith("/admin/laporan/"), show: hasAccess(ctx, PERMISSIONS.LAPORAN_VIEW) },
    { href: "/admin/homepage-slides", label: "Slider Beranda", icon: <SliderIcon />, active: pathname.startsWith("/admin/homepage-slides"), show: hasAccess(ctx, PERMISSIONS.HOMEPAGE_SLIDES_VIEW) },
    { href: "/admin/audit", label: "Audit Log", icon: <AuditIcon />, active: pathname.startsWith("/admin/audit"), show: hasAccess(ctx, PERMISSIONS.AUDIT_VIEW) },
    { href: "/admin/editors", label: "Manajemen Editor", icon: <UsersIcon />, active: pathname.startsWith("/admin/editors"), show: role === "super_admin" },
  ];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Navigasi</p>
        <nav className="space-y-2">
          {links.filter(l => l.show).map(l => (
            <SidebarNavLink key={l.href} {...l} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
      <SidebarProfile profile={profile} role={role} permissionContext={ctx} />
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Admin CMS</p>
      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Kemenag Barito Utara</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Kelola konten website publik dengan panel yang ringkas dan fokus.</p>
    </div>
  );
}
