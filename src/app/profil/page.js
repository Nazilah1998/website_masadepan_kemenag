"use client";

import React from "react";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilPage() {
  const { t } = useLanguage();

  const profileMenus = [
    {
      title: t("nav.sejarah"),
      description:
        "Mengenal perjalanan dan perkembangan Kementerian Agama Kabupaten Barito Utara.",
      href: "/profil/sejarah",
    },
    {
      title: t("nav.visiMisi"),
      description:
        "Arah, komitmen, dan landasan kerja dalam memberikan pelayanan kepada masyarakat.",
      href: "/profil/visi-misi",
    },
    {
      title: t("nav.tugasFungsi"),
      description:
        "Penjelasan tugas pokok dan fungsi kelembagaan dalam penyelenggaraan urusan agama.",
      href: "/profil/tugas-fungsi",
    },
    {
      title: t("nav.nilaiBudaya"),
      description:
        "Nilai dasar aparatur dalam membangun pelayanan yang berintegritas dan profesional.",
      href: "/profil/nilai-budaya-kerja",
    },
    {
      title: t("nav.tujuan"),
      description:
        "Tujuan strategis dalam meningkatkan kualitas layanan keagamaan dan tata kelola organisasi.",
      href: "/profil/tujuan",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.profil")}
        description="Profil resmi Kementerian Agama Kabupaten Barito Utara, mencakup sejarah, visi misi, tugas fungsi, dan tujuan kelembagaan."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
        ]}
      />

      <section className="w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              Tentang Kami
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-slate-100">
              Pelayanan Keagamaan yang Responsif dan Terpercaya
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-400">
              Kementerian Agama Kabupaten Barito Utara menjalankan fungsi
              pelayanan, pembinaan, dan penguatan kehidupan beragama di
              masyarakat. Melalui peningkatan kualitas layanan, transformasi
              digital, dan tata kelola yang akuntabel, Kemenag Barito Utara
              terus berupaya menghadirkan pelayanan yang mudah, cepat, ramah,
              dan berdampak.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-400">
              Profil ini memuat informasi utama mengenai sejarah, visi dan misi,
              tugas dan fungsi, nilai budaya kerja, serta tujuan kelembagaan
              sebagai dasar dalam memahami arah pelayanan Kemenag Barito Utara.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileMenus.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>

                <div className="mt-5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  Lihat selengkapnya →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
