"use client";

import { useState } from "react";

export default function PengumumanAttachmentLink({
  slug,
  url,
  initialViews = 0,
  className = "",
}) {
  const [views, setViews] = useState(Number(initialViews || 0));

  async function handleClick() {
    if (!slug || !url) return;

    const storageKey = `pengumuman-attachment-opened:${slug}`;
    const alreadyOpened =
      typeof window !== "undefined" && sessionStorage.getItem(storageKey);

    window.open(url, "_blank", "noopener,noreferrer");

    if (alreadyOpened) {
      return;
    }

    try {
      const response = await fetch(`/api/pengumuman/${slug}/attachment-view`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setViews(Number(data?.views || 0));
        sessionStorage.setItem(storageKey, "1");
      }
    } catch {
      // diamkan saja
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        }
      >
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
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Lihat</span>
      </button>

      <span className="text-xs text-slate-500">
        {views.toLocaleString("id-ID")} kali dilihat
      </span>
    </div>
  );
}
