import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getAllLaporanCategories } from "@/lib/laporan";

export const metadata = {
  title: "Laporan dan Akuntabilitas",
  description:
    "Dokumen akuntabilitas Kementerian Agama Kabupaten Barito Utara: Renstra, Perjanjian Kinerja, Laporan Kinerja, dan dokumen pendukung lainnya.",
};

export const revalidate = 300;

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}

function ArrowRightIcon() {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default async function LaporanIndexPage() {
  const laporanCategories = await getAllLaporanCategories();

  return (
    <>
      <PageBanner
        title="Laporan dan Akuntabilitas"
        description="Transparansi dan akuntabilitas kinerja Kementerian Agama Kabupaten Barito Utara melalui dokumen resmi yang dapat diakses publik."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Laporan" }]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <FolderIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Dokumen Akuntabilitas
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Halaman ini menghimpun dokumen resmi yang mencerminkan
                  perencanaan, pelaksanaan, evaluasi kinerja, serta bentuk
                  pertanggungjawaban instansi kepada publik. Silakan pilih
                  kategori laporan untuk melihat dokumen secara lengkap.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {laporanCategories.map((item) => {
              const totalDocuments = Array.isArray(item.documents)
                ? item.documents.length
                : 0;

              return (
                <Link
                  key={item.slug}
                  href={`/laporan/${item.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {totalDocuments} dokumen
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>Buka Dokumen</span>
                    <ArrowRightIcon />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
