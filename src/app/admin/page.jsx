import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllBerita } from "@/lib/berita";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-4xl font-bold leading-none text-slate-900">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

function FocusCard({ title, description, href, cta }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
        Modul utama
      </p>

      <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        {cta}
      </Link>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  const user = session.profile;
  const beritaList = await getAllBerita();

  const totalBerita = beritaList.length;
  const totalViews = beritaList.reduce(
    (acc, item) => acc + Number(item.views || 0),
    0,
  );
  const averageViews =
    totalBerita > 0 ? Math.round(totalViews / totalBerita) : 0;
  const latestBerita = beritaList[0] || null;

  const displayEmail = user?.email || "-";
  const compactName =
    user?.full_name?.trim() ||
    String(displayEmail).split("@")[0] ||
    "Admin";

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
          Dashboard Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Selamat datang, {compactName}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          Panel admin saat ini difokuskan sepenuhnya untuk workflow editorial
          berita agar proses tulis, edit, publikasi, dan distribusi ke galeri
          lebih rapi.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {displayEmail}
          </span>
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Fokus modul: Berita
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total berita"
          value={totalBerita}
          helper="Jumlah seluruh berita yang tersimpan di panel admin."
        />
        <StatCard
          label="Total views"
          value={totalViews}
          helper="Akumulasi pembaca dari semua berita yang sudah tercatat."
        />
        <StatCard
          label="Rata-rata views"
          value={averageViews}
          helper="Rata-rata pembaca per berita untuk memantau performa konten."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <FocusCard
          title="Kelola berita"
          description="Masuk ke modul berita untuk menulis artikel baru, mengatur status tayang, memperbarui cover, serta mengirim item ke galeri."
          href="/admin/berita"
          cta="Buka modul berita"
        />

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Berita terbaru
          </p>

          {latestBerita ? (
            <>
              <h3 className="mt-3 text-xl font-bold leading-8 text-slate-900">
                {latestBerita.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Rilis terakhir: {formatDate(latestBerita.published_at)}
              </p>

              <Link
                href="/admin/berita"
                className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Lanjut kelola berita →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Belum ada berita yang tersimpan. Mulai dari modul berita untuk
              membuat publikasi pertama.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-5">
        <p className="text-sm font-semibold text-slate-900">
          Catatan pembaruan panel
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Modul Pengumuman, Agenda, dan Dokumen dinonaktifkan sementara agar
          pengembangan panel admin lebih fokus pada kualitas dan kestabilan
          workflow berita.
        </p>
      </div>
    </section>
  );
}