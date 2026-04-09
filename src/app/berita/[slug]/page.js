import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "../../../components/PageBanner";
import { getBeritaBySlug } from "../../../lib/berita";
import Image from "next/image";
import BeritaViewCounter from "@/components/BeritaViewCounter";

export const dynamic = "force-dynamic";

export default async function DetailBeritaPage({ params }) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

  return (
    <>
      <PageBanner
        title="Detail Berita"
        description="Informasi lengkap berita Kemenag Barito Utara."
      />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/berita"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Kembali ke halaman berita
        </Link>

        <div className="mb-4 text-sm text-emerald-700">{berita.category}</div>

        <h1 className="text-3xl font-bold text-slate-900">{berita.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <p>Dipublikasikan pada {berita.date}</p>
          <BeritaViewCounter slug={berita.slug} initialViews={berita.views} />
        </div>

        {berita.excerpt ? (
          <p className="mt-6 text-lg text-slate-700">{berita.excerpt}</p>
        ) : null}

        {berita.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <Image
              src={berita.coverImage}
              alt={berita.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <article
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: berita.content || "" }}
        />
      </section>
    </>
  );
}
