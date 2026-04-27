import AdminLoginClient from "@/components/features/admin/AdminLoginClient";

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/admin");
}