import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = createAdminClient();

    // lanjutkan logic upload Anda yang sekarang:
    // - request.formData()
    // - validasi file
    // - supabase.storage.from(BUCKET).upload(...)
    // - return attachment_url, attachment_path, attachment_type, dst.
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal mengunggah lampiran pengumuman.",
      },
      { status: 500 },
    );
  }
}
