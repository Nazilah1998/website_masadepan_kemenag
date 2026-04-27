import React from "react";
import Link from "next/link";

export function DesktopNav({
  navigationItems,
  pathname,
  openDesktopDropdown,
  toggleDesktopDropdown,
  setOpenDesktopDropdown,
  locale,
  setLocale,
  theme,
  setLightTheme,
  setDarkTheme,
  adminState,
  desktopDropdownRef,
}) {
  return (
    <nav className="hidden border-t border-slate-100 py-1 dark:border-slate-900 lg:block">
      <div className="flex items-center justify-between">
        <ul className="flex flex-nowrap items-center gap-1" ref={desktopDropdownRef}>
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDesktopDropdown === item.label;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenDesktopDropdown(item.label)}
                onMouseLeave={() => hasChildren && setOpenDesktopDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition ${active
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                    }`}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </Link>

                {hasChildren && isOpen && (
                  <div className="absolute left-0 top-full z-50 pt-2 min-w-[220px] animate-scale-in">
                    <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                      <ul className="space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100/80 p-1 ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-800 backdrop-blur-sm">
            {["id", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-full px-3 py-1 text-[11px] font-black uppercase transition ${locale === l
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-none"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100/80 p-1 ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-800 backdrop-blur-sm">
            <button
              onClick={setLightTheme}
              className={`rounded-full p-1.5 transition ${theme === "light" ? "bg-amber-400 text-white shadow-sm shadow-amber-200" : "text-slate-400 hover:text-slate-600"
                }`}
              aria-label="Light Mode"
            >
              <SunIcon className="h-4 w-4" />
            </button>
            <button
              onClick={setDarkTheme}
              className={`rounded-full p-1.5 transition ${theme === "dark" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              aria-label="Dark Mode"
            >
              <MoonIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-emerald-700 px-5 py-2 text-xs font-black text-white transition hover:bg-emerald-800"
          >
            <div className="absolute inset-0 bg-white/10 transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
            <span className="relative">{adminState?.user ? "Panel Admin" : "Login"}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
