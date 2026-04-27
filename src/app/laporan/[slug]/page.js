// src/app/laporan/[slug]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import LaporanDocumentsClient from "@/components/features/laporan/LaporanDocumentsClient";
import {
  getAllLaporanCategories,
  getLaporanCategoryBySlug,
} from "@/lib/laporan";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getAllLaporanCategories();

  return categories.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getLaporanCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan | Laporan",
      description: "Kategori laporan yang Anda cari tidak tersedia.",
    };
  }

  return {
    title: `${category.title} | Laporan dan Akuntabilitas`,
    description:
      category.description ||
      `Daftar dokumen ${category.title} Kementerian Agama Kabupaten Barito Utara.`,
  };
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default async function LaporanCategoryPage({ params }) {
  const { slug } = await params;
  const category = await getLaporanCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const documents = Array.isArray(category.documents) ? category.documents : [];

  return (
    <>
      <PageBanner
        title={category.title}
        description={
          category.description ||
          "Daftar dokumen laporan resmi yang dapat diakses publik."
        }
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Laporan", href: "/laporan" },
          { label: category.title },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 md:py-14 lg:px-16 xl:px-20">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
            >
              <ArrowLeftIcon />
              <span>Kembali ke semua kategori</span>
            </Link>

            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {documents.length} dokumen tersedia
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_42%)]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {category.title}
              </h2>

              {category.description ? (
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>

          {category.intro ? (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                {category.intro}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <LaporanDocumentsClient documents={documents} />
          </div>
        </section>
      </main>
    </>
  );
}
