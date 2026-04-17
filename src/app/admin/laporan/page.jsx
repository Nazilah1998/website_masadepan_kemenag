import { requireAdmin } from "@/lib/auth";
import AdminLaporanManager from "@/components/admin/AdminLaporanManager";

export const dynamic = "force-dynamic";

export default async function AdminLaporanPage() {
    await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    return (
        <section className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Admin Laporan
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    Kelola Dokumen Laporan
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Kelola 7 submenu laporan dari satu tempat. Anda dapat memperbarui judul,
                    deskripsi, ringkasan halaman, upload file dokumen, mengatur urutan tampil,
                    publish atau draft, dan menghapus dokumen yang tidak dipakai.
                </p>
            </div>

            <AdminLaporanManager />
        </section>
    );
}