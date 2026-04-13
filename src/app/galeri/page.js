import PageBanner from "@/components/PageBanner";
import GaleriPageClient from "@/components/GaleriPageClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri | Kemenag Barito Utara",
  description:
    "Galeri dokumentasi kegiatan dan publikasi Kementerian Agama Barito Utara.",
};

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

    return (data || []).map((item) => {
      const normalizedImage = normalizeCoverImageUrl(item.image_url || "");
      const previewImage = toCoverPreviewUrl(normalizedImage);

      return {
        id: item.id,
        title: item.title || "Dokumentasi kegiatan",
        imageUrl: previewImage || "/kemenag.svg",
        linkUrl: item.link_url && item.link_url !== "#" ? item.link_url : "",
        publishedAt: item.published_at || item.created_at || null,
      };
    });
  } catch (error) {
    console.error("GaleriPage error:", error);
    return [];
  }
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

      <GaleriPageClient items={items} />
    </>
  );
}
