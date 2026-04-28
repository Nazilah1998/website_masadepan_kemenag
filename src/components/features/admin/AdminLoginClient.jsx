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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 h-full w-full opacity-30 dark:opacity-20">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-100/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[460px] animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <Link href="/" className="group mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white p-4 shadow-xl transition-all duration-500 hover:rounded-3xl dark:bg-slate-900">
            <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={60} height={60} className="object-contain transition-transform duration-500 group-hover:scale-110" priority />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">PANEL ADMINISTRASI</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">KEMENTERIAN AGAMA KABUPATEN BARITO UTARA</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 sm:p-10">
          <form onSubmit={l.handleSubmit} className="space-y-6">
            <EmailField value={l.email} onChange={l.setEmail} />

            <PasswordField
              value={l.password} onChange={l.setPassword}
              show={l.showPassword} onToggleShow={() => l.setShowPassword(!l.showPassword)}
              onKeyState={l.handlePasswordKeyState} capsLock={l.capsLock}
              error={l.error}
            />

            <div className="pt-2">
              <LoginCaptcha
                challenge={l.captchaChallenge} input={l.captchaInput}
                setInput={l.setCaptchaInput} onRefresh={l.refreshCaptcha}
              />
            </div>

            {l.error && (
              <div id="admin-login-error" className="animate-in slide-in-from-top-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                {l.error}
              </div>
            )}

            <SubmitButton submitting={l.submitting} disabled={!l.email || !l.password || !l.captchaInput} />
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <Link href="/admin/register-editor" className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              Pendaftaran Editor Baru
            </Link>

            <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />

            <Link href="/" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
          &copy; 2026 KEMENTERIAN AGAMA KABUPATEN BARITO UTARA
        </p>

      </div>
    </section>
  );
}

function EmailField({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label htmlFor="admin-email" className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Admin</label>
      <input id="admin-email" type="email" value={value} onChange={(e) => onChange(e.target.value)} className={inputClassName()} placeholder="nama@email.com" autoComplete="email" required />
    </div>
  );
}

function PasswordField({ value, onChange, show, onToggleShow, onKeyState, capsLock, error }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
        <Link href="/admin/forgot-password" className="text-[11px] font-bold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400">Lupa?</Link>
      </div>
      <div className="relative">
        <input id="admin-password" type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} onKeyUp={onKeyState} onKeyDown={onKeyState} className={inputClassName(true)} placeholder="••••••••" autoComplete="current-password" aria-invalid={Boolean(error)} required />
        <button type="button" onClick={onToggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
          <EyeIcon isOpen={show} />
        </button>
      </div>
      {capsLock && <p className="mt-1 text-[10px] font-bold text-amber-600">CAPS LOCK AKTIF</p>}
    </div>
  );
}

function SubmitButton({ submitting, disabled }) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="group relative h-12 w-full overflow-hidden rounded-2xl bg-emerald-700 text-sm font-bold text-white transition-all hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800"
    >
      <span className="relative z-10">{submitting ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}

