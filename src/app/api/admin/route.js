import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSessionContext();

    if (!session.isAuthenticated) {
      return NextResponse.json(
        {
          ok: false,
          message: "Belum login.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: session.claims?.sub ?? null,
        email: session.profile?.email || null,
        full_name: session.profile?.full_name || null,
        role: session.role ?? null,
      },
      permissions: {
        isAdmin: session.isAdmin,
        isEditor: session.isEditor,
      },
      mfa: {
        currentLevel: session.aal ?? null,
        nextLevel: session.nextAal ?? null,
        isVerified: session.isMfaVerified ?? false,
        errorMessage: session.mfaErrorMessage ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Gagal membaca session admin.",
      },
      { status: 500 },
    );
  }
}
