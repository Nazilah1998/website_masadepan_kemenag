"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { EyeIcon, inputClassName, LoginLoading } from "./login/LoginUI";
import { LoginCaptcha } from "./login/LoginCaptcha";

export default function AdminLoginClient({ initialUnauthorized = false }) {
  const l = useAdminLogin(initialUnauthorized);

  if (l.loadingSession) return <LoginLoading />;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_35%)]" />
      
      <div className="relative w-full max-w-lg rounded-4xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
        <LoginHeader />

        <div className="mt-8">
          <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Login Admin</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Masuk ke panel admin</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Gunakan akun admin terdaftar dan selesaikan verifikasi captcha sederhana sebelum login.</p>
        </div>

        <form onSubmit={l.handleSubmit} className="mt-8 space-y-5">
          <EmailField value={l.email} onChange={l.setEmail} />
          
          <PasswordField 
            value={l.password} onChange={l.setPassword} 
            show={l.showPassword} onToggleShow={() => l.setShowPassword(!l.showPassword)} 
            onKeyState={l.handlePasswordKeyState} capsLock={l.capsLock}
            error={l.error}
          />

          <LoginCaptcha 
            challenge={l.captchaChallenge} input={l.captchaInput} 
            setInput={l.setCaptchaInput} onRefresh={l.refreshCaptcha} 
          />

          {l.error && (
            <div id="admin-login-error" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{l.error}</div>
          )}

          <SubmitButton submitting={l.submitting} disabled={!l.email || !l.password || !l.captchaInput} />

          <div className="flex items-center justify-center pt-1">
            <Link href="/admin/register-editor" className="text-sm font-medium text-slate-600 hover:text-slate-900">Daftar Akun Admin/Editor</Link>
          </div>
        </form>
        <LoginFooterNotice />
      </div>
    </section>
  );
}

function LoginHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link href="/" className="inline-flex items-center gap-3">
        <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={44} height={44} priority />
        <div>
          <p className="text-sm font-bold text-slate-900">{siteInfo.shortName}</p>
          <p className="text-xs text-slate-500">Panel Admin</p>
        </div>
      </Link>
      <Link href="/" className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Kembali</Link>
    </div>
  );
}

function EmailField({ value, onChange }) {
  return (
    <div>
      <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-800">Email admin</label>
      <input id="admin-email" type="email" value={value} onChange={(e) => onChange(e.target.value)} className={inputClassName()} placeholder="nama@gmail.com" autoComplete="email" required />
    </div>
  );
}

function PasswordField({ value, onChange, show, onToggleShow, onKeyState, capsLock, error }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor="admin-password" stroke="block text-sm font-semibold text-slate-800">Password</label>
        <Link href="/admin/forgot-password" stroke="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Lupa password?</Link>
      </div>
      <div className="relative">
        <input id="admin-password" type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} onKeyUp={onKeyState} onKeyDown={onKeyState} className={inputClassName(true)} autoComplete="current-password" aria-invalid={Boolean(error)} required />
        <button type="button" onClick={onToggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          <EyeIcon isOpen={show} />
        </button>
      </div>
      {capsLock && <p className="mt-2 text-xs font-medium text-amber-600">Caps Lock sedang aktif.</p>}
    </div>
  );
}

function SubmitButton({ submitting, disabled }) {
  return (
    <button type="submit" disabled={submitting || disabled} className="h-12 w-full rounded-2xl bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300">
      {submitting ? "Memproses..." : "Masuk ke Panel Admin"}
    </button>
  );
}

function LoginFooterNotice() {
  return <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">Akses ini khusus untuk admin internal. Jika Anda bukan admin, kembali ke halaman utama website.</div>;
}
