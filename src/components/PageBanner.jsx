import Link from "next/link";

export default function PageBanner({
  title,
  description,
  breadcrumb = [],
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,#031127_0%,#071b3a_45%,#062b2b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-14">
        {breadcrumb.length > 0 ? (
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/75">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-2"
                >
                  {index > 0 ? <span className="text-white/40">/</span> : null}

                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-semibold text-white" : ""}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        ) : null}

        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}