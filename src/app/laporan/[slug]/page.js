import { notFound } from "next/navigation";
import DocumentListPage from "@/components/DocumentListPage";
import { laporanCategories } from "@/data/laporan";
import { getLaporanDetailBySlug } from "@/lib/laporan";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { siteInfo } from "@/data/site";

export function generateStaticParams() {
  return laporanCategories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getLaporanDetailBySlug(slug);

  if (!item) {
    return {
      title: "Dokumen Tidak Ditemukan",
      description: "Kategori laporan yang Anda cari tidak tersedia.",
    };
  }

  const url = `/laporan/${item.slug}`;
  const totalDocuments = Array.isArray(item.documents)
    ? item.documents.length
    : 0;

  return {
    title: `${item.title} | Laporan`,
    description:
      item.description ||
      `Dokumen ${item.title} Kementerian Agama Kabupaten Barito Utara.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url,
      siteName: siteInfo.shortName,
      title: `${item.title} | Laporan`,
      description:
        item.description ||
        `Dokumen ${item.title} Kementerian Agama Kabupaten Barito Utara.`,
    },
    twitter: {
      card: "summary",
      title: `${item.title} | Laporan`,
      description:
        item.description ||
        `Dokumen ${item.title} Kementerian Agama Kabupaten Barito Utara.`,
    },
    other: {
      "document:count": String(totalDocuments),
    },
  };
}

export const revalidate = 300;

export default async function LaporanDetailPage({ params }) {
  const { slug } = await params;
  const item = await getLaporanDetailBySlug(slug);

  if (!item) {
    notFound();
  }

  const totalDocuments = Array.isArray(item.documents)
    ? item.documents.length
    : 0;
  const totalViews = Array.isArray(item.documents)
    ? item.documents.reduce((sum, doc) => sum + Number(doc?.view_count || 0), 0)
    : 0;

  const jsonLd = breadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Laporan", url: "/laporan" },
    { name: item.title, url: `/laporan/${item.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <DocumentListPage
        title={item.title}
        description={item.description}
        intro={item.intro}
        documents={item.documents}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Laporan", href: "/laporan" },
          { label: item.title },
        ]}
        stats={[
          {
            label: "Total Dokumen",
            value: totalDocuments,
          },
          {
            label: "Total Dibaca",
            value: totalViews,
          },
        ]}
      />
    </>
  );
}
