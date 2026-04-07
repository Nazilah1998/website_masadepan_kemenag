"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
const titleMap = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Ringkasan akun dan akses cepat panel admin.",
  },
  "/admin/berita": {
    title: "Kelola Berita",
    subtitle: "Tambah, edit, dan hapus berita website.",
  },
  "/admin/pengumuman": {
    title: "Kelola Pengumuman",
    subtitle: "Atur publikasi pengumuman resmi.",
  },
  "/admin/agenda": {
    title: "Kelola Agenda",
    subtitle: "Atur jadwal dan kegiatan instansi.",
  },
  "/admin/dokumen": {
    title: "Kelola Dokumen",
    subtitle: "Atur dokumen publik dan arsip unggahan.",
  },
};
export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!active) return;
        if (res.ok) {
          setUser(data?.user || null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }
    loadSession();
    return () => {
      active = false;
    };
  }, []);
  const pageInfo = useMemo(() => {
    if (titleMap[pathname]) return titleMap[pathname];
    if (pathname.startsWith("/admin/berita")) {
      return titleMap["/admin/berita"];
    }
    if (pathname.startsWith("/admin/pengumuman")) {
      return titleMap["/admin/pengumuman"];
    }
    if (pathname.startsWith("/admin/agenda")) {
      return titleMap["/admin/agenda"];
    }
    if (pathname.startsWith("/admin/dokumen")) {
      return titleMap["/admin/dokumen"];
    }
    return {
      title: "Admin Panel",
      subtitle: "Kelola data dan konten website.",
    };
  }, [pathname]);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      {" "}
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        {" "}
        <div className="flex items-start gap-3">
          {" "}
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
            aria-label="Buka menu admin"
          >
            {" "}
            ☰{" "}
          </button>{" "}
          <div>
            {" "}
            <h1 className="text-xl font-bold text-slate-900">
              {pageInfo.title}
            </h1>{" "}
            <p className="mt-1 text-sm text-slate-500">
              {pageInfo.subtitle}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 md:block">
            {" "}
            <p className="text-xs text-slate-500">Login sebagai</p>{" "}
            <p className="text-sm font-semibold text-slate-900">
              {" "}
              {user?.full_name || user?.email || "Admin"}{" "}
            </p>{" "}
          </div>{" "}
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:inline-flex">
            {" "}
            {user?.role || "admin"}{" "}
          </span>{" "}
          <AdminLogoutButton />{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
