import React from "react";
import { MaintenanceContent } from "./MaintenanceContent";
import { MaintenanceSidebar } from "./MaintenanceSidebar";

export default function PremiumMaintenancePage({
  title = "Halaman Dalam Maintenance",
  featureName = "Fitur",
  description = "Halaman ini sedang dalam proses pengembangan dan penyesuaian.",
}) {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_28%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[24px_24px]" />

      <section className="flex min-h-[calc(100svh-170px)] w-full items-center px-6 py-4 sm:px-10 md:py-6 lg:px-16 xl:px-20">
        <div className="grid w-full gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <MaintenanceContent
            title={title}
            featureName={featureName}
            description={description}
          />
          <MaintenanceSidebar />
        </div>
      </section>
    </main>
  );
}
