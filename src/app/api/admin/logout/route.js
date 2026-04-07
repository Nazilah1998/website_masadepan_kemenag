import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true, message: "Logout berhasil." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Gagal logout." },
      { status: 500 },
    );
  }
}
