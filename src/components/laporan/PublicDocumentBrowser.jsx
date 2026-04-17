"use client";

import { useMemo, useState } from "react";
import PdfViewerModal from "./PdfViewerModal";

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

export default function PublicDocumentBrowser({ documents = [] }) {
    const [year, setYear] = useState("");
    const [activeDoc, setActiveDoc] = useState(null);

    const yearOptions = useMemo(() => {
        return [...new Set(documents.map((doc) => doc?.year).filter(Boolean))].sort((a, b) => b - a);
    }, [documents]);

    const filteredDocuments = useMemo(() => {
        if (!year) return documents;
        return documents.filter((doc) => String(doc?.year || "") === year);
    }, [documents, year]);

    return (
        <>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Daftar Dokumen
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Klik dokumen untuk membaca PDF langsung di halaman ini.
                    </p>
                </div>

                <label className="block w-full sm:w-56">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Filter Tahun
                    </span>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
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

            {filteredDocuments.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {filteredDocuments.map((doc, index) => (
                        <li key={doc.id || `${doc.title}-${index}`}>
                            <button
                                type="button"
                                onClick={() => setActiveDoc(doc)}
                                className="group flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                            >
                                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                    <DocumentIcon />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {doc.title}
                                    </p>

                                    {doc.meta ? (
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {doc.meta}
                                        </p>
                                    ) : null}

                                    {doc.description ? (
                                        <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                            {doc.description}
                                        </p>
                                    ) : null}
                                </div>

                                <span
                                    aria-hidden="true"
                                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400"
                                >
                                    Buka
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Tidak ada dokumen untuk filter tahun yang dipilih.
                    </p>
                </div>
            )}

            <PdfViewerModal
                open={Boolean(activeDoc)}
                title={activeDoc?.title}
                url={activeDoc?.href || activeDoc?.file_url}
                onClose={() => setActiveDoc(null)}
            />
        </>
    );
}