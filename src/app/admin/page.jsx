import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Selamat datang di dashboard admin
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Login Supabase berhasil. Tahap berikutnya kita tinggal sambungkan CRUD
          berita, pengumuman, agenda, dan dokumen.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user?.email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Nama
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {adminRow?.full_name ?? "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Role
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {adminRow?.role ?? "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Status
            </p>
            <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Admin aktif
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}