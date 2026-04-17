import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString } from "@/lib/validation";

export const dynamic = "force-dynamic";

function noStoreJson(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function revalidateLaporanPaths(slug) {
  revalidatePath("/admin/laporan");
  if (slug) {
    revalidatePath(`/admin/laporan/${slug}`);
    revalidatePath(`/laporan/${slug}`);
  }
  revalidatePath("/laporan");
}

async function getSafeId(paramsPromise) {
  const params = await paramsPromise;
  const id = cleanString(params?.id, 120);

  if (!id) {
    throw new Error("ID dokumen tidak valid.");
  }

  return id;
}

export async function PUT(request, context) {
  await requireAdmin({ requireMfa: true });

  try {
    const id = await getSafeId(context.params);
    const body = await request.json();
    const supabase = createAdminClient();

    const payload = {
      title: cleanString(body?.title, 180),
      description: cleanString(body?.description, 1000),
      year: body?.year ? Number(body.year) : null,
      is_published: Boolean(body?.is_published),
      updated_at: new Date().toISOString(),
    };

    if (!payload.title) {
      return noStoreJson({ message: "Judul dokumen wajib diisi." }, 400);
    }

    const { data, error } = await supabase
      .from("report_documents")
      .update(payload)
      .eq("id", id)
      .select("id, category:report_categories(slug)")
      .single();

    if (error) throw error;

    const slug = data?.category?.slug || null;
    revalidateLaporanPaths(slug);

    return noStoreJson({ message: "Dokumen berhasil diperbarui." });
  } catch (error) {
    return noStoreJson(
      { message: error?.message || "Gagal memperbarui dokumen." },
      500,
    );
  }
}

export async function DELETE(_request, context) {
  await requireAdmin({ requireMfa: true });

  try {
    const id = await getSafeId(context.params);
    const supabase = createAdminClient();

    const { data: doc, error: fetchError } = await supabase
      .from("report_documents")
      .select("id, file_path, category:report_categories(slug)")
      .eq("id", id)
      .single();

    if (fetchError || !doc) {
      return noStoreJson({ message: "Dokumen tidak ditemukan." }, 404);
    }

    if (doc.file_path) {
      const removeStorage = await supabase.storage
        .from("laporan-documents")
        .remove([doc.file_path]);

      if (removeStorage.error) throw removeStorage.error;
    }

    const { error } = await supabase
      .from("report_documents")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidateLaporanPaths(doc?.category?.slug || null);

    return noStoreJson({ message: "Dokumen berhasil dihapus." });
  } catch (error) {
    return noStoreJson(
      { message: error?.message || "Gagal menghapus dokumen." },
      500,
    );
  }
}
