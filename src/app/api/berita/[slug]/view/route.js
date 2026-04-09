import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(_request, context) {
  try {
    const { slug } = await context.params;
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("increment_berita_views", {
      target_slug: slug,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      views: Number(data || 0),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menambah jumlah pembaca." },
      { status: 500 }
    );
  }
}