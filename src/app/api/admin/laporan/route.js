import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
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

    if (error) throw error;

    const normalized = (data || []).map((item) => ({
      ...item,
      documents: Array.isArray(item.documents)
        ? [...item.documents].sort((a, b) => {
            const yearA = Number(a?.year || 0);
            const yearB = Number(b?.year || 0);
            if (yearA !== yearB) return yearB - yearA;
            return String(a?.title || "").localeCompare(
              String(b?.title || ""),
              "id",
            );
          })
        : [],
    }));

    return noStoreJson({ categories: normalized });
  } catch (error) {
    return noStoreJson(
      { message: error?.message || "Gagal memuat kategori laporan." },
      500,
    );
  }
}
