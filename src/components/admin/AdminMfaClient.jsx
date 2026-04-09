"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

function mapMfaError(error) {
    const code = error?.code;
    const message = error?.message || "Terjadi kesalahan pada verifikasi MFA.";

    if (code === "mfa_totp_enroll_not_enabled") {
        return "TOTP MFA belum diaktifkan di Supabase Dashboard.";
    }

    if (code === "mfa_totp_verify_not_enabled") {
        return "Verifikasi TOTP MFA belum diaktifkan di Supabase Dashboard.";
    }

    if (code === "mfa_verification_failed") {
        return "Kode authenticator salah atau sudah kedaluwarsa.";
    }

    if (code === "mfa_challenge_expired") {
        return "Sesi verifikasi MFA sudah kedaluwarsa. Silakan coba lagi.";
    }

    if (code === "mfa_ip_address_mismatch") {
        return "Setup MFA harus diselesaikan dari jaringan/IP yang sama.";
    }

    return message;
}

export default function AdminMfaClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = useMemo(() => createClient(), []);

    const requestedMode = searchParams.get("mode");

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("detect"); // detect | enroll | verify

    const [adminEmail, setAdminEmail] = useState("");
    const [aal, setAal] = useState({
        currentLevel: null,
        nextLevel: null,
    });

    const [factorId, setFactorId] = useState("");
    const [friendlyName, setFriendlyName] = useState("Authenticator Admin");
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [uri, setUri] = useState("");

    const [verifyCode, setVerifyCode] = useState("");
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;

        async function boot() {
            setLoading(true);
            setError("");

            try {
                const sessionRes = await fetch("/api/admin/session", {
                    method: "GET",
                    cache: "no-store",
                });

                const sessionData = await sessionRes.json().catch(() => null);

                if (!active) return;

                if (!sessionRes.ok || !sessionData?.permissions?.isAdmin) {
                    router.replace("/admin/login?error=unauthorized");
                    router.refresh();
                    return;
                }

                setAdminEmail(sessionData?.user?.email ?? "");

                const { data: aalData, error: aalError } =
                    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

                if (aalError) {
                    throw aalError;
                }

                if (!active) return;

                const currentLevel = aalData?.currentLevel ?? null;
                const nextLevel = aalData?.nextLevel ?? null;

                setAal({
                    currentLevel,
                    nextLevel,
                });

                if (currentLevel === "aal2") {
                    router.replace("/admin");
                    router.refresh();
                    return;
                }

                let resolvedMode = "enroll";

                if (requestedMode === "verify" || requestedMode === "enroll") {
                    resolvedMode = requestedMode;
                } else if (nextLevel === "aal2") {
                    resolvedMode = "verify";
                }

                setMode(resolvedMode);

                if (resolvedMode === "verify") {
                    const factors = await supabase.auth.mfa.listFactors();

                    if (factors.error) {
                        throw factors.error;
                    }

                    const totpFactor = factors.data?.totp?.[0];

                    if (!totpFactor) {
                        setMode("enroll");
                        return;
                    }

                    setFactorId(totpFactor.id);
                    setFriendlyName(totpFactor.friendly_name || "Authenticator Admin");
                }
            } catch (err) {
                console.error("boot MFA error:", err);
                if (active) {
                    setError(mapMfaError(err));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        boot();

        return () => {
            active = false;
        };
    }, [requestedMode, router, supabase]);

    async function handleStartEnrollment() {
        setInitializing(true);
        setError("");
        setQrCode("");
        setSecret("");
        setUri("");
        setFactorId("");

        try {
            const labelBase = adminEmail ? `Admin ${adminEmail}` : "Admin Kemenag";
            const generatedFriendlyName = `${labelBase} ${new Date()
                .toISOString()
                .replace(/[:.]/g, "-")}`;

            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: "totp",
                friendlyName: generatedFriendlyName,
            });

            if (error) {
                throw error;
            }

            setFactorId(data.id);
            setFriendlyName(data.friendly_name || generatedFriendlyName);
            setQrCode(data?.totp?.qr_code || "");
            setSecret(data?.totp?.secret || "");
            setUri(data?.totp?.uri || "");
        } catch (err) {
            console.error("start enrollment error:", err);
            setError(mapMfaError(err));
        } finally {
            setInitializing(false);
        }
    }

    async function handleVerify(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            let activeFactorId = factorId;

            if (!activeFactorId) {
                const factors = await supabase.auth.mfa.listFactors();

                if (factors.error) {
                    throw factors.error;
                }

                const totpFactor = factors.data?.totp?.[0];

                if (!totpFactor) {
                    throw new Error("Faktor TOTP belum tersedia.");
                }

                activeFactorId = totpFactor.id;
                setFactorId(activeFactorId);
            }

            const challenge = await supabase.auth.mfa.challenge({
                factorId: activeFactorId,
            });

            if (challenge.error) {
                throw challenge.error;
            }

            const verify = await supabase.auth.mfa.verify({
                factorId: activeFactorId,
                challengeId: challenge.data.id,
                code: verifyCode.trim(),
            });

            if (verify.error) {
                throw verify.error;
            }

            router.replace("/admin");
            router.refresh();
        } catch (err) {
            console.error("verify MFA error:", err);
            setError(mapMfaError(err));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleLogout() {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("logout error:", err);
        } finally {
            router.replace("/admin/login");
            router.refresh();
        }
    }

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-slate-700">
                        Mengecek status MFA admin...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl">
                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="hidden lg:flex flex-col justify-between bg-slate-950 px-10 py-10 text-white">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <Image
                                    src={siteInfo.logoSrc}
                                    alt={siteInfo.shortName}
                                    width={42}
                                    height={42}
                                    priority
                                />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                                        Keamanan Admin
                                    </p>
                                    <h2 className="mt-1 text-lg font-bold">
                                        {siteInfo.shortName}
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-10 max-w-lg">
                                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                                    MFA Authenticator
                                </p>
                                <h1 className="mt-4 text-4xl font-bold leading-tight">
                                    Lindungi panel admin dengan verifikasi dua langkah.
                                </h1>
                                <p className="mt-5 text-base leading-8 text-slate-300">
                                    Setelah password benar, akun admin wajib menyelesaikan
                                    verifikasi kode dari aplikasi authenticator sebelum dapat masuk
                                    ke panel internal.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <p className="text-sm font-semibold text-white">Status login</p>
                            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                                <li>
                                    Current AAL:{" "}
                                    <span className="font-semibold text-white">
                                        {aal.currentLevel ?? "-"}
                                    </span>
                                </li>
                                <li>
                                    Next AAL:{" "}
                                    <span className="font-semibold text-white">
                                        {aal.nextLevel ?? "-"}
                                    </span>
                                </li>
                                <li>
                                    Mode halaman:{" "}
                                    <span className="font-semibold text-white">{mode}</span>
                                </li>
                                <li>
                                    Faktor:{" "}
                                    <span className="font-semibold text-white">
                                        {friendlyName || "-"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                        <div className="mx-auto w-full max-w-md">
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
                                    <p className="text-xs text-slate-500">
                                        MFA khusus panel admin
                                    </p>
                                </div>
                            </Link>

                            <div className="mt-8">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                        Admin MFA
                                    </p>

                                    <Link
                                        href="/admin/login"
                                        className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        ← Kembali ke Login
                                    </Link>
                                </div>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                    {mode === "verify"
                                        ? "Masukkan kode authenticator"
                                        : "Aktifkan authenticator admin"}
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {mode === "verify"
                                        ? "Akun Anda sudah memiliki MFA. Masukkan 6 digit kode dari aplikasi authenticator."
                                        : "Scan QR code dengan Google Authenticator, Microsoft Authenticator, Authy, atau aplikasi TOTP lain untuk mengaktifkan MFA admin."}
                                </p>
                            </div>

                            {error ? (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            ) : null}

                            {mode === "enroll" ? (
                                <div className="mt-6 space-y-5">
                                    {!qrCode ? (
                                        <button
                                            type="button"
                                            onClick={handleStartEnrollment}
                                            disabled={initializing}
                                            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {initializing ? "Membuat QR..." : "Buat QR MFA Admin"}
                                        </button>
                                    ) : (
                                        <>
                                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    1. Scan QR code berikut
                                                </p>

                                                <div className="mt-4 flex justify-center">
                                                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={qrCode}
                                                            alt={uri || "QR Code MFA Admin"}
                                                            className="h-56 w-56"
                                                        />
                                                    </div>
                                                </div>

                                                {secret ? (
                                                    <div className="mt-4">
                                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                            Secret manual
                                                        </p>
                                                        <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm break-all text-slate-700">
                                                            {secret}
                                                        </div>
                                                    </div>
                                                ) : null}

                                                <p className="mt-4 text-xs leading-6 text-slate-500">
                                                    Jika QR gagal dipindai, masukkan secret manual ke aplikasi
                                                    authenticator Anda.
                                                </p>
                                            </div>

                                            <form onSubmit={handleVerify} className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="mfa-code-enroll"
                                                        className="mb-2 block text-sm font-semibold text-slate-800"
                                                    >
                                                        2. Masukkan 6 digit kode
                                                    </label>
                                                    <input
                                                        id="mfa-code-enroll"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]{6}"
                                                        maxLength={6}
                                                        value={verifyCode}
                                                        onChange={(event) =>
                                                            setVerifyCode(
                                                                event.target.value.replace(/\D/g, "").slice(0, 6)
                                                            )
                                                        }
                                                        placeholder="123456"
                                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={submitting || verifyCode.length !== 6}
                                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                                >
                                                    {submitting ? "Memverifikasi..." : "Aktifkan MFA"}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleVerify} className="mt-8 space-y-5">
                                    <div>
                                        <label
                                            htmlFor="mfa-code-verify"
                                            className="mb-2 block text-sm font-semibold text-slate-800"
                                        >
                                            Kode Authenticator
                                        </label>
                                        <input
                                            id="mfa-code-verify"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            value={verifyCode}
                                            onChange={(event) =>
                                                setVerifyCode(
                                                    event.target.value.replace(/\D/g, "").slice(0, 6)
                                                )
                                            }
                                            placeholder="123456"
                                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || verifyCode.length !== 6}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {submitting ? "Memverifikasi..." : "Verifikasi MFA"}
                                    </button>
                                </form>
                            )}

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Logout
                                </button>

                                <Link
                                    href="/"
                                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Website Utama
                                </Link>
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-900">
                                    Catatan keamanan
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Simpan authenticator admin hanya pada perangkat yang benar-benar
                                    dikuasai admin terkait. Jangan gunakan perangkat bersama.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}