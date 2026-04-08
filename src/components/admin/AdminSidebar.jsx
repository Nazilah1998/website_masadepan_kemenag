"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/pengumuman", label: "Pengumuman" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/dokumen", label: "Dokumen" },
];

function NavLinks({ pathname, onClose }) {
  return (
    <nav className="mt-6 space-y-2">
      {menuItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={[
              "block rounded-2xl px-4 py-3 text-sm font-medium transition",
              active
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      ) : null}

      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white shadow-sm transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Admin Panel
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Kemenag Barito Utara
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kelola konten website publik.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <NavLinks pathname={pathname} onClose={onClose} />
          </div>

          <div className="border-t border-slate-200 px-4 py-4">
            <Link
              href="/"
              onClick={onClose}
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Kembali ke website
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}