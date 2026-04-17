import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString } from "@/lib/validation";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function getSafeFileName(name = "") {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateLaporanPaths(slug) {
  revalidatePath("/admin");
  revalidatePath("/admin/laporan");
  revalidatePath("/laporan");
  if (slug) {
    revalidatePath(`/laporan/${slug}`);
  }
}

export async function POST(request) {
  const session = await requireAdmin({ requireMfa: true });

  try {
    const formData = await request.formData();
    const supabase = createAdminClient();

    const file = formData.get("file");
    const categoryId = cleanString(formData.get("categoryId"), 120);
    const title = cleanString(formData.get("title"), 180);
    const description = cleanString(formData.get("description"), 1000);
    const yearValue = cleanString(formData.get("year"), 4);
    const sortOrder = Number(formData.get("sort_order") || 0);
    const isPublished = String(formData.get("is_published")) === "true";

    if (!categoryId) {
      return noStoreJson({ message: "Kategori laporan wajib dipilih." }, 400);
    }

    if (!title) {
      return noStoreJson({ message: "Judul dokumen wajib diisi." }, 400);
    }

    if (!file || typeof file === "string") {
      return noStoreJson({ message: "File dokumen wajib dipilih." }, 400);
    }

    if (Number(file.size || 0) > MAX_FILE_SIZE) {
      return noStoreJson({ message: "Ukuran file melebihi 10 MB." }, 400);
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return noStoreJson({ message: "Format file tidak didukung." }, 400);
    }

    const { data: category, error: categoryError } = await supabase
      .from("report_categories")
      .select("id, slug")
      .eq("id", categoryId)
      .single();

    if (categoryError || !category) {
      return noStoreJson({ message: "Kategori laporan tidak ditemukan." }, 404);
    }

    const extSafeName = getSafeFileName(file.name || "dokumen");
    const filePath = `laporan/${category.slug}/${Date.now()}-${extSafeName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await supabase.storage
      .from("laporan-documents")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const publicUrlResult = supabase.storage
      .from("laporan-documents")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlResult?.data?.publicUrl || null;

    const { error: insertError } = await supabase
      .from("report_documents")
      .insert({
        category_id: category.id,
        title,
        description,
        year: yearValue ? Number(yearValue) : null,
        file_name: file.name,
        file_path: filePath,
        file_url: fileUrl,
        mime_type: file.type || null,
        file_size: Number(file.size || 0),
        sort_order: sortOrder,
        is_published: isPublished,
        created_by: session?.profile?.id || null,
      });

    if (insertError) {
      throw insertError;
    }

    revalidateLaporanPaths(category.slug);

    return noStoreJson({
      message: "Dokumen berhasil diupload dan disimpan.",
    });
  } catch (error) {
    return noStoreJson(
      {
        message: error?.message || "Gagal mengupload dokumen laporan.",
      },
      500,
    );
  }
}
