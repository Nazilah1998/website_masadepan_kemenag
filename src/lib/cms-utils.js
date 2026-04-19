import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import {
  getUserPermissionContext,
  hasUserPermission,
} from "@/lib/user-permissions";

export function cleanString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ensureUniqueSlug(
  supabase,
  table,
  rawSlug,
  fallbackTitle,
  currentId = null,
) {
  const baseSlug =
    slugify(rawSlug) || slugify(fallbackTitle) || `${table}-${Date.now()}`;

  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from(table).select("id").eq("slug", candidate);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function validateAdmin(options = {}) {
  const { requireMfa = true, permission = null, allowEditor = true } = options;

  const session = await getCurrentSessionContext();

  if (!session?.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: "Unauthorized.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 },
      ),
    };
  }

  // Pastikan ada role yang valid
  const role = session?.role || null;
  const isEditor = session?.isEditor === true;
  const isAdmin = session?.isAdmin === true;
  const isSuperAdmin = role === "super_admin";

  // Admin atau super_admin selalu boleh masuk
  if (isAdmin || isSuperAdmin) {
    // Wajib MFA untuk admin/super_admin
    if (requireMfa && !session?.isMfaVerified) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            message:
              "MFA admin wajib diselesaikan sebelum mengakses endpoint ini.",
            code: "MFA_REQUIRED",
            mfa: {
              currentLevel: session?.aal ?? null,
              nextLevel: session?.nextAal ?? null,
              isVerified: false,
            },
          },
          { status: 403 },
        ),
      };
    }

    // Cek permission role admin
    if (permission && !hasPermission(role, permission)) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            message: "Anda tidak memiliki izin untuk tindakan ini.",
            code: "PERMISSION_DENIED",
            required: permission,
          },
          { status: 403 },
        ),
      };
    }

    return {
      ok: true,
      session,
      permissionContext: {
        isSuperAdmin,
        isAdmin,
        isEditor: isEditor || isAdmin || isSuperAdmin,
        approved: true,
        isActive: true,
      },
    };
  }

  // Editor
  if (isEditor && allowEditor) {
    const userId = session?.profile?.id || session?.user?.id || null;
    const email = session?.profile?.email || session?.user?.email || null;

    const permissionContext = await getUserPermissionContext({
      userId,
      role,
      email,
    });

    // Editor belum disetujui
    if (!permissionContext.approved || !permissionContext.isActive) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            message: "Akun editor belum aktif atau belum disetujui.",
            code: "EDITOR_INACTIVE",
          },
          { status: 403 },
        ),
      };
    }

    // Cek permission granular via user_permissions
    if (permission && !hasUserPermission(permissionContext, permission)) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            message: "Anda tidak memiliki izin untuk tindakan ini.",
            code: "PERMISSION_DENIED",
            required: permission,
          },
          { status: 403 },
        ),
      };
    }

    return {
      ok: true,
      session,
      permissionContext,
    };
  }

  // Tidak ada akses sama sekali
  return {
    ok: false,
    response: NextResponse.json(
      {
        message: "Forbidden.",
        code: "ADMIN_REQUIRED",
      },
      { status: 403 },
    ),
  };
}
