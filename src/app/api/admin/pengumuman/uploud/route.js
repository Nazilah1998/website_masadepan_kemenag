import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const BUCKET = "pengumuman-files";
function getAttachmentType(file) {
  if (!file?.type) return "other";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "other";
}
export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) {
    return auth.response;
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File tidak ditemukan." },
        { status: 400 },
      );
    }
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "File harus berupa gambar atau PDF." },
        { status: 400 },
      );
    }
    const supabase = createAdminClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: file.type, upsert: false });
    if (uploadError) {
      throw uploadError;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return NextResponse.json({
      message: "File berhasil diupload.",
      item: {
        attachment_url: data.publicUrl,
        attachment_name: file.name,
        attachment_path: filePath,
        attachment_source: "upload",
        attachment_type: getAttachmentType(file),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal upload file." },
      { status: 500 },
    );
  }
}
