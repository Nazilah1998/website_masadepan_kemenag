import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl } from "@/lib/cover-image";
import { validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function cleanString(value = "") {
  return String(value || "").trim();
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const beritaId = cleanString(body?.berita_id);
    const title = cleanString(body?.title);
    const slug = cleanString(body?.slug);
    const imageUrl = normalizeCoverImageUrl(cleanString(body?.image_url));
    const linkUrl = cleanString(body?.link_url) || `/berita/${slug}`;

    if (!beritaId) throw createHttpError("ID berita wajib ada.", 400);
    if (!title) throw createHttpError("Judul berita wajib ada.", 400);
    if (!slug) throw createHttpError("Slug berita wajib ada.", 400);
    if (!imageUrl) throw createHttpError("Cover portrait wajib diisi.", 400);

    const publishedAtInput = cleanString(body?.published_at);
    const publishedAt = publishedAtInput
      ? new Date(publishedAtInput)
      : new Date();

    if (Number.isNaN(publishedAt.getTime())) {
      throw createHttpError("Tanggal publish galeri tidak valid.", 400);
    }

    const { data: existingItem, error: existingError } = await supabase
      .from("galeri")
      .select("id")
      .eq("source_type", "berita")
      .eq("source_id", beritaId)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("galeri")
        .update({
          title,
          image_url: imageUrl,
          link_url: linkUrl,
          is_published: true,
          published_at: publishedAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (updateError) throw updateError;

      revalidatePath("/galeri");
      revalidatePath("/admin/berita");

      return NextResponse.json({
        message: "Item galeri berhasil diperbarui.",
        mode: "updated",
        gallery_id: existingItem.id,
      });
    }

    const { data: insertedItem, error: insertError } = await supabase
      .from("galeri")
      .insert({
        title,
        image_url: imageUrl,
        link_url: linkUrl,
        source_type: "berita",
        source_id: beritaId,
        is_published: true,
        published_at: publishedAt.toISOString(),
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    revalidatePath("/galeri");
    revalidatePath("/admin/berita");

    return NextResponse.json({
      message: "Berita berhasil dikirim ke galeri.",
      mode: "created",
      gallery_id: insertedItem?.id ?? null,
    });
  } catch (error) {
    console.error("API /api/admin/galeri/from-berita error:", error);

    return NextResponse.json(
      { message: error.message || "Gagal mengirim berita ke galeri." },
      { status: error.status || 500 },
    );
  }
}
