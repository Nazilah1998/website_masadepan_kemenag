import React from "react";

export function EyeIcon({ isOpen = false }) {
  const path = isOpen 
    ? "M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36 M10.58 10.58A2 2 0 1 0 13.41 13.41 M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75 M1 1l22 22"
    : "M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0 M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0";
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
      {!isOpen && <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}

export function inputClassName(hasTrailingButton = false) {
  return [
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5",
    "text-sm font-medium text-slate-900 shadow-sm outline-none transition",
    "placeholder:text-slate-500",
    "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
    hasTrailingButton ? "pr-12" : "",
  ].filter(Boolean).join(" ");
}

export function LoginLoading() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-medium text-slate-700">
          Memeriksa sesi admin...
        </p>
      </div>
    </section>
  );
}
