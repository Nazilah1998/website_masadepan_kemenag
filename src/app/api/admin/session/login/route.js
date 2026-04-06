import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id, full_name, role, is_active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !adminRow || !adminRow.is_active) {
      await supabase.auth.signOut();

      return NextResponse.json(
        { error: "Akun ini tidak memiliki akses admin." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Login berhasil.",
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: adminRow.full_name,
        role: adminRow.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login." },
      { status: 500 }
    );
  }
}