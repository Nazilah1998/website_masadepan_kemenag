import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "../data/site";
import { getLatestBerita } from "../lib/berita";
import { toCoverPreviewUrl } from "../lib/cover-image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kementerian Agama Kabupaten Barito Utara",
  description:
    "Website Resmi Kementerian Agama Kabupaten Barito Utara sebagai pusat informasi, layanan publik, berita, dan publikasi kelembagaan.",
};

const featuredServices = [
  {
    tag: "PTSP",
    title: "Pelayanan Terpadu Satu Pintu",
    desc: "Pusat layanan administrasi dan informasi publik secara terpadu.",
    href: "/layanan/ptsp",
  },
  {
    tag: "Pengaduan",
    title: "Layanan Pengaduan",
    desc: "Sampaikan aspirasi, masukan, dan pengaduan layanan secara resmi.",
    href: "/layanan/pengaduan",
  },
  {
    tag: "ZI",
    title: "Zona Integritas",
    desc: "Komitmen menuju birokrasi bersih, transparan, dan melayani.",
    href: "/zona-integritas",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function getBeritaCover(item) {
  return toCoverPreviewUrl(item?.coverImage || "") || "/kemenag.svg";
}

export default async function HomePage() {
  const latestBerita = await getLatestBerita(3);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950" />

        <div className="absolute inset-0 opacity-25">
          <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-300 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-100 backdrop-blur">
              Portal Resmi Kemenag Barito Utara
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
              Layanan dan Informasi Keagamaan dalam Satu Portal Resmi.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50 lg:text-base">
              Website resmi Kementerian Agama Kabupaten Barito Utara sebagai
              pusat informasi publik, berita, layanan, dan publikasi kelembagaan
              yang mudah diakses masyarakat.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/layanan"
                className="rounded-full bg-white px-6 py-3 text-sm font-black text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Akses Layanan
              </Link>

              <Link
                href="/berita"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Lihat Berita
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                ["24+", "Layanan Publik"],
                ["120+", "Publikasi Aktif"],
                ["100%", "Informasi Resmi"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur"
                >
                  <p className="text-2xl font-black">{number}</p>
                  <p className="mt-1 text-xs font-bold text-emerald-100">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-4xl bg-white/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur">
              <div className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
                    <Image
                      src={siteInfo.logoSrc}
                      alt={siteInfo.shortName}
                      width={52}
                      height={52}
                      className="object-contain"
                      priority
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">
                      {siteInfo.shortName}
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                      Melayani Umat dengan Integritas
                    </h2>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-linear-to-br from-emerald-50 to-amber-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                    Fokus Pelayanan
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      "Informasi publik yang terbuka dan mudah diakses.",
                      "Layanan keagamaan yang cepat, ramah, dan profesional.",
                      "Publikasi kegiatan resmi Kemenag Barito Utara.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 text-sm font-semibold text-slate-700"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-200">
                    Status Portal
                  </p>
                  <p className="mt-2 text-xl font-black">Aktif</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-200">
                    Akses Publik
                  </p>
                  <p className="mt-2 text-xl font-black">Terbuka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-400">
            Layanan Unggulan
          </p>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-2xl text-2xl font-black text-white lg:text-3xl">
                Pelayanan utama yang paling sering dibutuhkan masyarakat
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Informasi layanan disusun lebih sederhana agar mudah dipahami
                dan nyaman diakses dari berbagai perangkat.
              </p>
            </div>

            <Link
              href="/layanan"
              className="w-fit rounded-full border border-white/20 px-5 py-2.5 text-sm font-black text-white hover:bg-white/10"
            >
              Semua Layanan
            </Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {featuredServices.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-white/10"
              >
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                  {item.tag}
                </span>
                <h3 className="mt-4 text-xl font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.desc}
                </p>
                <p className="mt-5 text-sm font-black text-emerald-300">
                  Lihat detail <ArrowIcon />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700">
              Berita Terbaru
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-black text-slate-950 lg:text-3xl">
              Ikuti pembaruan kegiatan dan informasi terkini
            </h2>
          </div>

          <Link
            href="/berita"
            className="w-fit rounded-full border border-slate-300 px-5 py-2.5 text-sm font-black text-slate-800 hover:border-emerald-300 hover:text-emerald-700"
          >
            Lihat Semua Berita
          </Link>
        </div>

        {latestBerita.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {latestBerita.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/berita/${item.slug}`} className="block h-full">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <Image
                      src={getBeritaCover(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={
                        item.coverImage
                          ? "object-cover transition duration-500 group-hover:scale-105"
                          : "object-contain p-10 transition duration-500 group-hover:scale-105"
                      }
                      unoptimized
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-black text-emerald-700 shadow-sm">
                      {item.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-bold text-white/80">
                        {item.date}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="line-clamp-2 text-sm leading-7 text-slate-600">
                      {item.excerpt ||
                        "Klik untuk membaca berita selengkapnya."}
                    </p>

                    <span className="mt-5 inline-block text-sm font-black text-emerald-700">
                      Baca selengkapnya <ArrowIcon />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Belum ada berita terbaru
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Berita yang sudah dipublikasikan akan tampil otomatis di bagian
              ini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
