import { useState, useMemo } from "react";

export function useBeritaList(items) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(7);

  const categories = useMemo(
    () => ["Semua", ...new Set(items.map((item) => item.category))],
    [items],
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        category === "Semua" || item.category === category;
      const keyword = query.trim().toLowerCase();

      const matchesQuery =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.excerpt.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword);

      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  function handleQueryChange(event) {
    setQuery(event.target.value);
    setVisibleCount(7);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setVisibleCount(7);
  }

  function loadMore() {
    setVisibleCount((prev) => prev + 6);
  }

  const featured = filteredItems[0];
  const restItems = filteredItems.slice(1, visibleCount);
  const hasMore = filteredItems.length > visibleCount;

  return {
    query,
    category,
    categories,
    filteredItems,
    featured,
    restItems,
    hasMore,
    handleQueryChange,
    handleCategoryChange,
    loadMore,
  };
}
