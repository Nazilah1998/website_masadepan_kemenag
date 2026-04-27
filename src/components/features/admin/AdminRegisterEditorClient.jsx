"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { useRegisterEditor } from "@/hooks/useRegisterEditor";
import { RegisterInput, RegisterSelect, RegisterPasswordInput, UNIT_KERJA_OPTIONS } from "./login/RegisterEditorUI";

export default function AdminRegisterEditorClient() {
  const r = useRegisterEditor();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
          <RegisterHeader />

          <form onSubmit={r.handleSubmit} className="mt-8 space-y-5">
            <RegisterInput label="Nama Lengkap" value={r.fullName} onChange={(e) => r.setFullName(e.target.value)} placeholder="Nama editor" />
            <RegisterInput label="Email" type="email" value={r.email} onChange={(e) => r.setEmail(e.target.value)} placeholder="editor@domain.go.id" />
            <RegisterSelect label="Unit Kerja" value={r.unitName} onChange={(e) => r.setUnitName(e.target.value)} options={UNIT_KERJA_OPTIONS} />
            <RegisterPasswordInput value={r.password} onChange={(e) => r.setPassword(e.target.value)} show={r.showPassword} onToggle={() => r.setShowPassword(!r.showPassword)} />

            {r.error && <StatusAlert type="error" message={r.error} />}
            {r.success && <StatusAlert type="success" message={r.success} />}

            <button
              type="submit" disabled={r.submitting || !r.fullName || !r.email || !r.password}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {r.submitting ? "Menyimpan..." : "Buat Akun Editor"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-justify text-xs leading-6 text-slate-500">
            Role akun yang dibuat adalah <span className="font-semibold">editor</span>. Akses fitur menunggu verifikasi dari super admin.
          </div>
        </div>
      </div>
    </section>
  );
}

function RegisterHeader() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={44} height={44} priority />
          <div>
            <p className="text-sm font-bold text-slate-900">{siteInfo.shortName}</p>
            <p className="text-xs text-slate-500">Panel Admin</p>
          </div>
        </Link>
        <Link href="/admin/login" className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Login</Link>
      </div>
      <div className="mt-8">
        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Akun Editor</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Buat Akun Editor</h1>
      </div>
    </>
  );
}

function StatusAlert({ type, message }) {
  const classes = type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700";
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>{message}</div>;
}