"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewerClient"), { ssr: false });

function DownloadIcon() {
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function CloseIcon() {
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function FileIcon() {
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
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
            <path d="M9 9h1" />
        </svg>
    );
}

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
            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function LaporanDocumentsClient({ documents = [] }) {
    const [openDocId, setOpenDocId] = useState(null);
    const [failedPreviewById, setFailedPreviewById] = useState({});

    if (!documents.length) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <FileIcon />
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Belum ada dokumen pada kategori ini.
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Dokumen akan ditampilkan setelah dipublikasikan oleh admin.
                </p>
            </div>
        );
    }

    return documents.map((doc, index) => {
        const isOpen = openDocId === doc.id;
        const failed = Boolean(failedPreviewById[doc.id]);

        return (
            <article
                key={doc.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
            >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_42%)]" />
                <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                <FileIcon />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                                    Dokumen {String(index + 1).padStart(2, "0")}
                                </p>
                                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                                    {doc.title}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {doc.description ? (
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {doc.description}
                        </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {doc.year ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Tahun {doc.year}
                            </span>
                        ) : null}

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            PDF
                        </span>

                        {typeof doc.view_count === "number" && doc.view_count > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <EyeIcon />
                                {doc.view_count.toLocaleString("id-ID")} kali dilihat
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={() => {
                                if (isOpen) {
                                    setOpenDocId(null);
                                    return;
                                }
                                setFailedPreviewById((prev) => ({ ...prev, [doc.id]: false }));
                                setOpenDocId(doc.id);
                            }}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                            {isOpen ? <CloseIcon /> : <DownloadIcon />}
                            <span>{isOpen ? "Tutup Dokumen" : "Lihat Dokumen"}</span>
                        </button>
                    </div>

                    {isOpen ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                            {failed ? (
                                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Preview dokumen tidak dapat dimuat di halaman ini.
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Silakan coba muat ulang preview dokumen.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFailedPreviewById((prev) => ({ ...prev, [doc.id]: false }))
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300"
                                    >
                                        <DownloadIcon />
                                        Coba muat ulang
                                    </button>
                                </div>
                            ) : (
                                <PdfViewer
                                    fileUrl={doc.href}
                                    fileName={`${doc.title || "dokumen"}.pdf`}
                                    onError={() =>
                                        setFailedPreviewById((prev) => ({ ...prev, [doc.id]: true }))
                                    }
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            </article>
        );
    });
}
