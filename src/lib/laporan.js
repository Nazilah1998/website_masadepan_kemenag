import { laporanCategories } from "@/data/laporan";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizeFallbackCategory(item) {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title,
    description: item.description,
    intro: item.intro,
    sort_order: 0,
    is_active: true,
    documents: Array.isArray(item.documents) ? item.documents : [],
  };
}

function normalizeDocument(doc) {
  const href = doc?.file_url || doc?.href || "#";
  const year = doc?.year ? String(doc.year) : "";
  const fileSize = Number(doc?.file_size || 0);
  const metaParts = [];

  if (year) metaParts.push(year);
  if (doc?.mime_type) metaParts.push("PDF");
  if (fileSize > 0) metaParts.push(`${Math.round(fileSize / 1024)} KB`);

  return {
    id: doc?.id || `${doc?.title || "dokumen"}-${href}`,
    title: doc?.title || "Dokumen",
    description: doc?.description || "",
    href,
    meta: metaParts.join(" • "),
    year: doc?.year || null,
    file_url: doc?.file_url || href,
    file_name: doc?.file_name || "",
    is_published:
      typeof doc?.is_published === "boolean" ? doc.is_published : true,
  };
}

export async function getAllLaporanCategories() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("report_categories")
      .select("id, slug, title, description, intro, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;
    if (!Array.isArray(data) || data.length === 0) {
      return laporanCategories.map(normalizeFallbackCategory);
    }

    return data.map((item) => ({
      ...item,
      documents: [],
    }));
  } catch {
    return laporanCategories.map(normalizeFallbackCategory);
  }
}

export async function getLaporanDetailBySlug(slug) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("report_categories")
      .select(
        `
        id,
        slug,
        title,
        description,
        intro,
        sort_order,
        is_active,
        documents:report_documents (
          id,
          title,
          description,
          year,
          file_name,
          file_path,
          file_url,
          mime_type,
          file_size,
          is_published,
          created_at,
          updated_at
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      documents: Array.isArray(data.documents)
        ? data.documents
            .filter(
              (item) =>
                item?.is_published !== false || item?.is_published === true,
            )
            .sort((a, b) => {
              const yearA = Number(a?.year || 0);
              const yearB = Number(b?.year || 0);
              if (yearA !== yearB) return yearB - yearA;
              return String(a?.title || "").localeCompare(
                String(b?.title || ""),
                "id",
              );
            })
            .map(normalizeDocument)
        : [],
    };
  } catch {
    const fallback = laporanCategories.find((item) => item.slug === slug);
    if (!fallback) return null;
    return normalizeFallbackCategory(fallback);
  }
}
