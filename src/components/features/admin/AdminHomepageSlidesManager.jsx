"use client";

import React from "react";
import { useSlidesManager } from "@/hooks/useSlidesManager";
import { SlideTable } from "./slides/SlideTable";
import { SlideFormModal } from "./slides/SlideFormModal";

export default function AdminHomepageSlidesManager() {
  const s = useSlidesManager();

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <SlidesHeader
          count={s.items.length}
          published={s.totalPublished}
          onAdd={s.handleOpenCreate}
        />

        {s.message && <StatusMessage type="success" text={s.message} />}
        {s.error && <StatusMessage type="error" text={s.error} />}

        <SlideTable
          items={s.items} loading={s.loading}
          onEdit={s.handleOpenEdit} onDelete={s.handleDelete}
          deletingId={s.deletingId} toNumber={s.toNumber}
        />
      </div>

      <SlideFormModal
        open={s.openForm} editingId={s.editingId}
        form={s.form} imagePreview={s.imagePreview}
        saving={s.saving} uploadingImage={s.uploadingImage}
        onClose={s.handleCloseForm} onChange={s.handleChange}
        onFileChange={s.handleImageFileChange} onSave={s.handleSave}
      />
    </section>
  );
}

function SlidesHeader({ count, published, onAdd }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Slider Beranda</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Manajemen Slide Beranda</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total {count} slide • {published} dipublikasikan</p>
      </div>
      <button onClick={onAdd} className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Tambah Slide</button>
    </div>
  );
}

function StatusMessage({ type, text }) {
  const classes = type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
    : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300";
  return <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${classes}`}>{text}</div>;
}
