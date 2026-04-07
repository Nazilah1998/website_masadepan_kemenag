import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import { createClient } from "@/lib/supabase/server";
export const metadata = {
  title: "Pengumuman | Kemenag Barito Utara",
  description: "Informasi resmi dan pengumuman penting instansi",
};
function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}
export default async function PengumumanPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("pengumuman")
    .select(
      ` id, slug, title, excerpt, content, category, is_important, is_published, published_at, attachment_url, attachment_name, attachment_type, created_at `,
    )
    .eq("is_published", true)
    .order("is_important", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message || "Gagal memuat halaman pengumuman.");
  }
  return (
    <>
      {" "}
      <PageBanner
        title="Pengumuman"
        description="Informasi resmi, pemberitahuan penting, dan lampiran layanan."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pengumuman" }]}
      />{" "}
      <section className="bg-white py-14">
        {" "}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {" "}
          {!items || items.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
              {" "}
              <h2 className="text-xl font-bold text-slate-900">
                {" "}
                Belum ada pengumuman{" "}
              </h2>{" "}
              <p className="mt-2 text-slate-600">
                {" "}
                Pengumuman akan tampil di sini setelah dipublikasikan dari panel
                admin.{" "}
              </p>{" "}
            </div>
          ) : (
            <div className="grid gap-6">
              {" "}
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {" "}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    {" "}
                    <span
                      className={`rounded-full px-3 py-1 font-semibold ${item.is_important ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}
                    >
                      {" "}
                      {item.is_important
                        ? "Penting"
                        : item.category || "Informasi"}{" "}
                    </span>{" "}
                    <span>
                      {formatDate(item.published_at || item.created_at)}
                    </span>{" "}
                    {item.attachment_url ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                        {" "}
                        {item.attachment_type === "image"
                          ? "Ada Gambar"
                          : item.attachment_type === "pdf"
                            ? "Ada PDF"
                            : "Ada Lampiran"}{" "}
                      </span>
                    ) : null}{" "}
                  </div>{" "}
                  <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    {" "}
                    {item.title}{" "}
                  </h2>{" "}
                  <p className="mt-3 text-slate-600"> {item.excerpt} </p>{" "}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {" "}
                    <Link
                      href={`/pengumuman/${item.slug}`}
                      className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      {" "}
                      Baca detail{" "}
                    </Link>{" "}
                    {item.attachment_url ? (
                      <a
                        href={item.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {" "}
                        Buka lampiran{" "}
                      </a>
                    ) : null}{" "}
                  </div>{" "}
                </article>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
