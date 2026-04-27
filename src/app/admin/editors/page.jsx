import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import EditorsManagementClient from "@/components/features/admin/EditorsManagementClient";

export const dynamic = "force-dynamic";

async function getEditors() {
    const supabase = createAdminClient();

    const { data: requests, error: requestError } = await supabase
        .from("editor_requests")
        .select(`
      user_id,
      full_name,
      email,
      unit_name,
      status,
      requested_at,
      reviewed_at,
      reviewed_by,
      review_notes,
      profiles:user_id (
        id,
        role,
        is_active
      )
    `)
        .order("requested_at", { ascending: false });

    if (requestError) {
        throw new Error(`Gagal memuat editor_requests: ${requestError.message}`);
    }

    if (!requests?.length) {
        return [];
    }

    const userIds = requests.map((item) => item.user_id).filter(Boolean);

    const { data: permissionRows, error: permissionError } = await supabase
        .from("user_permissions")
        .select("user_id, permission")
        .in("user_id", userIds);

    if (permissionError) {
        throw new Error(
            `Gagal memuat user_permissions: ${permissionError.message}`,
        );
    }

    const permissionMap = new Map();

    for (const row of permissionRows || []) {
        const current = permissionMap.get(row.user_id) || [];
        current.push(row.permission);
        permissionMap.set(row.user_id, current);
    }

    return requests.map((item) => ({
        user_id: item.user_id,
        full_name: item.full_name,
        email: item.email,
        unit_name: item.unit_name || "-",
        status: item.status,
        requested_at: item.requested_at,
        reviewed_at: item.reviewed_at,
        reviewed_by: item.reviewed_by,
        review_notes: item.review_notes,
        role:
            item.status === "approved"
                ? item.profiles?.role || "editor"
                : "editor",
        is_active: Boolean(item.profiles?.is_active),
        permissions: permissionMap.get(item.user_id) || [],
    }));
}

export default async function AdminEditorsPage() {
    const session = await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    if (session.role !== "super_admin") {
        redirect(
            "/error?message=" +
            encodeURIComponent("Hanya super admin yang dapat mengakses manajemen editor."),
        );
    }

    const editors = await getEditors();

    return <EditorsManagementClient initialEditors={editors} />;
}