import AdminLoginClient from "@/components/admin/AdminLoginClient";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const initialUnauthorized = params?.error === "unauthorized";

  return <AdminLoginClient initialUnauthorized={initialUnauthorized} />;
}