import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminLogoutButton from "../../components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("full_name, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow?.is_active) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              Admin Panel
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              Kemenag Barito Utara
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {adminRow.full_name ?? user.email}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Role: {adminRow.role}
            </p>
          </div>

          <nav className="space-y-2">
            <a
              href="/admin"
              className="block rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              Dashboard
            </a>
            <a
              href="/admin/berita"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Berita
            </a>
            <a
              href="/admin/pengumuman"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Pengumuman
            </a>
            <a
              href="/admin/agenda"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Agenda
            </a>
            <a
              href="/admin/dokumen"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Dokumen
            </a>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Dashboard Admin
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Login berhasil dan akses admin aktif.
              </p>
            </div>

            <AdminLogoutButton />
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}