import { laporanCategories } from "@/data/laporan";
import { createAdminClient } from "@/lib/supabase/admin";

function sortDocuments(items = []) {
  return [...items].sort((a, b) => {
    const yearA = Number(a?.year || 0);
    const yearB = Number(b?.year || 0);
    if (yearA !== yearB) return yearB - yearA;

    const viewsA = Number(a?.view_count || 0);
    const viewsB = Number(b?.view_count || 0);
    if (viewsA !== viewsB) return viewsB - viewsA;

    return String(a?.title || "").localeCompare(String(b?.title || ""), "id");
  });
}

function normalizeDocument(doc) {
  const href = doc?.file_url || doc?.href || "#";
  const year = doc?.year ? String(doc.year) : "";
  const fileSize = Number(doc?.file_size || 0);
  const viewCount = Number(doc?.view_count || 0);
  const metaParts = [];

  if (year) metaParts.push(year);
  if (doc?.mime_type || href.toLowerCase().includes(".pdf"))
    metaParts.push("PDF");
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
    file_path: doc?.file_path || "",
    mime_type: doc?.mime_type || "application/pdf",
    file_size: fileSize,
    view_count: viewCount,
    is_published:
      typeof doc?.is_published === "boolean" ? doc.is_published : true,
    created_at: doc?.created_at || null,
    updated_at: doc?.updated_at || null,
  };
}

function normalizeFallbackCategory(item) {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title,
    description: item.description,
    intro: item.intro,
    sort_order: 0,
    is_active: true,
    documents: sortDocuments(
      Array.isArray(item.documents)
        ? item.documents.map(normalizeDocument)
        : [],
    ),
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
          view_count,
          sort_order,
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
        ? sortDocuments(
            data.documents
              .filter(
                (item) =>
                  item?.is_published !== false || item?.is_published === true,
              )
              .map(normalizeDocument),
          )
        : [],
    };
  } catch {
    const fallback = laporanCategories.find((item) => item.slug === slug);
    if (!fallback) return null;
    return normalizeFallbackCategory(fallback);
  }
}

export async function getAdminLaporanCategories(slug = "") {
  try {
    const supabase = createAdminClient();

    let query = supabase.from("report_categories").select(
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
        view_count,
        sort_order,
        is_published,
        created_at,
        updated_at
      )
    `,
    );

    if (slug) {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    return (data || []).map((item) => ({
      ...item,
      documents: Array.isArray(item.documents)
        ? sortDocuments(item.documents.map(normalizeDocument))
        : [],
    }));
  } catch {
    if (slug) {
      const fallback = laporanCategories.find((item) => item.slug === slug);
      return fallback ? [normalizeFallbackCategory(fallback)] : [];
    }

    return laporanCategories.map(normalizeFallbackCategory);
  }
}
