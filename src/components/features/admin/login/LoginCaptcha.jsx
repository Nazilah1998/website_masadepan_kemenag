import React from "react";
import { inputClassName } from "./LoginUI";

export function LoginCaptcha({
  challenge,
  input,
  setInput,
  onRefresh
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        Verifikasi Captcha
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg font-bold tracking-[0.22em] text-slate-900">
          {challenge}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      <div className="mt-3">
        <label
          htmlFor="admin-captcha"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Ketik captcha di atas
        </label>
        <input
          id="admin-captcha"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          className={inputClassName()}
          placeholder="Masukkan kode captcha"
          autoComplete="off"
          maxLength={8}
          required
        />
      </div>
    </div>
  );
}
