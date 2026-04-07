import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, assertServiceRoleKey } from "@/lib/env";

let adminClient;

export function createAdminClient() {
  if (!adminClient) {
    adminClient = createSupabaseClient(
      env.supabaseUrl,
      assertServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return adminClient;
}