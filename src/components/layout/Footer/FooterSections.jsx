import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo, siteLinks } from "@/data/site";
import { FooterLink, FooterInfoItem, SocialIconLink } from "./FooterUI";
import { FacebookIcon, XIcon, InstagramIcon, YouTubeIcon, TikTokIcon } from "./FooterIcons";
import { useLanguage } from "@/context/LanguageContext";

export function FooterBrand() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="theme-footer-panel flex h-12 w-12 items-center justify-center rounded-2xl p-2">
          <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={40} height={40} className="object-contain" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-(--primary-strong)">{siteInfo.shortName}</p>
          <p className="theme-footer-muted text-xs">{siteInfo.tagline}</p>
        </div>
      </div>
      <p className="theme-footer-muted mt-4 max-w-md text-sm leading-6">
        {t("home.hero.description")}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/kontak" className="theme-primary-button inline-flex items-center rounded-full px-4 py-2 text-xs font-black transition">
          {t("nav.kontak")}
        </Link>
        <Link href="/profil/sejarah" className="theme-footer-panel inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:text-(--primary-strong)" style={{ color: "var(--footer-fg)" }}>
          {t("nav.profil")}
        </Link>
      </div>
    </div>
  );
}

export function FooterMenu() {
  const { t } = useLanguage();
  const menuItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.profil"), href: "/profil/sejarah" },
    { label: t("nav.berita"), href: "/berita" },
    { label: t("nav.layanan"), href: "/layanan" },
    { label: t("nav.informasi"), href: "/informasi" },
    { label: t("nav.galeri"), href: "/galeri" },
    { label: t("nav.kontak"), href: "/kontak" },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--footer-fg)" }}>
        {t("footer.quickLinks")}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {menuItems.map((item) => <FooterLink key={item.href} href={item.href}>{item.label}</FooterLink>)}
      </div>
    </div>
  );
}

export function FooterContact() {
  const { t } = useLanguage();
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--footer-fg)" }}>
        {t("nav.kontak")}
      </p>
      <div className="mt-3 space-y-3">
        <FooterInfoItem label="Email" value={siteInfo.email} href={siteLinks.emailHref} />
        <FooterInfoItem label="Telepon" value={siteInfo.phone} href={siteLinks.phoneHref} />
        <FooterInfoItem label={t("footer.officeHours")} value={siteInfo.officeHours} />
        <FooterInfoItem label="Wilayah" value="Kabupaten Barito Utara, Kalimantan Tengah" />
      </div>
    </div>
  );
}

export function FooterSocial() {
  const { t } = useLanguage();
  const socialLinks = [
    { label: "Facebook", href: "#", icon: FacebookIcon },
    { label: "X / Twitter", href: "#", icon: XIcon },
    { label: "Instagram", href: "#", icon: InstagramIcon },
    { label: "YouTube", href: "#", icon: YouTubeIcon },
    { label: "TikTok", href: "#", icon: TikTokIcon },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--footer-fg)" }}>
        {t("footer.followUs")}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {socialLinks.map((item) => <SocialIconLink key={item.label} label={item.label} href={item.href} icon={item.icon} />)}
      </div>
    </div>
  );
}
