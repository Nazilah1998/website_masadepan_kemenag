import Image from "next/image";
import Link from "next/link";

const externalApps = [
    {
        title: "SIMPEG 5",
        description: "Sistem informasi manajemen kepegawaian Kementerian Agama.",
        href: "https://simpeg5.kemenag.go.id/",
        badge: "SI",
        icon: "/apps/simpeg5.png",
    },
    {
        title: "PUSAKA",
        description: "Portal layanan digital terintegrasi Kementerian Agama.",
        href: "https://pusaka-v3.kemenag.go.id/",
        badge: "PU",
        icon: "/apps/pusaka.png",
    },
    {
        title: "EMIS",
        description: "Layanan data dan informasi pendidikan Islam terpadu.",
        href: "https://emisgtk.kemenag.go.id/",
        badge: "EM",
        icon: "/apps/emis.png",
    },
    {
        title: "ASN DIGITAL",
        description: "Platform layanan ASN digital dari Badan Kepegawaian Negara.",
        href: "https://asndigital.bkn.go.id/",
        badge: "AD",
        icon: "/apps/asn-digital.png",
    },
    {
        title: "SRIKANDI",
        description: "Aplikasi arsip dinamis terintegrasi nasional.",
        href: "https://srikandi.arsip.go.id/",
        badge: "SR",
        icon: "/apps/srikandi.png",
    },
];

export default function ExternalAppsSection() {
    return (
        <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 md:p-8">
                <div className="max-w-3xl">
                    <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
                        Link Aplikasi
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 md:text-3xl">
                        Aplikasi Eksternal Terkait
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        Pilih aplikasi yang dibutuhkan. Setiap tautan akan dibuka di tab
                        baru agar akses portal utama tetap terbuka.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {externalApps.map((app) => (
                        <Link
                            key={app.title}
                            href={app.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex items-center justify-between">
                                <div className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 text-base font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <Image
                                        src={app.icon}
                                        alt={`Logo ${app.title}`}
                                        width={42}
                                        height={42}
                                        className="h-10 w-10 object-contain"
                                    />
                                </div>
                                <span className="text-sm text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-300">
                                    ↗
                                </span>
                            </div>

                            <h3 className="mt-4 text-base font-black text-slate-900 dark:text-slate-100">
                                {app.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                {app.description}
                            </p>

                            <div className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                                Buka aplikasi
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
