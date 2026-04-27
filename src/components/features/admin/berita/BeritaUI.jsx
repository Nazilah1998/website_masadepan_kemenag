import React, { useState } from "react";
import { IconCheckCircle, IconAlertCircle } from "./BeritaIcons";

export const statToneMap = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export function StatCard({ label, value, helper, icon, tone = "emerald" }) {
  const toneClasses = statToneMap[tone] || statToneMap.emerald;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>

        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${toneClasses}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}

export function StatusPill({ published }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${published
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
        }`}
    >
      {published ? "Tayang" : "Draft"}
    </span>
  );
}

export function CoverThumb({
  src,
  alt = "Preview gambar",
  className = "",
  fallbackText = "Belum ada gambar",
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500 dark:text-slate-400 ${className}`.trim()}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setFailedSrc(src)}
        className={`rounded-2xl object-cover ${className}`.trim()}
      />
    </>
  );
}

export function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-emerald-600" : "bg-slate-300"
          }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"
            }`}
        />
      </button>
    </div>
  );
}

export function ToolbarButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-300"
    >
      {children}
    </button>
  );
}

export function ActionIconButton({
  title,
  onClick,
  children,
  variant = "neutral",
  disabled = false,
}) {
  const variantClasses = {
    neutral:
      "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100",
    danger:
      "border-rose-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:bg-slate-800 dark:text-rose-300 dark:hover:border-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-200",
    sky: "border-sky-200 bg-white text-sky-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-900 dark:bg-slate-800 dark:text-sky-300 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-200",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant] || variantClasses.neutral}`}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}

export function FloatingFeedback({ message, error, onClose }) {
  if (!message && !error) return null;

  const isError = Boolean(error);
  const title = isError ? "Terjadi kendala" : "Berhasil";
  const detail = isError
    ? error
    : String(message || "")
      .replace(/\s*Ukuran[^.]*\.?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  return (
    <div className="pointer-events-none fixed right-3 top-24 z-70 flex w-[min(92vw,380px)] flex-col items-end gap-3 sm:right-6">
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-2xl border shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-200 ${isError
          ? "border-rose-200 bg-white/95 text-rose-700 dark:border-rose-900/70 dark:bg-slate-900/95 dark:text-rose-300"
          : "border-emerald-200 bg-white/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-slate-900/95 dark:text-emerald-300"
          }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div
            className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isError
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
              }`}
          >
            {isError ? <IconAlertCircle /> : <IconCheckCircle />}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${isError
                ? "text-rose-700 dark:text-rose-300"
                : "text-emerald-700 dark:text-emerald-300"
                }`}
            >
              {title}
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {detail}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${isError
              ? "text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              : "text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40"
              }`}
            aria-label="Tutup notifikasi"
            title="Tutup notifikasi"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
