import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString } from "@/lib/validation";

export const dynamic = "force-dynamic";

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function revalidateLaporanPaths(slug) {
  revalidatePath("/admin");
  revalidatePath("/admin/laporan");
  revalidatePath("/laporan");
  if (slug) {
    revalidatePath(`/laporan/${slug}`);
  }
}

export async function GET() {
  await requireAdmin({ requireMfa: true });

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
            sort_order,
            is_published,
            created_at,
            updated_at
          )
        `,
      )
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      throw error;
    }

    const normalized = (data || []).map((item) => ({
      ...item,
      documents: Array.isArray(item.documents)
        ? [...item.documents].sort(
            (a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0),
          )
        : [],
    }));

    return noStoreJson({ categories: normalized });
  } catch (error) {
    return noStoreJson(
      {
        message: error?.message || "Gagal memuat kategori laporan.",
      },
      500,
    );
  }
}

export async function POST(request) {
  await requireAdmin({ requireMfa: true });

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    if (body?.action !== "update-category") {
      return noStoreJson({ message: "Aksi tidak dikenali." }, 400);
    }

    const categoryId = cleanString(body?.categoryId, 120);
    if (!categoryId) {
      return noStoreJson({ message: "Kategori laporan tidak valid." }, 400);
    }

    const payload = {
      title: cleanString(body?.title, 180),
      description: cleanString(body?.description, 500),
      intro: cleanString(body?.intro, 5000),
      sort_order: Number(body?.sort_order || 0),
      is_active: Boolean(body?.is_active),
      updated_at: new Date().toISOString(),
    };

    if (!payload.title) {
      return noStoreJson({ message: "Judul submenu wajib diisi." }, 400);
    }

    const { data, error } = await supabase
      .from("report_categories")
      .update(payload)
      .eq("id", categoryId)
      .select("slug")
      .single();

    if (error) {
      throw error;
    }

    revalidateLaporanPaths(data?.slug);

    return noStoreJson({
      message: "Isi halaman laporan berhasil diperbarui.",
    });
  } catch (error) {
    return noStoreJson(
      {
        message: error?.message || "Gagal menyimpan kategori laporan.",
      },
      500,
    );
  }
}
