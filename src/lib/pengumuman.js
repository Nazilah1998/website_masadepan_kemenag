import { createClient } from "@/lib/supabase/server";
import { pengumumanList as staticPengumumanList } from "@/data/pengumuman";

export function slugifyPengumuman(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPengumumanDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

function normalizeDateTime(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function normalizeStaticItem(item, index) {
  return {
    id: `static-${index + 1}`,
    title: item.title || "",
    slug: item.slug || slugifyPengumuman(item.title || ""),
    category: item.category || "Umum",
    excerpt: item.excerpt || "",
    content: item.content || item.excerpt || "",
    cover_image: item.cover_image || "",
    is_published: true,
    is_important: Boolean(item.isImportant),
    published_at: item.isoDate || null,
    created_at: null,
    updated_at: null,
    date: item.date || "-",
    isImportant: Boolean(item.isImportant),
  };
}

function getStaticFallbackItems() {
  return [...staticPengumumanList]
    .map(normalizeStaticItem)
    .sort((a, b) => {
      if (Number(a.is_important) !== Number(b.is_important)) {
        return Number(b.is_important) - Number(a.is_important);
      }

      const aTime = a.published_at ? new Date(a.published_at).getTime() : 0;
      const bTime = b.published_at ? new Date(b.published_at).getTime() : 0;
      return bTime - aTime;
    });
}

function normalizeDbItem(item) {
  return {
    ...item,
    date: formatPengumumanDate(item.published_at || item.created_at),
    isImportant: Boolean(item.is_important),
  };
}

export function normalizePengumumanPayload(input = {}) {
  const title = String(input.title || "").trim();
  const content = String(input.content || "").trim();
  const excerptInput = String(input.excerpt || "").trim();

  return {
    title,
    slug: slugifyPengumuman(String(input.slug || title).trim()),
    category: String(input.category || "Umum").trim() || "Umum",
    excerpt: excerptInput || content.slice(0, 180),
    content,
    cover_image: String(input.cover_image || "").trim() || null,
    is_published: Boolean(input.is_published),
    is_important: Boolean(input.is_important),
    published_at:
      normalizeDateTime(input.published_at) ||
      (Boolean(input.is_published) ? new Date().toISOString() : null),
  };
}

export async function getAllPublishedPengumuman(options = {}) {
  const { limit } = options;

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    let query = supabase
      .from("pengumuman")
      .select(
        "id, title, slug, category, excerpt, content, cover_image, is_published, is_important, published_at, created_at, updated_at"
      )
      .eq("is_published", true)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .order("is_important", { ascending: false })
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const items = (data || []).map(normalizeDbItem);

    if (items.length > 0) {
      return items;
    }

    const fallback = getStaticFallbackItems();
    return typeof limit === "number" ? fallback.slice(0, limit) : fallback;
  } catch {
    const fallback = getStaticFallbackItems();
    return typeof limit === "number" ? fallback.slice(0, limit) : fallback;
  }
}

export async function getFeaturedPengumuman() {
  const items = await getAllPublishedPengumuman();
  return items.find((item) => item.is_important) || items[0] || null;
}

export async function getPengumumanBySlug(slug) {
  if (!slug) return null;

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("pengumuman")
      .select(
        "id, title, slug, category, excerpt, content, cover_image, is_published, is_important, published_at, created_at, updated_at"
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return normalizeDbItem(data);
    }

    return getStaticFallbackItems().find((item) => item.slug === slug) || null;
  } catch {
    return getStaticFallbackItems().find((item) => item.slug === slug) || null;
  }
}