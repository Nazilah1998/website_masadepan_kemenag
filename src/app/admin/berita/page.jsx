import { requireAdmin } from "@/lib/auth";
import AdminBeritaManager from "@/components/admin/AdminBeritaManager";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  return <AdminBeritaManager />;
}