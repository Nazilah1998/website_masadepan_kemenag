import Link from "next/link";
import PageBanner from "./PageBanner";
import PublicDocumentBrowser from "./laporan/PublicDocumentBrowser";

export default function DocumentListPage({
  title,
  description,
  breadcrumb = [],
  intro,
  documents = [],
  notice,
}) {
  const hasDocuments = Array.isArray(documents) && documents.length > 0;

  return (
    <>
      <PageBanner
        title={title}
        description={description}
        breadcrumb={breadcrumb}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          {intro ? (
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Ringkasan
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {typeof intro === "string" ? <p>{intro}</p> : intro}
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            {hasDocuments ? (
              <PublicDocumentBrowser documents={documents} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Dokumen belum dipublikasikan. Silakan kembali lagi nanti atau
                  hubungi kami untuk informasi lebih lanjut.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Hubungi Kami
                </Link>
              </div>
            )}
          </div>

          {notice ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              {notice}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}