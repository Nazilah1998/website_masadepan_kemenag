import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri | Kemenag Barito Utara",
  description:
    "Galeri dokumentasi kegiatan dan publikasi Kementerian Agama Barito Utara.",
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function getPublishedGaleri() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("galeri")
      .select(
        `
        id,
        title,
        image_url,
        link_url,
        is_published,
        published_at,
        created_at
      `,
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat galeri:", error);
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      title: item.title || "Dokumentasi kegiatan",
      imageUrl: toCoverPreviewUrl(normalizeCoverImageUrl(item.image_url || "")),
      rawImageUrl: normalizeCoverImageUrl(item.image_url || ""),
      linkUrl: item.link_url || "#",
      publishedAt: item.published_at || item.created_at || null,
    }));
  } catch (error) {
    console.error("GaleriPage error:", error);
    return [];
  }
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
        Galeri
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        Belum ada item galeri
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
        Item galeri akan tampil di halaman ini setelah berita dikirim dari panel
        admin ke galeri.
      </p>
    </div>
  );
}

function GalleryCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <a
        href={item.rawImageUrl || item.imageUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-zoom-in"
        title="Buka gambar"
      >
        <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl || "/images/placeholder-news.jpg"}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />

          <div className="pointer-events-none absolute inset-0 bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/10" />

          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
            Lihat gambar
          </div>
        </div>
      </a>

      <div className="p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {formatDate(item.publishedAt)}
        </p>

        <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-slate-900">
          {item.title}
        </h3>

        <Link
          href={item.linkUrl}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Buka berita
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default async function GaleriPage() {
  const items = await getPublishedGaleri();

  return (
    <>
      <PageBanner
        title="Galeri"
        description="Dokumentasi visual kegiatan dan publikasi Kemenag Barito Utara."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Dokumentasi
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Galeri Kegiatan
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
              Kumpulan dokumentasi visual yang terhubung langsung ke berita dan
              publikasi resmi.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Total item
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {items.length}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
