import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl } from "@/lib/cover-image";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

const table = "berita";

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  category,
  content,
  cover_image,
  is_published,
  published_at,
  views,
  author_id,
  created_at,
  updated_at
`;

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function buildPayload(body) {
  const title = cleanString(body?.title);
  const excerpt = cleanString(body?.excerpt);
  const category = cleanString(body?.category) || "Umum";
  const content = cleanString(body?.content);
  const coverImage =
    normalizeCoverImageUrl(cleanString(body?.cover_image)) || null;
  const is_published = Boolean(body?.is_published);
  const publishedAtInput = cleanString(body?.published_at);

  if (!title) throw createHttpError("Judul berita wajib diisi.", 400);
  if (!excerpt) throw createHttpError("Ringkasan berita wajib diisi.", 400);
  if (!content) throw createHttpError("Isi berita wajib diisi.", 400);

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    throw createHttpError("Tanggal publish tidak valid.", 400);
  }

  return {
    title,
    excerpt,
    category,
    content,
    cover_image: coverImage,
    is_published,
    published_at: publishedAt.toISOString(),
  };
}

export async function GET() {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil daftar berita." },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const payload = buildPayload(body);

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body?.slug) || payload.title,
      payload.title,
    );

    const { data, error } = await supabase
      .from(table)
      .insert({
        ...payload,
        slug,
        author_id: auth.session.profile?.id ?? null,
      })
      .select(selectFields)
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    revalidatePath(`/berita/${data.slug}`);

    return NextResponse.json(
      {
        message: "Berita berhasil ditambahkan.",
        item: data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menambahkan berita." },
      { status: error.status || 500 },
    );
  }
}
