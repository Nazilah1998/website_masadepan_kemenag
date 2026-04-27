"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BeritaDetailActions from "./BeritaDetailActions";

export function BeritaDetailBreadcrumb({ title }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-white/60">
      <Link href="/" className="hover:text-white transition">{t("nav.home")}</Link>
      <span className="text-white/40">/</span>
      <Link href="/berita" className="hover:text-white transition">{t("nav.berita")}</Link>
      <span className="text-white/40">/</span>
      <span className="text-white truncate max-w-[200px]">{title}</span>
    </div>
  );
}

export function BeritaDetailSidebar({ category, date, views, title, slug }) {
  const { t } = useLanguage();
  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("newsDetail.infoTitle")}</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <InfoRow label={t("newsDetail.category")} value={category} />
          <InfoRow label={t("newsDetail.date")} value={date} />
          <InfoRow label={t("newsDetail.views")} value={`${views ?? 0} ${t("newsDetail.readCount")}`} isRight />
        </div>
      </div>
      <BeritaDetailActions title={title} path={`/berita/${slug}`} />
    </aside>
  );
}

function InfoRow({ label, value, isRight = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span>{label}</span>
      <span className={`${isRight ? "text-right" : ""} font-semibold text-slate-900 dark:text-slate-100`}>{value}</span>
    </div>
  );
}

export function BeritaDetailBackLink() {
  const { t } = useLanguage();
  return (
    <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
      <span aria-hidden="true">←</span>
      {t("newsDetail.backToNews")}
    </Link>
  );
}

export function BeritaDetailMetaPills({ date, children }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap gap-3">
      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        {t("newsDetail.published")} {date}
      </div>
      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        {children}
      </div>
    </div>
  );
}
