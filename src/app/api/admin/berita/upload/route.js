import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function getBucketName() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_BERITA ||
    process.env.SUPABASE_STORAGE_BUCKET_BERITA ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    "berita"
  );
}

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getSafeFileExtension(file) {
  const extensionFromMime = ALLOWED_MIME_TYPES.get(file.type);
  if (extensionFromMime) return extensionFromMime;

  const originalName = typeof file.name === "string" ? file.name : "";
  const fromName = originalName.split(".").pop()?.toLowerCase();
  return fromName || "jpg";
}

function buildStoragePath(file) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension = getSafeFileExtension(file);
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  return `covers/${year}/${month}/${filename}`;
}

function mapUploadError(error, bucketName) {
  const message = error?.message || "Gagal upload cover image.";
  const normalized = String(message).toLowerCase();

  if (
    normalized.includes("bucket") &&
    (normalized.includes("not found") || normalized.includes("does not exist"))
  ) {
    return `Bucket storage "${bucketName}" belum ada. Buat bucket public dengan nama tersebut di Supabase Storage.`;
  }

  return message;
}

async function validateAdmin() {
  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized." }, { status: 401 }),
    };
  }

  if (!session.isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw createHttpError("File cover belum dipilih.", 400);
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw createHttpError(
        "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.",
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createHttpError("Ukuran file maksimal 5 MB.", 400);
    }

    const supabase = createAdminClient();
    const bucketName = getBucketName();
    const storagePath = buildStoragePath(file);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw createHttpError(mapUploadError(uploadError, bucketName), 500);
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl || "";

    if (!publicUrl) {
      throw createHttpError("Upload berhasil, tetapi URL publik gagal dibuat.", 500);
    }

    return NextResponse.json({
      message: "Cover image berhasil diupload.",
      cover_image: publicUrl,
      bucket: bucketName,
      path: storagePath,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal upload cover image." },
      { status: error.status || 500 },
    );
  }
}
