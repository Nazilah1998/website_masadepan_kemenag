"use client";

import React from "react";
import { useGallery } from "@/hooks/useGallery";
import { GalleryHeader, GalleryCard, GalleryEmpty } from "./GalleryUI";
import { GalleryLightbox } from "./GalleryLightbox";

export default function GaleriPageClient({ items = [] }) {
  const g = useGallery(items);

  return (
    <>
      <section className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
        <GalleryHeader count={g.safeItems.length} />

        {g.safeItems.length === 0 ? (
          <GalleryEmpty />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {g.safeItems.map((item, index) => (
              <GalleryCard
                key={item.id ?? index}
                item={item}
                onOpen={() => g.setSelectedIndex(index)}
              />
            ))}
          </div>
        )}
      </section>

      <GalleryLightbox
        item={g.selectedItem}
        index={g.selectedIndex}
        total={g.safeItems.length}
        onClose={g.handleClose}
        onPrev={g.handlePrev}
        onNext={g.handleNext}
      />
    </>
  );
}
