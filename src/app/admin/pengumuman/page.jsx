import { requireAdmin } from "@/lib/auth";
import AdminPengumumanManager from "@/components/admin/AdminPengumumanManager";

export const dynamic = "force-dynamic";

export default async function AdminPengumumanPage() {
  await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" + encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  return <AdminPengumumanManager />;
}