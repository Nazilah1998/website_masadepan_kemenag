import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const EDITOR_ROLES = new Set(["admin", "super_admin", "editor"]);

function normalizeRole(role) {
  if (!role || typeof role !== "string") return null;
  return role.trim().toLowerCase();
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // aman untuk context yang tidak mengizinkan set cookie
        }
      },
    },
  });
}

export async function getCurrentSessionContext() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return {
      isAuthenticated: false,
      claims: null,
      user: null,
      profile: null,
      role: null,
      isAdmin: false,
      isEditor: false,
    };
  }

  let profile = null;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  // abaikan "tidak ada row", tapi lempar error lain
  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  profile = profileData ?? {
    id: user.id,
    email: user.email ?? null,
    full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    role: user.app_metadata?.role ?? user.user_metadata?.role ?? null,
  };

  const role = normalizeRole(profile?.role);

  return {
    isAuthenticated: true,
    claims: {
      sub: user.id,
      email: user.email ?? null,
    },
    user,
    profile,
    role,
    isAdmin: ADMIN_ROLES.has(role),
    isEditor: EDITOR_ROLES.has(role),
  };
}

export async function requireAdmin(options = {}) {
  const {
    loginRedirect = "/admin/login",
    forbiddenRedirect =
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  } = options;

  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(loginRedirect);
  }

  if (!session.isAdmin) {
    redirect(forbiddenRedirect);
  }

  return session;
}