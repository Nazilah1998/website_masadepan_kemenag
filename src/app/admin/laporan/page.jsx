// src/app/admin/laporan/page.jsx
import AdminLaporanPageClient from "@/components/features/admin/AdminLaporanPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Manajemen Dokumen Pelaporan",
};

export default function AdminLaporanPage() {
    return <AdminLaporanPageClient />;
}