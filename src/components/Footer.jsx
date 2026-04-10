import Image from "next/image";
import Link from "next/link";
import { siteInfo, siteLinks } from "@/data/site";

const mainMenu = [
  { label: "Beranda", href: "/" },
  { label: "Profil Instansi", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Kontak", href: "/kontak" },
];

const publicInfoMenu = [
  { label: "Berita", href: "/berita" },
  { label: "Pengumuman", href: "/pengumuman" },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-emerald-300"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70 transition group-hover:bg-emerald-300" />
      <span>{children}</span>
    </Link>
  );
}

function FooterInfoItem({ label, value, href }) {
  const renderValue = Array.isArray(value) ? (
    <div className="mt-1 space-y-1">
      {value.map((item, index) => (
        <p key={index} className="text-sm leading-6 text-slate-200">
          {item}
        </p>
      ))}
    </div>
  ) : (
    <p className="mt-1 text-sm leading-6 text-slate-200">{value}</p>
  );

  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      {renderValue}
    </>
  );

  if (href) {
    return (
      <a href={href} className="block transition hover:opacity-90">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_24%),linear-gradient(to_bottom,#020617,#020817,#0f172a)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.08]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-white/5 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur">
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div>
                <p className="text-lg font-extrabold tracking-[0.02em] text-white">
                  {siteInfo.shortName}
                </p>
                <p className="mt-1 text-sm text-slate-400">{siteInfo.tagline}</p>
              </div>
            </div>

            <div className="mt-6">
              <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Portal Resmi Informasi dan Layanan
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Website resmi Kantor Kementerian Agama Kabupaten Barito Utara
              sebagai media informasi publik, publikasi kelembagaan, dan akses
              layanan yang lebih rapi, modern, dan mudah digunakan.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/kontak"
                className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Hubungi Kami
              </Link>

              <Link
                href="/profil"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/20 hover:text-emerald-300"
              >
                Lihat Profil
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Menu Utama
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {mainMenu.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Informasi Publik
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {publicInfoMenu.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Catatan
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Agenda, Galeri, dan Dokumen Publik sedang dalam proses
                pengembangan.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Kontak Resmi
            </p>

            <div className="mt-5 space-y-5">
              <FooterInfoItem
                label="Email"
                value={siteInfo.email}
                href={siteLinks.emailHref}
              />

              <FooterInfoItem
                label="Telepon"
                value={siteInfo.phone}
                href={siteLinks.phoneHref}
              />

              <FooterInfoItem
                label="Jam Layanan"
                value={siteInfo.officeHours}
              />

              <FooterInfoItem
                label="Wilayah"
                value="Kabupaten Barito Utara, Kalimantan Tengah"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} {siteInfo.shortName}. Hak Cipta Dilindungi.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Resmi
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                Informasi Publik
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}