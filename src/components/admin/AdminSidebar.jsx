"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/berita", label: "Berita", icon: "📰" },
];

function NavLinks({ pathname, onClose }) {
  return (
    <nav className="mt-4 space-y-2">
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
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <span className="text-base" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
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
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[288px] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="rounded-[28px] bg-emerald-600 px-5 py-6 text-white shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-50/90">
            Admin Panel
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight">
            Kemenag Barito Utara
          </h2>

          <p className="mt-4 text-sm leading-7 text-emerald-50/95">
            Kelola konten website publik dari satu panel yang lebih rapi dan
            fokus.
          </p>
        </div>

        <div className="mt-5">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            Navigasi
          </p>

          <NavLinks pathname={pathname} onClose={onClose} />
        </div>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5">
          <p className="text-sm font-semibold text-slate-900">Akses cepat</p>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Buka website publik untuk melihat hasil perubahan yang sudah tayang.
          </p>

          <Link
            href="/"
            onClick={onClose}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Kembali ke website
          </Link>
        </div>
      </aside>
    </>
  );
}