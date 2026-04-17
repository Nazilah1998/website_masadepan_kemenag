import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getLaporanDetailBySlug, getAllLaporanCategories } from "@/lib/laporan";
import AdminLaporanCategoryManager from "@/components/admin/AdminLaporanCategoryManager";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    const categories = await getAllLaporanCategories();
    return categories.map((item) => ({ slug: item.slug }));
}

export default async function AdminLaporanCategoryPage({ params }) {
    await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    const { slug } = await params;
    const category = await getLaporanDetailBySlug(slug);
    const categories = await getAllLaporanCategories();

    if (!category) {
        notFound();
    }

    return (
        <section className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Link
                        href="/admin/laporan"
                        className="font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        ← Kembali ke daftar kategori
                    </Link>
                    <span className="text-slate-400">/</span>
                    <span className="font-medium text-slate-600">{category.title}</span>
                </div>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    {category.title}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Upload dan kelola dokumen khusus untuk kategori ini. Semua file yang
                    ditambahkan di halaman ini otomatis masuk ke submenu {category.title}.
                </p>
            </div>

            <AdminLaporanCategoryManager
                category={category}
                categories={categories}
            />
        </section>
    );
}