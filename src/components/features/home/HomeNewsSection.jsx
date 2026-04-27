"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeNewsSection({ latestBerita }) {
  const { t } = useLanguage();

  return (
    <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
            {t("nav.berita")}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight lg:text-4xl">
            {t("home.news.title") || "Ikuti pembaruan kegiatan dan informasi terkini"}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            {t("home.news.description") || "Berita resmi dari Kementerian Agama Kabupaten Barito Utara untuk masyarakat."}
          </p>
        </div>

        <Link
          href="/berita"
          className="theme-outline-button group inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition"
        >
          {t("actions.viewAll")}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {latestBerita.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {latestBerita.map((item, index) => (
            <NewsCard key={item.slug} item={item} index={index} t={t} />
          ))}
        </div>
      ) : (
        <div className="theme-news-empty mt-10 rounded-2xl p-10 text-center">
          <h3 className="text-xl font-black">{t("home.news.emptyTitle") || "Belum ada berita terbaru"}</h3>
          <p className="theme-text-muted mt-3 text-sm leading-7">
            {t("home.news.emptyDesc") || "Berita yang sudah dipublikasikan akan tampil otomatis di bagian ini."}
          </p>
        </div>
      )}
    </section>
  );
}

function NewsCard({ item, index, t }) {
  return (
    <article className={`theme-news-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
      <Link href={`/berita/${item.slug}`} className="block h-full">
        <div className="relative h-48 overflow-hidden bg-(--surface-muted)">
          <Image
            src={item.coverImage || "/kemenag.svg"}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 [background:var(--news-overlay)]" />
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-emerald-700 shadow-sm dark:bg-slate-900/90 dark:text-emerald-300">
            {item.category}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-white/80">
              <span>{item.date}</span>
            </div>
            <h3 className="mt-1.5 line-clamp-2 text-sm font-black leading-snug text-white">{item.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="theme-text-muted line-clamp-2 text-sm leading-6">{item.excerpt || t("actions.readMore")}</p>
          <div className="mt-4 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 transition-colors group-hover:text-emerald-600 dark:text-emerald-300">
              {t("actions.readMore")}
              <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
