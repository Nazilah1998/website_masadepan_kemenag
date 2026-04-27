import { useState, useCallback, useMemo, useEffect } from "react";

export function useGallery(items) {
  const safeItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter(Boolean);
  }, [items]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectedItem = useMemo(() => {
    if (selectedIndex < 0 || selectedIndex >= safeItems.length) return null;
    return safeItems[selectedIndex];
  }, [safeItems, selectedIndex]);

  const handleClose = useCallback(() => setSelectedIndex(-1), []);

  const handlePrev = useCallback(() => {
    if (safeItems.length <= 1) return;
    setSelectedIndex((current) =>
      current <= 0 ? safeItems.length - 1 : current - 1,
    );
  }, [safeItems.length]);

  const handleNext = useCallback(() => {
    if (safeItems.length <= 1) return;
    setSelectedIndex((current) =>
      current >= safeItems.length - 1 ? 0 : current + 1,
    );
  }, [safeItems.length]);

  useEffect(() => {
    if (!selectedItem) {
      document.body.style.overflow = "";
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedItem, handleClose, handlePrev, handleNext]);

  return {
    safeItems,
    selectedIndex,
    setSelectedIndex,
    selectedItem,
    handleClose,
    handlePrev,
    handleNext,
  };
}
