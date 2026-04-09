import AdminMfaClient from "@/components/admin/AdminMfaClient";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminMfaPage() {
    await requireAdmin({
        loginRedirect: "/admin/login",
        requireMfa: false,
    });

    return <AdminMfaClient />;
}