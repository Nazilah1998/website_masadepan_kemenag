import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}
export default async function AnnouncementsSection() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("pengumuman")
    .select(
      ` id, slug, title, excerpt, content, category, is_important, is_published, published_at, attachment_url, attachment_name, attachment_type, created_at `,
    )
    .eq("is_published", true)
    .order("is_important", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) {
    throw new Error(error.message || "Gagal memuat pengumuman beranda.");
  }
  if (!items || items.length === 0) {
    return null;
  }
  const featuredAnnouncement =
    items.find((item) => item.is_important) || items[0];
  const otherAnnouncements = items
    .filter((item) => item.slug !== featuredAnnouncement.slug)
    .slice(0, 3);
  return (
    <section className="bg-white py-16">
      {" "}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {" "}
              Pengumuman{" "}
            </p>{" "}
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {" "}
              Informasi Resmi dan Pemberitahuan Penting{" "}
            </h2>{" "}
            <p className="mt-3 max-w-2xl text-slate-600">
              {" "}
              Sampaikan informasi resmi, perubahan layanan, agenda penting, dan
              pemberitahuan lainnya secara terpisah dari berita kegiatan.{" "}
            </p>{" "}
          </div>{" "}
          <Link
            href="/pengumuman"
            className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {" "}
            Lihat Semua Pengumuman{" "}
          </Link>{" "}
        </div>{" "}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {" "}
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            {" "}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {" "}
              <span
                className={`rounded-full px-3 py-1 font-semibold ${featuredAnnouncement.is_important ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}
              >
                {" "}
                {featuredAnnouncement.is_important
                  ? "Pengumuman Utama"
                  : featuredAnnouncement.category || "Informasi"}{" "}
              </span>{" "}
              <span>
                {" "}
                {formatDate(
                  featuredAnnouncement.published_at ||
                    featuredAnnouncement.created_at,
                )}{" "}
              </span>{" "}
              {featuredAnnouncement.attachment_url ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                  {" "}
                  {featuredAnnouncement.attachment_type === "image"
                    ? "Ada Gambar"
                    : featuredAnnouncement.attachment_type === "pdf"
                      ? "Ada PDF"
                      : "Ada Lampiran"}{" "}
                </span>
              ) : null}{" "}
            </div>{" "}
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              {" "}
              {featuredAnnouncement.title}{" "}
            </h3>{" "}
            <p className="mt-3 text-slate-600">
              {" "}
              {featuredAnnouncement.excerpt}{" "}
            </p>{" "}
            <div className="mt-6 flex flex-wrap gap-3">
              {" "}
              <Link
                href={`/pengumuman/${featuredAnnouncement.slug}`}
                className="inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {" "}
                Buka Pengumuman{" "}
              </Link>{" "}
              {featuredAnnouncement.attachment_url ? (
                <a
                  href={featuredAnnouncement.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {" "}
                  Buka Lampiran{" "}
                </a>
              ) : null}{" "}
            </div>{" "}
          </article>{" "}
          <div className="space-y-4">
            {" "}
            {otherAnnouncements.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {" "}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {" "}
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    {" "}
                    {item.category || "Informasi"}{" "}
                  </span>{" "}
                  <span>
                    {formatDate(item.published_at || item.created_at)}
                  </span>{" "}
                  {item.attachment_url ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      {" "}
                      {item.attachment_type === "image"
                        ? "Gambar"
                        : item.attachment_type === "pdf"
                          ? "PDF"
                          : "Lampiran"}{" "}
                    </span>
                  ) : null}{" "}
                </div>{" "}
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {" "}
                  {item.title}{" "}
                </h3>{" "}
                <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>{" "}
                <div className="mt-4 flex flex-wrap gap-3">
                  {" "}
                  <Link
                    href={`/pengumuman/${item.slug}`}
                    className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {" "}
                    Baca selengkapnya{" "}
                  </Link>{" "}
                  {item.attachment_url ? (
                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                      {" "}
                      Buka lampiran{" "}
                    </a>
                  ) : null}{" "}
                </div>{" "}
              </article>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
