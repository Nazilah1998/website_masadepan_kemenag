import { requireAdmin } from "@/lib/auth";
import { getLaporanDetailBySlug, getAllLaporanCategories } from "@/lib/laporan";
import AdminLaporanCategoryManager from "@/components/admin/AdminLaporanCategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminLaporanPage() {
    await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    const categories = await getAllLaporanCategories();
    const firstSlug = categories?.[0]?.slug || null;
    const firstCategory = firstSlug
        ? await getLaporanDetailBySlug(firstSlug)
        : null;

    const category = firstCategory || {
        id: "",
        slug: "",
        title: "—",
        description: "",
        intro: "",
        documents: [],
    };

    return (
        <section className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Admin · Dokumen Laporan
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    Kelola Dokumen Laporan
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Pilih kategori dokumen, upload file PDF, dan kelola seluruh dokumen
                    laporan publik dari satu halaman ini.
                </p>
            </div>

            <AdminLaporanCategoryManager
                category={category}
                categories={categories}
            />
        </section>
    );
}