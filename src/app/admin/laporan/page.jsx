import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllLaporanCategories } from "@/lib/laporan";

export const dynamic = "force-dynamic";

export default async function AdminLaporanPage() {
    await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    const categories = await getAllLaporanCategories();

    return (
        <section className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Admin Laporan
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    Pilih Kategori Dokumen
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Pilih salah satu dari 7 submenu laporan. Setelah dipilih, halaman akan
                    langsung berpindah ke kategori tersebut dan semua file yang diupload
                    akan otomatis masuk ke kategori itu.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categories.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/admin/laporan/${item.slug}`}
                        className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                                    {item.title}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {item.description}
                                </p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                                Buka
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}