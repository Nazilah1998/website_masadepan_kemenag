"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteInfo } from "@/data/site";

const UNIT_KERJA_OPTIONS = [
    "Sub Bagian Tata Usaha",
    "Seksi Pendidikan Madrasah",
    "Seksi Pendidikan Agama Islam",
    "Seksi Pendidikan Diniyah & Pontren",
    "Seksi Bimas Islam",
    "Seksi Bimas Kristen & Katolik",
    "Penyelenggara Hindu",
    "Penyelenggara Zakat & Wakaf",
];

function EyeIcon({ isOpen = false }) {
    if (isOpen) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36" />
                <path d="M10.58 10.58A2 2 0 1 0 13.41 13.41" />
                <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75" />
                <path d="M1 1l22 22" />
            </svg>
        );
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function inputClassName() {
    return [
        "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5",
        "text-sm font-medium text-black outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
    ].join(" ");
}

export default function AdminRegisterEditorClient() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [unitName, setUnitName] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/register-editor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    unitName,
                    password,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Gagal membuat akun editor.");
            }

            setSuccess(
                "Akun editor berhasil dibuat. Silakan login admin, lalu tunggu verifikasi super admin untuk membuka akses fitur."
            );
            setFullName("");
            setEmail("");
            setUnitName("");
            setPassword("");

            setTimeout(() => {
                router.push("/admin/login");
            }, 1400);
        } catch (err) {
            setError(err?.message || "Gagal membuat akun editor.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />

            <div className="relative w-full max-w-md">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <Image
                                src={siteInfo.logoSrc}
                                alt={siteInfo.shortName}
                                width={44}
                                height={44}
                                priority
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {siteInfo.shortName}
                                </p>
                                <p className="text-xs text-slate-500">Panel Admin</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/login"
                            className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Login
                        </Link>
                    </div>

                    <div className="mt-8">
                        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            Akun Editor
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                            Buat Akun Editor
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                className={inputClassName()}
                                placeholder="Nama editor"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className={inputClassName()}
                                placeholder="editor@domain.go.id"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Unit Kerja
                            </label>
                            <select
                                value={unitName}
                                onChange={(event) => setUnitName(event.target.value)}
                                className={inputClassName()}
                                required
                            >
                                <option value="">Pilih unit kerja</option>
                                {UNIT_KERJA_OPTIONS.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-black">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className={inputClassName()}
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                                >
                                    <EyeIcon isOpen={showPassword} />
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        ) : null}

                        {success ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={submitting || !fullName || !email || !password}
                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {submitting ? "Menyimpan..." : "Buat Akun Editor"}
                        </button>
                    </form>

                    <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-justify text-xs leading-6 text-slate-500">
                        Role akun yang dibuat adalah <span className="font-semibold">editor</span>.
                        Setelah pendaftaran, editor bisa login ke panel admin namun akses fitur
                        tetap menunggu verifikasi dari super admin.
                    </div>
                </div>
            </div>
        </section>
    );
}