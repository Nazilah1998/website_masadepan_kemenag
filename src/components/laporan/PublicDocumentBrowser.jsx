"use client";

import { useCallback, useMemo, useState } from "react";

const DOCS_PER_PAGE = 6;

function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function DocumentIcon() {
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    );
}

function ChevronLeft() {
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
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function ChevronRight() {
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
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function normalizeDocUrl(doc) {
    return String(doc?.href || doc?.file_url || "").trim();
}

export default function PublicDocumentBrowser({ documents = [] }) {
    const [year, setYear] = useState("");
    const [page, setPage] = useState(1);
    const [viewCounts, setViewCounts] = useState({});

    const yearOptions = useMemo(() => {
        return [...new Set(documents.map((doc) => doc?.year).filter(Boolean))].sort(
            (a, b) => b - a,
        );
    }, [documents]);

    const filteredDocuments = useMemo(() => {
        if (!year) return documents;
        return documents.filter((doc) => String(doc?.year || "") === year);
    }, [documents, year]);

    const totalPages = Math.ceil(filteredDocuments.length / DOCS_PER_PAGE);

    const pagedDocuments = useMemo(() => {
        const start = (page - 1) * DOCS_PER_PAGE;
        return filteredDocuments.slice(start, start + DOCS_PER_PAGE);
    }, [filteredDocuments, page]);

    function handleYearChange(nextYear) {
        setYear(nextYear);
        setPage(1);
    }

    const handleViewDoc = useCallback((doc) => {
        const url = normalizeDocUrl(doc);
        if (!url) return;

        const docId = String(doc?.id || "");
        if (docId) {
            setViewCounts((prev) => ({
                ...prev,
                [docId]: (prev[docId] || Number(doc?.view_count || 0)) + 1,
            }));

            fetch("/api/laporan/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: docId }),
            }).catch(() => { });
        }

        window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    const globalOffset = (page - 1) * DOCS_PER_PAGE;

    return (
        <div>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Daftar Dokumen
                </h2>

                <label className="block w-full sm:w-52">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Filter Tahun
                    </span>
                    <select
                        value={year}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                        <option value="">Semua Tahun</option>
                        {yearOptions.map((item) => (
                            <option key={item} value={String(item)}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {pagedDocuments.length > 0 ? (
                <>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {pagedDocuments.map((doc, index) => {
                            const docId = String(doc?.id || "");
                            const viewCount =
                                viewCounts[docId] !== undefined
                                    ? viewCounts[docId]
                                    : Number(doc?.view_count || 0);
                            const globalIndex = globalOffset + index + 1;

                            return (
                                <li key={doc.id || `${doc.title}-${index}`}>
                                    <div className="group flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700">
                                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            {globalIndex}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                                                    {doc.title}
                                                </p>

                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                    <EyeIcon />
                                                    {viewCount}
                                                </span>
                                            </div>

                                            {doc.meta ? (
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {doc.meta}
                                                </p>
                                            ) : null}

                                            {doc.description ? (
                                                <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                                    {doc.description}
                                                </p>
                                            ) : null}

                                            <div className="mt-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDoc(doc)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                                >
                                                    <DocumentIcon />
                                                    Lihat Dokumen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {totalPages > 1 ? (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                aria-label="Halaman sebelumnya"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    aria-label={`Halaman ${num}`}
                                    aria-current={page === num ? "page" : undefined}
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${page === num
                                        ? "bg-emerald-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                aria-label="Halaman berikutnya"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    ) : null}
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Belum ada dokumen untuk filter yang dipilih.
                    </p>
                </div>
            )}
        </div>
    );
}