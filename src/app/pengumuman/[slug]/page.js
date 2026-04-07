import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "../../../components/PageBanner";
import { createClient } from "@/lib/supabase/server";
function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("pengumuman")
    .select("title, excerpt, slug, is_published")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!item) {
    return {
      title: "Pengumuman tidak ditemukan | Kemenag Barito Utara",
      description: "Data pengumuman tidak ditemukan.",
    };
  }
  return {
    title: `${item.title} | Pengumuman`,
    description: item.excerpt || "Detail pengumuman resmi",
  };
}
export default async function DetailPengumumanPage({ params }) {
  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("pengumuman")
    .select(
      ` id, slug, title, excerpt, content, category, is_important, is_published, published_at, attachment_url, attachment_name, attachment_type, created_at `,
    )
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    throw new Error(error.message || "Gagal memuat detail pengumuman.");
  }
  if (!item) {
    notFound();
  }
  const paragraphs = String(item.content || "")
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);
  return (
    <>
      {" "}
      <PageBanner
        title="Detail Pengumuman"
        description="Informasi resmi dan pemberitahuan penting."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Pengumuman", href: "/pengumuman" },
          { label: item.title },
        ]}
      />{" "}
      <section className="bg-white py-14">
        {" "}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {" "}
          <Link
            href="/pengumuman"
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {" "}
            ← Kembali ke halaman pengumuman{" "}
          </Link>{" "}
          <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {" "}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {" "}
              <span
                className={`rounded-full px-3 py-1 font-semibold ${item.is_important ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}
              >
                {" "}
                {item.is_important
                  ? "Pengumuman Penting"
                  : item.category || "Informasi"}{" "}
              </span>{" "}
              <span>
                {formatDate(item.published_at || item.created_at)}
              </span>{" "}
            </div>{" "}
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900">
              {" "}
              {item.title}{" "}
            </h1>{" "}
            {item.excerpt ? (
              <p className="mt-4 text-lg text-slate-600"> {item.excerpt} </p>
            ) : null}{" "}
            <div className="prose prose-slate mt-8 max-w-none">
              {" "}
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Tidak ada isi detail pengumuman.</p>
              )}{" "}
            </div>{" "}
            {item.attachment_url ? (
              <div className="mt-10 border-t border-slate-200 pt-6">
                {" "}
                <h2 className="text-xl font-bold text-slate-900">
                  Lampiran
                </h2>{" "}
                {item.attachment_type === "image" ? (
                  <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}{" "}
                    <img
                      src={item.attachment_url}
                      alt={item.attachment_name || item.title}
                      className="h-auto w-full object-cover"
                    />{" "}
                  </div>
                ) : null}{" "}
                <div className="mt-4 flex flex-wrap gap-3">
                  {" "}
                  <a
                    href={item.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {" "}
                    {item.attachment_type === "pdf"
                      ? "Buka PDF"
                      : item.attachment_type === "image"
                        ? "Buka Gambar"
                        : "Buka Link Lampiran"}{" "}
                  </a>{" "}
                  {item.attachment_name ? (
                    <span className="inline-flex items-center rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
                      {" "}
                      {item.attachment_name}{" "}
                    </span>
                  ) : null}{" "}
                </div>{" "}
              </div>
            ) : null}{" "}
          </article>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
