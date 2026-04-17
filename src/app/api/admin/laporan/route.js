import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminLaporanCategories } from "@/lib/laporan";

export const dynamic = "force-dynamic";

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET(request) {
  await requireAdmin({ requireMfa: true });

  try {
    const { searchParams } = new URL(request.url);
    const slug = String(searchParams.get("slug") || "").trim();

    const categories = await getAdminLaporanCategories(slug);

    return noStoreJson({
      categories,
    });
  } catch (error) {
    return noStoreJson(
      { message: error?.message || "Gagal memuat kategori laporan." },
      500,
    );
  }
}
