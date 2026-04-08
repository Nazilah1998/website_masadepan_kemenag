"use client";

import Link from "next/link";
import { useMemo } from "react";
import { searchSite } from "../lib/search";
import { useLanguage } from "../context/LanguageContext";

export default function SearchResultsClient({ initialQuery = "" }) {
  const { t } = useLanguage();
  const query = initialQuery.trim();
  const results = useMemo(() => searchSite(query), [query]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        {query ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("searchPage.resultFor")}{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                “{query}”
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {results.length} {t("searchPage.resultCount")}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("searchPage.emptyState")}
          </p>
        )}
      </div>

      {query && results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {t("common.noResults")}
        </div>
      ) : null}

      <div className="space-y-4">
        {results.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {item.section}
              </span>
              <span>{item.category}</span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}