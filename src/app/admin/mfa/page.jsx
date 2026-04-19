import AdminMfaClient from "@/components/admin/AdminMfaClient";
import { getCurrentSessionContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminMfaPage() {
    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
        redirect("/admin/login");
    }

    const hasAdminPanelAccess = session?.isAdmin || session?.isEditor;

    if (!hasAdminPanelAccess) {
        redirect(
            "/error?message=" +
            encodeURIComponent("Anda tidak memiliki akses ke panel admin."),
        );
    }

    return <AdminMfaClient />;
}