import React from "react";
import { EyeIcon } from "./UpdatePasswordUI";

export const UNIT_KERJA_OPTIONS = [
  "Sub Bagian Tata Usaha",
  "Seksi Pendidikan Madrasah",
  "Seksi Pendidikan Agama Islam",
  "Seksi Pendidikan Diniyah & Pontren",
  "Seksi Bimas Islam",
  "Seksi Bimas Kristen & Katolik",
  "Penyelenggara Hindu",
  "Penyelenggara Zakat & Wakaf",
];

export function RegisterInput({ label, type = "text", value, onChange, placeholder, required = true }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export function RegisterSelect({ label, value, onChange, options, required = true }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">{label}</label>
      <select
        value={value} onChange={onChange} required={required}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">Pilih {label.toLowerCase()}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

export function RegisterPasswordInput({ value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">Password</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder="Minimal 8 karakter" required
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pr-12"
        />
        <button
          type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <EyeIcon isOpen={show} />
        </button>
      </div>
    </div>
  );
}
