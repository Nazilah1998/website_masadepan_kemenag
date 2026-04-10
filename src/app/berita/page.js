import Image from "next/image";
import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import NewsPagination from "../../components/berita/NewsPagination";
import { getAllBerita } from "../../lib/berita";

const ITEMS_PER_PAGE = 6;
const FALLBACK_IMAGE = "/images/placeholder-news.jpg";

function clampPage(value, max) {
  if (!Number.isFinite(value) || value < 1) return 1;
  if (value > max) return max;
  return value;
}

function getCoverImage(item) {
  return item.coverImage || FALLBACK_IMAGE;
}

function FeaturedNewsCard({ item }) {
  if (!item) return null;

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-70 bg-slate-100">
          <Image
            src={getCoverImage(item)}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-between p-8">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Berita Terbaru
            </span>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>{item.date}</span>
              {item.category ? (
                <>
                  <span>•</span>
                  <span className="font-medium text-emerald-700">
                    {item.category}
                  </span>
                </>
              ) : null}
            </div>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900">
              {item.title}
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              {item.excerpt || "Berita terbaru dari Kemenag Barito Utara."}
            </p>
          </div>

          <div className="mt-8">
            <Link
              href={`/berita/${item.slug}`}
              className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Baca selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item }) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-slate-200 bg-[#061635] text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-16/10 bg-slate-100">
        <Image
          src={getCoverImage(item)}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span>{item.date}</span>
          {item.category ? (
            <>
              <span>•</span>
              <span className="font-semibold text-emerald-400">
                {item.category}
              </span>
            </>
          ) : null}
        </div>

        <h3 className="mt-4 line-clamp-2 text-2xl font-bold leading-snug text-white">
          {item.title}
        </h3>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">
          {item.excerpt || "Klik untuk membaca berita selengkapnya."}
        </p>

        <Link
          href={`/berita/${item.slug}`}
          className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}

export const metadata = {
  title: "Berita | Kemenag Barito Utara",
  description: "Informasi dan kegiatan terbaru Kemenag Barito Utara",
};

export const dynamic = "force-dynamic";

export default async function BeritaPage({ searchParams }) {
  const params = await searchParams;
  const beritaList = await getAllBerita();

  const latestNews = beritaList[0] ?? null;
  const remainingNews = beritaList.slice(1);

  const totalPages = Math.max(
    1,
    Math.ceil(remainingNews.length / ITEMS_PER_PAGE),
  );
  const currentPage = clampPage(Number(params?.page ?? 1), totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = remainingNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      <PageBanner
        title="Berita"
        description="Publikasi berita dan informasi terbaru Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {latestNews ? (
          <FeaturedNewsCard item={latestNews} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Belum ada berita yang dipublikasikan.
          </div>
        )}

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Arsip Berita
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Berita Lainnya
              </h2>
            </div>

            <div className="text-sm text-slate-500">
              Menampilkan {paginatedNews.length} berita
            </div>
          </div>

          {paginatedNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedNews.map((item) => (
                <NewsCard key={item.id || item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Belum ada berita lain untuk ditampilkan.
            </div>
          )}

          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/berita"
          />
        </section>
      </main>
    </>
  );
}
