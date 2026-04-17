import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function noStore(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();

    if (!id) {
      return noStore({ message: "ID dokumen tidak valid." }, 400);
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("increment_document_views", {
      target_id: id,
    });

    if (error) throw error;

    return noStore({ views: Number(data || 0) });
  } catch (error) {
    return noStore(
      { message: error?.message || "Gagal mencatat pembaca." },
      500,
    );
  }
}
