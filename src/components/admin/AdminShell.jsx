"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useTheme } from "@/context/ThemeContext";

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12" /><path d="M18 6L6 18" />
        </svg>
    );
}

function ThemeToggleIcon({ isDark }) {
    return isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    );
}

export default function AdminShell({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const [sessionData, setSessionData] = useState(null);
    const [permissionContext, setPermissionContext] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadSession() {
            try {
                const [sessionRes, permRes] = await Promise.all([
                    fetch("/api/admin/session", { cache: "no-store" }),
                    fetch("/api/admin/my-permissions", { cache: "no-store" }),
                ]);

                const session = await sessionRes.json().catch(() => null);
                const perm = await permRes.json().catch(() => null);

                if (!active) return;

                const hasAdminPanelAccess =
                    session?.permissions?.isAdmin || session?.permissions?.isEditor;

                if (!sessionRes.ok || !hasAdminPanelAccess) {
                    router.replace("/admin/login");
                    return;
                }

                setSessionData(session);
                setPermissionContext(perm?.permissionContext || null);
            } catch {
                if (active) router.replace("/admin/login");
            } finally {
                if (active) setLoading(false);
            }
        }

        loadSession();

        return () => { active = false; };
    }, [router]);

    useEffect(() => {
        if (!sidebarOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [sidebarOpen]);

    const profile = sessionData?.user || null;
    const role = sessionData?.permissions?.role || null;

    const compactName = useMemo(() => {
        const name = String(profile?.full_name || "").trim();
        if (name) return name;
        const email = String(profile?.email || "").trim();
        return email ? email.split("@")[0] : "Admin";
    }, [profile]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-700" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Memuat panel admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
            <aside className="hidden lg:block lg:w-72 lg:shrink-0">
                <div className="sticky top-0 h-screen border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <AdminSidebar
                        profile={profile}
                        role={role}
                        permissionContext={permissionContext}
                    />
                </div>
            </aside>

            {sidebarOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 bg-slate-950/45"
                    />
                    <div className="relative h-full w-[85%] max-w-[320px] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Kemenag Barito Utara</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:text-rose-400"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <AdminSidebar
                            profile={profile}
                            role={role}
                            permissionContext={permissionContext}
                            onNavigate={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            ) : null}

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                    <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
                        <div className="min-w-0 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 lg:hidden"
                                aria-label="Buka sidebar"
                            >
                                <MenuIcon />
                            </button>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
                                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">Kemenag Barito Utara</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                                aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
                                title={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
                            >
                                <ThemeToggleIcon isDark={isDark} />
                                <span className="hidden text-xs font-semibold sm:inline">
                                    {isDark ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>
                            <div className="hidden w-55 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 sm:block">
                                <p className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{compactName}</p>
                                <p className="truncate text-xs leading-5 text-slate-500 dark:text-slate-400">{profile?.email || "-"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">{children}</main>
            </div>
        </div>
    );
}