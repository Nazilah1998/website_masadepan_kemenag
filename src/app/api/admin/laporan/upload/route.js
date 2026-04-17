import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString } from "@/lib/validation";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const PDF_MIME = "application/pdf";

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

function getSafeFileName(name = "") {
  const safe = String(name)
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safe || "dokumen"}.pdf`;
}

function normalizeYear(value) {
  const year = Number(String(value || "").trim());
  if (!year) return null;
  if (year < 2000 || year > 2100) throw new Error("Tahun dokumen tidak valid.");
  return year;
}

function revalidateLaporanPaths(slug) {
  revalidatePath("/admin");
  revalidatePath("/admin/laporan");
  revalidatePath("/laporan");
  if (slug) {
    revalidatePath(`/admin/laporan/${slug}`);
    revalidatePath(`/laporan/${slug}`);
  }
}

async function resolveCategory(supabase, categoryId, categorySlug) {
  // Hanya query by id jika format UUID valid
  // Mencegah error "invalid input syntax for type uuid"
  if (categoryId && isValidUuid(categoryId)) {
    const byId = await supabase
      .from("report_categories")
      .select("id, slug, title")
      .eq("id", categoryId)
      .maybeSingle();

    if (byId.error) throw byId.error;
    if (byId.data) return byId.data;
  }

  // Fallback: cari by slug
  const slugToTry = categorySlug || categoryId;

  if (slugToTry) {
    const bySlug = await supabase
      .from("report_categories")
      .select("id, slug, title")
      .eq("slug", slugToTry)
      .maybeSingle();

    if (bySlug.error) throw bySlug.error;
    if (bySlug.data) return bySlug.data;
  }

  return null;
}

export async function POST(request) {
  const session = await requireAdmin({ requireMfa: true });

  try {
    const formData = await request.formData();
    const supabase = createAdminClient();

    const file = formData.get("file");
    const categoryId = cleanString(formData.get("categoryId"), 120);
    const categorySlug = cleanString(formData.get("categorySlug"), 160);
    const title = cleanString(formData.get("title"), 180);
    const description = cleanString(formData.get("description"), 1000);
    const year = normalizeYear(formData.get("year"));
    const isPublished = String(formData.get("is_published")) === "true";

    if (!categoryId && !categorySlug) {
      return noStoreJson({ message: "Kategori laporan wajib dipilih." }, 400);
    }

    if (!title) {
      return noStoreJson({ message: "Judul dokumen wajib diisi." }, 400);
    }

    if (!file || typeof file === "string") {
      return noStoreJson({ message: "File PDF wajib dipilih." }, 400);
    }

    if (Number(file.size || 0) > MAX_FILE_SIZE) {
      return noStoreJson({ message: "Ukuran file melebihi 10 MB." }, 400);
    }

    const isPdf =
      file.type === PDF_MIME || /\.pdf$/i.test(String(file.name || ""));

    if (!isPdf) {
      return noStoreJson({ message: "Hanya file PDF yang diizinkan." }, 400);
    }

    // Resolve kategori: coba UUID dulu, fallback ke slug
    const category = await resolveCategory(supabase, categoryId, categorySlug);

    if (!category) {
      return noStoreJson(
        {
          message:
            "Kategori laporan tidak ditemukan. Pastikan seed data 7 kategori sudah dijalankan di Supabase.",
        },
        404,
      );
    }

    const safeName = getSafeFileName(file.name || "dokumen.pdf");
    const filePath = `laporan/${category.slug}/${Date.now()}-${safeName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await supabase.storage
      .from("laporan-documents")
      .upload(filePath, buffer, {
        contentType: PDF_MIME,
        upsert: false,
      });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("laporan-documents")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData?.publicUrl || null;

    const insertResult = await supabase
      .from("report_documents")
      .insert({
        category_id: category.id,
        title,
        description,
        year,
        file_name: file.name,
        file_path: filePath,
        file_url: fileUrl,
        mime_type: PDF_MIME,
        file_size: Number(file.size || 0),
        is_published: isPublished,
        created_by: session?.profile?.id || null,
      })
      .select("id, title")
      .single();

    if (insertResult.error) {
      // Rollback file dari storage jika insert database gagal
      await supabase.storage.from("laporan-documents").remove([filePath]);
      throw insertResult.error;
    }

    revalidateLaporanPaths(category.slug);

    return noStoreJson({
      message: `Dokumen berhasil diupload ke kategori ${category.title}.`,
      document: insertResult.data,
      category,
    });
  } catch (error) {
    return noStoreJson(
      { message: error?.message || "Gagal mengupload dokumen laporan." },
      500,
    );
  }
}
