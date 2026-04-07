import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function AdminDashboardPage() {
  const session = await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });
  const user = session.profile;
  return (
    <div className="space-y-6">
      {" "}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {" "}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          {" "}
          Admin Panel{" "}
        </p>{" "}
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          {" "}
          Selamat datang di dashboard admin{" "}
        </h2>{" "}
        <p className="mt-2 text-slate-600">
          {" "}
          Login Supabase berhasil. Akses admin aktif dan siap dipakai.{" "}
        </p>{" "}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {" "}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {" "}
            <p className="text-sm text-slate-500">Email</p>{" "}
            <p className="mt-2 font-semibold text-slate-900">
              {" "}
              {user?.email || "-"}{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {" "}
            <p className="text-sm text-slate-500">Nama</p>{" "}
            <p className="mt-2 font-semibold text-slate-900">
              {" "}
              {user?.full_name || "-"}{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {" "}
            <p className="text-sm text-slate-500">Role</p>{" "}
            <p className="mt-2 font-semibold text-emerald-700">
              {" "}
              {user?.role || "-"}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {" "}
        <Link
          href="/admin/berita"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {" "}
          <p className="text-sm font-semibold text-emerald-600">Berita</p>{" "}
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {" "}
            Kelola berita website{" "}
          </h3>{" "}
          <p className="mt-2 text-sm text-slate-500">
            {" "}
            Tambah, edit, dan hapus berita publik.{" "}
          </p>{" "}
        </Link>{" "}
        <Link
          href="/admin/pengumuman"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {" "}
          <p className="text-sm font-semibold text-emerald-600">
            Pengumuman
          </p>{" "}
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {" "}
            Kelola pengumuman{" "}
          </h3>{" "}
          <p className="mt-2 text-sm text-slate-500">
            {" "}
            Atur pengumuman resmi dan status tayang.{" "}
          </p>{" "}
        </Link>{" "}
        <Link
          href="/admin/agenda"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {" "}
          <p className="text-sm font-semibold text-emerald-600">Agenda</p>{" "}
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {" "}
            Kelola agenda{" "}
          </h3>{" "}
          <p className="mt-2 text-sm text-slate-500">
            {" "}
            Atur jadwal kegiatan dan event instansi.{" "}
          </p>{" "}
        </Link>{" "}
        <Link
          href="/admin/dokumen"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {" "}
          <p className="text-sm font-semibold text-emerald-600">Dokumen</p>{" "}
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {" "}
            Kelola dokumen{" "}
          </h3>{" "}
          <p className="mt-2 text-sm text-slate-500">
            {" "}
            Upload dan atur dokumen publik.{" "}
          </p>{" "}
        </Link>{" "}
      </section>{" "}
    </div>
  );
}
