"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Reduksi warning non-kritis pdf.js (terutama di development)
try {
    if (typeof pdfjs.verbosityLevel !== "undefined" && typeof pdfjs.VerbosityLevel !== "undefined") {
        pdfjs.verbosity = pdfjs.VerbosityLevel.ERRORS;
    }
} catch {
    // noop
}

const DOCUMENT_OPTIONS = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

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

export default function PdfViewerClient({ fileUrl, fileName = "dokumen.pdf", onError }) {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [containerWidth, setContainerWidth] = useState(820);
    const [zoom, setZoom] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const viewerRef = useRef(null);
    const pageRefs = useRef({});

    useEffect(() => {
        const handleViewport = () => setIsMobile(window.innerWidth < 640);
        handleViewport();
        window.addEventListener("resize", handleViewport);
        return () => window.removeEventListener("resize", handleViewport);
    }, []);

    useEffect(() => {
        if (!viewerRef.current) return;

        const el = viewerRef.current;
        const updateWidth = () => {
            const sidePadding = isMobile ? 8 : 24;
            const next = Math.max(220, Math.min(980, el.clientWidth - sidePadding));
            setContainerWidth(next);
        };

        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(el);
        return () => observer.disconnect();
    }, [isMobile]);

    const goToPage = (page) => {
        const safePage = Math.max(1, Math.min(numPages || 1, page));
        setCurrentPage(safePage);

        const target = pageRefs.current[safePage];
        if (target && viewerRef.current) {
            viewerRef.current.scrollTo({
                top: target.offsetTop - 8,
                behavior: "smooth",
            });
        }
    };

    const onScrollUpdateCurrentPage = () => {
        if (!viewerRef.current || !numPages) return;

        const scrollTop = viewerRef.current.scrollTop + 24;
        let nearest = 1;
        let minDiff = Number.POSITIVE_INFINITY;

        for (let i = 1; i <= numPages; i += 1) {
            const node = pageRefs.current[i];
            if (!node) continue;
            const diff = Math.abs(node.offsetTop - scrollTop);
            if (diff < minDiff) {
                minDiff = diff;
                nearest = i;
            }
        }

        if (nearest !== currentPage) {
            setCurrentPage(nearest);
        }
    };

    const handleDirectDownload = async () => {
        try {
            const response = await fetch(fileUrl, { mode: "cors" });
            if (!response.ok) throw new Error("Gagal mengunduh file");

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        } catch {
            const a = document.createElement("a");
            a.href = fileUrl;
            a.setAttribute("download", fileName);
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    const maxZoom = isMobile ? 1.25 : 2;
    const pageWidth = Math.max(220, Math.floor(containerWidth * zoom));

    return (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-3 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Halaman {currentPage} / {numPages || "-"}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {!isMobile ? (
                        <>
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={!numPages || currentPage >= numPages}
                                className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
                            >
                                Next
                            </button>
                        </>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
                    >
                        Zoom -
                    </button>
                    <div className="min-w-[48px] text-center text-[11px] font-semibold text-slate-600 sm:min-w-[56px] sm:text-xs dark:text-slate-300">
                        {Math.round(zoom * 100)}%
                    </div>
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(maxZoom, Number((z + 0.1).toFixed(2))))}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
                    >
                        Zoom +
                    </button>

                    <button
                        type="button"
                        onClick={() => setZoom(1)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
                    >
                        Fit
                    </button>

                    <button
                        type="button"
                        onClick={handleDirectDownload}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 sm:px-3 sm:text-xs"
                    >
                        <DownloadIcon />
                        Download
                    </button>
                </div>
            </div>

            <div
                ref={viewerRef}
                onScroll={onScrollUpdateCurrentPage}
                className="max-h-[56vh] overflow-y-auto overflow-x-hidden p-2 sm:max-h-[70vh] sm:p-3"
            >
                <Document
                    file={fileUrl}
                    options={DOCUMENT_OPTIONS}
                    loading={
                        <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Memuat dokumen...
                        </div>
                    }
                    onLoadError={onError}
                    onSourceError={onError}
                    onLoadSuccess={({ numPages: total }) => {
                        setNumPages(total || 0);
                        setCurrentPage(1);
                    }}
                >
                    {Array.from({ length: numPages || 1 }, (_, idx) => {
                        const page = idx + 1;
                        return (
                            <div
                                key={`page-${page}`}
                                ref={(node) => {
                                    if (node) pageRefs.current[page] = node;
                                }}
                                className="mb-3 last:mb-0 sm:mb-4"
                            >
                                <Page
                                    pageNumber={page}
                                    width={pageWidth}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                    loading={
                                        <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                            Memuat halaman {page}...
                                        </div>
                                    }
                                />
                            </div>
                        );
                    })}
                </Document>
            </div>
        </div>
    );
}
