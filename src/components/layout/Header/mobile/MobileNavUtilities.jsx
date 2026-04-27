import React from "react";
import Link from "next/link";

export function MobileNavUtilities({
  locale, setLocale,
  theme, setLightTheme, setDarkTheme,
  adminState
}) {
  return (
    <div className="mt-auto border-t border-slate-100 p-6 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="grid grid-cols-2 gap-4">
        {/* Language Switcher */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Bahasa</p>
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            {["id", "en"].map((l) => (
              <button
                key={l} onClick={() => setLocale(l)}
                className={`flex-1 rounded-xl py-2 text-xs font-black uppercase transition ${locale === l ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Tema</p>
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <button
              onClick={setLightTheme}
              className={`flex-1 flex justify-center rounded-xl py-2 transition ${theme === "light" ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              aria-label="Light Mode"
            >
              <SunIcon className="h-4 w-4" />
            </button>
            <button
              onClick={setDarkTheme}
              className={`flex-1 flex justify-center rounded-xl py-2 transition ${theme === "dark" ? "bg-indigo-600 text-white shadow-md dark:shadow-none" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              aria-label="Dark Mode"
            >
              <MoonIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Link
        href="/admin"
        className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-700 py-4 text-center text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-800 active:scale-95 dark:shadow-none"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
        {adminState?.user ? "Panel Admin" : "Login Admin"}
      </Link>
    </div>
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
