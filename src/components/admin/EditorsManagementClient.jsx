"use client";

import { useMemo, useState } from "react";
import {
    AVAILABLE_EDITOR_PERMISSIONS,
    getPermissionLabel,
} from "@/lib/permissions";

function Badge({ children, tone = "slate" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
        amber: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
        rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
        blue: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900",
        violet: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PowerIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 2v10" strokeLinecap="round" />
            <path
                d="M7.05 4.93a9 9 0 1010.9 0"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"
                strokeLinejoin="round"
            />
            <path
                d="M9.5 12.5l1.5 1.5 3.5-4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
    );
}

function IconButton({
    label,
    icon,
    onClick,
    disabled = false,
    tone = "slate",
}) {
    const tones = {
        emerald:
            "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40",
        rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40",
        slate: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        blue: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
        >
            {icon}
        </button>
    );
}

function FilterButton({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${active
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                }`}
        >
            {children}
        </button>
    );
}

function EditorCard({
    index,
    editor,
    onApprove,
    onReject,
    onToggleActive,
    onOpenPermissions,
    busyAction,
}) {
    const role = editor.role || "editor";
    const isPending = editor.status === "pending";
    const isApproved = editor.status === "approved";
    const isRejected = editor.status === "rejected";
    const isActive = Boolean(editor.is_active);

    const approving = busyAction === `approve:${editor.user_id}`;
    const rejecting = busyAction === `reject:${editor.user_id}`;
    const toggling = busyAction === `toggle:${editor.user_id}`;

    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                            {index}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {editor.full_name}
                            </h3>
                            <p className="mt-0.5 break-all text-sm text-slate-600 dark:text-slate-400">
                                {editor.email}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Unit kerja
                            </p>
                            <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                                {editor.unit_name || "-"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Role
                            </p>
                            <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">{role}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Permission
                            </p>
                            <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                                {editor.permissions?.length || 0} akses
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {isPending ? <Badge tone="amber">Pending</Badge> : null}
                        {isApproved ? <Badge tone="emerald">Approved</Badge> : null}
                        {isRejected ? <Badge tone="rose">Rejected</Badge> : null}
                        <Badge tone={isActive ? "blue" : "slate"}>
                            {isActive ? "Akun aktif" : "Akun nonaktif"}
                        </Badge>
                        <Badge tone="violet">
                            {role === "admin" ? "Admin" : "Editor"}
                        </Badge>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs leading-6 text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                        <p>Requested at: {editor.requested_at || "-"}</p>
                        <p>Reviewed at: {editor.reviewed_at || "-"}</p>
                    </div>
                </div>

                <div className="lg:w-auto lg:min-w-47">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Aksi cepat
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <IconButton
                            label={approving ? "Memproses approve" : "Approve editor"}
                            icon={
                                approving ? (
                                    <span className="text-xs font-bold">...</span>
                                ) : (
                                    <CheckIcon />
                                )
                            }
                            onClick={() => onApprove(editor)}
                            disabled={approving}
                            tone="emerald"
                        />

                        <IconButton
                            label={rejecting ? "Memproses reject" : "Reject editor"}
                            icon={
                                rejecting ? (
                                    <span className="text-xs font-bold">...</span>
                                ) : (
                                    <XIcon />
                                )
                            }
                            onClick={() => onReject(editor)}
                            disabled={rejecting}
                            tone="rose"
                        />

                        <IconButton
                            label={
                                toggling
                                    ? "Memproses status akun"
                                    : isActive
                                        ? "Nonaktifkan akun"
                                        : "Aktifkan akun"
                            }
                            icon={
                                toggling ? (
                                    <span className="text-xs font-bold">...</span>
                                ) : (
                                    <PowerIcon />
                                )
                            }
                            onClick={() => onToggleActive(editor)}
                            disabled={toggling}
                            tone="slate"
                        />

                        <IconButton
                            label="Atur permission"
                            icon={<ShieldIcon />}
                            onClick={() => onOpenPermissions(editor)}
                            tone="blue"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PermissionsModal({
    open,
    editor,
    selectedPermissions,
    onTogglePermission,
    onClose,
    onSave,
    saving,
}) {
    if (!open || !editor) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
            <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                            Permission Editor
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {editor.full_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{editor.email}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {AVAILABLE_EDITOR_PERMISSIONS.map((permission) => {
                        const checked = selectedPermissions.includes(permission);

                        return (
                            <label
                                key={permission}
                                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${checked
                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onTogglePermission(permission)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {getPermissionLabel(permission)}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{permission}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {saving ? "Menyimpan..." : "Simpan permission"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EditorsManagementClient({ initialEditors = [] }) {
    const [busyAction, setBusyAction] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editors, setEditors] = useState(initialEditors);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [activeEditor, setActiveEditor] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [savingPermissions, setSavingPermissions] = useState(false);

    async function loadEditors() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/editors", {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Gagal memuat data editor.");
            }

            setEditors(Array.isArray(data?.editors) ? data.editors : []);
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat memuat editor.");
        } finally {
            setLoading(false);
        }
    }

    function openPermissions(editor) {
        setActiveEditor(editor);
        setSelectedPermissions(
            Array.isArray(editor.permissions) ? editor.permissions : []
        );
        setModalOpen(true);
    }

    function closePermissions() {
        setModalOpen(false);
        setActiveEditor(null);
        setSelectedPermissions([]);
    }

    function togglePermission(permission) {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((item) => item !== permission)
                : [...prev, permission]
        );
    }

    async function updateEditor(userId, payload, actionKey, successText) {
        setBusyAction(`${actionKey}:${userId}`);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`/api/admin/editors/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Aksi gagal diproses.");
            }

            setMessage(successText);
            await loadEditors();
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat memproses aksi.");
        } finally {
            setBusyAction("");
        }
    }

    async function savePermissions() {
        if (!activeEditor) return;

        setSavingPermissions(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(
                `/api/admin/editors/${activeEditor.user_id}/permissions`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        permissions: selectedPermissions,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Gagal menyimpan permission.");
            }

            setMessage("Permission editor berhasil disimpan.");
            closePermissions();
            await loadEditors();
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat menyimpan permission.");
        } finally {
            setSavingPermissions(false);
        }
    }

    const pendingCount = useMemo(
        () => editors.filter((item) => item.status === "pending").length,
        [editors]
    );

    const filteredEditors = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return editors.filter((item) => {
            const role = String(item.role || "editor").toLowerCase();
            const matchesRole = filterRole === "all" ? true : role === filterRole;

            if (!matchesRole) return false;
            if (!keyword) return true;

            const haystack = [
                item.full_name,
                item.email,
                item.unit_name,
                item.status,
                role,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(keyword);
        });
    }, [editors, search, filterRole]);

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-7">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                Super Admin Only
                            </p>
                            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Manajemen Editor
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                                Verifikasi akun editor baru, aktifkan atau nonaktifkan akun, dan
                                tentukan akses menu sesuai kebutuhan kerja masing-masing editor.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge tone="amber">Pending: {pendingCount}</Badge>
                            <Badge tone="blue">Total tampil: {filteredEditors.length}</Badge>
                            <Badge tone="slate">Total data: {editors.length}</Badge>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-md">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama, email, unit kerja, role, atau status"
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-emerald-900/40"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <FilterButton
                                active={filterRole === "all"}
                                onClick={() => setFilterRole("all")}
                            >
                                Semua
                            </FilterButton>

                            <FilterButton
                                active={filterRole === "admin"}
                                onClick={() => setFilterRole("admin")}
                            >
                                Admin
                            </FilterButton>

                            <FilterButton
                                active={filterRole === "editor"}
                                onClick={() => setFilterRole("editor")}
                            >
                                Editor
                            </FilterButton>
                        </div>
                    </div>
                </div>

                {message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-500" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Memuat data editor...
                        </p>
                    </div>
                ) : filteredEditors.length ? (
                    <div className="space-y-4">
                        {filteredEditors.map((editor, index) => (
                            <EditorCard
                                key={editor.user_id}
                                index={index + 1}
                                editor={editor}
                                busyAction={busyAction}
                                onApprove={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        { action: "approve" },
                                        "approve",
                                        "Akun editor berhasil di-approve."
                                    )
                                }
                                onReject={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        { action: "reject" },
                                        "reject",
                                        "Akun editor berhasil ditolak."
                                    )
                                }
                                onToggleActive={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        {
                                            action: item.is_active ? "deactivate" : "activate",
                                        },
                                        "toggle",
                                        item.is_active
                                            ? "Akun editor berhasil dinonaktifkan."
                                            : "Akun editor berhasil diaktifkan."
                                    )
                                }
                                onOpenPermissions={openPermissions}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Data editor tidak ditemukan
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Coba ubah kata kunci pencarian atau filter jenis akun.
                        </p>
                    </div>
                )}
            </div>

            <PermissionsModal
                open={modalOpen}
                editor={activeEditor}
                selectedPermissions={selectedPermissions}
                onTogglePermission={togglePermission}
                onClose={closePermissions}
                onSave={savePermissions}
                saving={savingPermissions}
            />
        </>
    );
}