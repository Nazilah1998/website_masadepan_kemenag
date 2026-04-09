import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

const table = "pengumuman";

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  content,
  category,
  is_important,
  is_published,
  published_at,
  author_id,
  attachment_url,
  attachment_name,
  attachment_path,
  attachment_source,
  attachment_type,
  attachment_views,
  created_at,
  updated_at
`;

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

function isGoogleDriveUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    return (
      url.protocol === "https:" &&
      (url.hostname === "drive.google.com" ||
        url.hostname === "docs.google.com")
    );
  } catch {
    return false;
  }
}

async function resolveId(params) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id || !isValidUuid(id)) {
    throw createHttpError("ID pengumuman tidak valid.", 400);
  }

  return id;
}

function normalizeAttachment(body) {
  const attachmentUrl = cleanString(body.attachment_url);

  if (!attachmentUrl) {
    return {
      attachment_url: null,
      attachment_name: null,
      attachment_path: null,
      attachment_source: null,
      attachment_type: null,
    };
  }

  if (!isGoogleDriveUrl(attachmentUrl)) {
    throw createHttpError(
      "Lampiran pengumuman hanya boleh memakai link Google Drive.",
      400,
    );
  }

  return {
    attachment_url: attachmentUrl,
    attachment_name: "Lampiran Pengumuman",
    attachment_path: null,
    attachment_source: "link",
    attachment_type: "link",
  };
}

function buildPayload(body) {
  const title = cleanString(body.title);
  const excerpt = cleanString(body.excerpt);
  const content = cleanString(body.content);
  const category = cleanString(body.category) || "Informasi";
  const isImportant = Boolean(body.is_important);
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);

  if (!title) {
    throw createHttpError("Judul pengumuman wajib diisi.");
  }

  if (!excerpt) {
    throw createHttpError("Ringkasan pengumuman wajib diisi.");
  }

  if (!content) {
    throw createHttpError("Isi pengumuman wajib diisi.");
  }

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    throw createHttpError("Tanggal publish tidak valid.");
  }

  return {
    title,
    excerpt,
    content,
    category,
    is_important: isImportant,
    is_published: isPublished,
    published_at: publishedAt.toISOString(),
    ...normalizeAttachment(body),
  };
}

function revalidatePengumumanPaths(slug) {
  revalidatePath("/");
  revalidatePath("/pengumuman");
  revalidatePath("/admin/pengumuman");

  if (slug) {
    revalidatePath(`/pengumuman/${slug}`);
  }
}

export async function PUT(request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const id = await resolveId(params);
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existingItem, error: existingError } = await supabase
      .from(table)
      .select("id, slug")
      .eq("id", id)
      .single();

    if (existingError) {
      throw existingError;
    }

    const payload = buildPayload(body);

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body.slug),
      payload.title,
      id,
    );

    const { data, error } = await supabase
      .from(table)
      .update({
        ...payload,
        slug,
      })
      .eq("id", id)
      .select(selectFields)
      .single();

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(data?.slug);

    if (existingItem?.slug && existingItem.slug !== data?.slug) {
      revalidatePath(`/pengumuman/${existingItem.slug}`);
    }

    return NextResponse.json({
      message: "Pengumuman berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal memperbarui pengumuman." },
      { status: error.status || 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const id = await resolveId(params);
    const supabase = createAdminClient();

    const { data: currentData, error: fetchError } = await supabase
      .from(table)
      .select("slug")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(currentData?.slug);

    return NextResponse.json({
      message: "Pengumuman berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menghapus pengumuman." },
      { status: error.status || 500 },
    );
  }
}
