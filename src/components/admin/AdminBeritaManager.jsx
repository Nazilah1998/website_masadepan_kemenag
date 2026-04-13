"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  normalizeCoverImageUrl,
  toCoverPreviewUrl,
} from "@/lib/cover-image";

const ITEMS_PER_PAGE = 5;

const BERITA_CATEGORIES = [
  "Umum",
  "Kegiatan",
  "Madrasah",
  "Pelayanan",
  "Pengumuman",
  "Agenda",
  "Pendidikan",
  "Keagamaan",
];

const emptyForm = {
  title: "",
  slug: "",
  category: "Umum",
  content: "",
  cover_image: "",
  is_published: true,
  published_at: "",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getMonthKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getYearKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

function getMonthLabelFromKey(key) {
  if (!key) return "Semua bulan";

  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
}

function slugPreview(title = "") {
  return String(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value = "", maxLength = 120) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function countWords(value = "") {
  const plain = stripHtml(value);
  return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
}

function estimateReadingTime(value = "") {
  const totalWords = countWords(value);
  if (totalWords === 0) return 1;
  return Math.max(1, Math.ceil(totalWords / 200));
}

function buildExcerptFromHtml(html = "", maxLength = 180) {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trim()}...`;
}

function isMeaningfulHtml(html = "") {
  return stripHtml(html).length > 0;
}

function isHttpUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getAllowedCoverHosts() {
  const hosts = new Set(["drive.google.com", "docs.google.com"]);

  if (typeof window !== "undefined") {
    hosts.add(window.location.hostname);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname);
    } catch {
      // abaikan env tidak valid
    }
  }

  return hosts;
}

function isAllowedCoverUrl(value = "") {
  if (!value) return true;
  if (!isHttpUrl(value)) return false;

  try {
    const url = new URL(value);
    return getAllowedCoverHosts().has(url.hostname);
  } catch {
    return false;
  }
}

function buildPagination(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

function ToolbarButton({
  type = "button",
  onClick,
  children,
  title,
  className = "",
}) {
  return (
    <button
      type={type}
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 ${className}`.trim()}
    >
      {children}
    </button>
  );
}

function StatusPill({ published }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${published
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
        }`}
    >
      {published ? "Tayang" : "Draft"}
    </span>
  );
}

function CoverThumb({
  src,
  alt = "Cover berita",
  className = "",
  fallbackText = "Belum ada cover",
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-400 ${className}`.trim()}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className={`rounded-2xl object-cover ${className}`.trim()}
    />
  );
}

function FieldCounter({ current, helper }) {
  return (
    <p className="mt-2 flex justify-end text-xs text-slate-400">
      <span>
        {helper} {current}
      </span>
    </p>
  );
}

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-emerald-600" : "bg-slate-300"
            }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"
              }`}
          />
        </button>
      </div>
    </div>
  );
}

function IconAlignLeft() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M3 5h14M3 8h9M3 11h14M3 14h9" strokeLinecap="round" />
    </svg>
  );
}

function IconAlignCenter() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M3 5h14M5.5 8h9M3 11h14M5.5 14h9" strokeLinecap="round" />
    </svg>
  );
}

function IconAlignRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M3 5h14M8 8h9M3 11h14M8 14h9" strokeLinecap="round" />
    </svg>
  );
}

function IconJustify() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M3 5h14M3 8h14M3 11h14M3 14h14" strokeLinecap="round" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M6.5 6H4.8A1.8 1.8 0 0 0 3 7.8V10h3.5v4H3v-3.2C3 7 4.8 5 7.2 5h-.7Zm8 0h-1.7A1.8 1.8 0 0 0 11 7.8V10h3.5v4H11v-3.2C11 7 12.8 5 15.2 5h-.7Z" />
    </svg>
  );
}

function IconBulletList() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="4" cy="5" r="1" fill="currentColor" />
      <circle cx="4" cy="10" r="1" fill="currentColor" />
      <circle cx="4" cy="15" r="1" fill="currentColor" />
      <path d="M8 5h9M8 10h9M8 15h9" strokeLinecap="round" />
    </svg>
  );
}

function IconNumberList() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path
        d="M3.2 5h1.4v3M3 8h2M3.2 11.3c.2-.4.7-.8 1.3-.8.7 0 1.2.4 1.2 1s-.3.9-.8 1.2l-1.5.8H6M8 5h9M8 10h9M8 15h9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path
        d="M8 12l4-4M6.5 13.5l-1 1a2.5 2.5 0 1 1-3.5-3.5l3-3A2.5 2.5 0 0 1 8.5 8M13.5 6.5l1-1a2.5 2.5 0 1 1 3.5 3.5l-3 3A2.5 2.5 0 0 1 11.5 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClearFormat() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path
        d="M4 5h8M6 5l4 9M14.5 5l-9 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function readJsonSafely(response) {
  const raw = await response.text();

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    console.error("Raw response from galeri endpoint:", raw);

    if (raw.includes("<!DOCTYPE") || raw.includes("<html")) {
      throw new Error(
        "Endpoint galeri belum terbaca oleh Next.js. Cek path file route, error import di route.js, lalu restart npm run dev.",
      );
    }

    throw new Error(raw);
  }
}

export default function AdminBeritaManager() {
  const editorRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [gallerySendingId, setGallerySendingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [openGalleryForm, setOpenGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    berita_id: "",
    title: "",
    slug: "",
    image_url: "",
    link_url: "",
    published_at: "",
  });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/berita", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data berita.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message || "Gagal memuat data berita.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!openForm || !editorRef.current) return;

    const nextHtml = form.content || "";
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [openForm, form.content]);

  useEffect(() => {
    if (!openForm || !dirty) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [openForm, dirty]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, yearFilter, monthFilter]);

  useEffect(() => {
    setMonthFilter("all");
  }, [yearFilter]);

  const titleForm = useMemo(() => {
    return editingId ? "Edit berita" : "Tambah berita";
  }, [editingId]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((item) => Boolean(item.is_published)).length;
    const draft = total - published;
    const views = items.reduce((acc, item) => acc + Number(item.views || 0), 0);

    return {
      total,
      published,
      draft,
      views,
    };
  }, [items]);

  const yearlyPublishedSummary = useMemo(() => {
    const summaryMap = new Map();

    items.forEach((item) => {
      if (!item?.is_published) return;

      const yearKey = getYearKey(item.published_at);
      if (!yearKey) return;

      summaryMap.set(yearKey, (summaryMap.get(yearKey) || 0) + 1);
    });

    return Array.from(summaryMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        key,
        label: key,
        count,
      }));
  }, [items]);

  const monthlyPublishedSummary = useMemo(() => {
    const summaryMap = new Map();

    items.forEach((item) => {
      if (!item?.is_published) return;

      const yearKey = getYearKey(item.published_at);
      const monthKey = getMonthKey(item.published_at);

      if (!monthKey) return;
      if (yearFilter !== "all" && yearKey !== yearFilter) return;

      summaryMap.set(monthKey, (summaryMap.get(monthKey) || 0) + 1);
    });

    return Array.from(summaryMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        key,
        label: getMonthLabelFromKey(key),
        count,
      }));
  }, [items, yearFilter]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && Boolean(item.is_published)) ||
        (statusFilter === "draft" && !Boolean(item.is_published));

      const itemYearKey = getYearKey(item.published_at);
      const itemMonthKey = getMonthKey(item.published_at);

      const matchesYear =
        yearFilter === "all" ||
        (Boolean(item.is_published) && itemYearKey === yearFilter);

      const matchesMonth =
        monthFilter === "all" ||
        (Boolean(item.is_published) && itemMonthKey === monthFilter);

      const haystack = [item.title, item.slug, item.category]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesYear && matchesMonth && matchesKeyword;
    });
  }, [items, query, statusFilter, yearFilter, monthFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const paginationItems = buildPagination(totalPages, safeCurrentPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const readingTime = useMemo(
    () => estimateReadingTime(form.content),
    [form.content],
  );

  const previewCover = useMemo(
    () => normalizeCoverImageUrl(form.cover_image || ""),
    [form.cover_image],
  );

  const coverPreviewUrl = useMemo(() => {
    return toCoverPreviewUrl(previewCover);
  }, [previewCover]);

  const previewSlug = useMemo(() => {
    return (form.slug || slugPreview(form.title) || "judul-berita").trim();
  }, [form.slug, form.title]);

  const galleryPreviewUrl = useMemo(() => {
    return toCoverPreviewUrl(normalizeCoverImageUrl(galleryForm.image_url || ""));
  }, [galleryForm.image_url]);

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setEditingId(null);
    setSlugManuallyEdited(false);
    setDirty(false);

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }

  function handleOpenCreate() {
    setMessage("");
    setError("");
    resetForm();
    setOpenForm(true);
  }

  function handleOpenEdit(item) {
    setMessage("");
    setError("");
    setEditingId(item.id);
    setSlugManuallyEdited(true);

    const normalizedCoverImage = normalizeCoverImageUrl(item.cover_image || "");

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Umum",
      content: item.content || "",
      cover_image: normalizedCoverImage,
      is_published: Boolean(item.is_published),
      published_at: toDateTimeLocal(item.published_at),
    });

    setDirty(false);
    setOpenForm(true);
  }

  function confirmDiscardChanges() {
    if (!dirty) return true;

    return window.confirm(
      "Perubahan belum disimpan.\nTutup form dan buang perubahan?",
    );
  }

  function handleCloseForm() {
    if (!confirmDiscardChanges()) return;
    setOpenForm(false);
    resetForm();
  }

  function handleOpenGalleryForm(item) {
    setError("");
    setMessage("");

    setGalleryForm({
      berita_id: item.id,
      title: item.title || "",
      slug: item.slug || "",
      image_url: normalizeCoverImageUrl(item.cover_image || ""),
      link_url: `/berita/${item.slug}`,
      published_at: item.published_at || "",
    });

    setOpenGalleryForm(true);
  }

  function handleCloseGalleryForm() {
    setOpenGalleryForm(false);
    setGalleryForm({
      berita_id: "",
      title: "",
      slug: "",
      image_url: "",
      link_url: "",
      published_at: "",
    });
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      if (name === "title") {
        const nextTitle = value;

        return {
          ...prev,
          title: nextTitle,
          slug: slugManuallyEdited ? prev.slug : slugPreview(nextTitle),
        };
      }

      if (name === "slug") {
        return {
          ...prev,
          slug: value,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setDirty(true);
  }

  function handlePublishedToggle(nextValue) {
    setForm((prev) => ({
      ...prev,
      is_published: nextValue,
    }));
    setDirty(true);
  }

  function syncEditorToState() {
    const html = editorRef.current?.innerHTML || "";

    setForm((prev) => {
      if (prev.content === html) return prev;
      return { ...prev, content: html };
    });

    return html;
  }

  function handleEditorInput() {
    syncEditorToState();
    setDirty(true);
  }

  function runEditorCommand(command, value = null) {
    editorRef.current?.focus();

    if (
      typeof document === "undefined" ||
      typeof document.execCommand !== "function"
    ) {
      setError(
        "Toolbar editor tidak didukung browser ini. Anda masih bisa menulis isi berita secara manual.",
      );
      return;
    }

    try {
      document.execCommand(command, false, value);
      syncEditorToState();
      setDirty(true);
    } catch {
      setError("Perintah editor gagal dijalankan.");
    }
  }

  function handleInsertLink() {
    const url = window.prompt(
      "Tempel tautan yang ingin dimasukkan:",
      "https://",
    );

    if (!url) return;

    runEditorCommand("createLink", url);
  }

  function handleCoverLinkChange(event) {
    const normalizedUrl = normalizeCoverImageUrl(event.target.value);

    setForm((prev) => ({
      ...prev,
      cover_image: normalizedUrl,
    }));

    setDirty(true);
  }

  function clearCoverImage() {
    setForm((prev) => ({
      ...prev,
      cover_image: "",
    }));
    setDirty(true);
  }

  function buildPayload(nextPublishedState = form.is_published) {
    const currentContent = syncEditorToState();
    const normalizedCoverImage = normalizeCoverImageUrl(form.cover_image);
    const finalSlug = (form.slug || slugPreview(form.title)).trim();
    const autoExcerpt = buildExcerptFromHtml(currentContent || form.content, 180);

    if (!form.title.trim()) {
      setError("Judul berita wajib diisi.");
      return null;
    }

    if (!finalSlug) {
      setError("Slug berita wajib diisi.");
      return null;
    }

    if (!isMeaningfulHtml(currentContent || form.content)) {
      setError("Isi berita wajib diisi.");
      return null;
    }

    if (normalizedCoverImage && !isAllowedCoverUrl(normalizedCoverImage)) {
      setError(
        "Link cover hanya mendukung Google Drive, domain website sendiri, atau Supabase Storage publik.",
      );
      return null;
    }

    let publishedAtIso = "";

    if (form.published_at) {
      const publishedDate = new Date(form.published_at);

      if (Number.isNaN(publishedDate.getTime())) {
        setError("Tanggal publish tidak valid.");
        return null;
      }

      publishedAtIso = publishedDate.toISOString();
    }

    return {
      ...form,
      title: form.title.trim(),
      slug: finalSlug,
      category: form.category || "Umum",
      excerpt: autoExcerpt,
      content: currentContent || form.content || "",
      cover_image: normalizedCoverImage,
      is_published: Boolean(nextPublishedState),
      published_at: publishedAtIso,
    };
  }

  async function saveForm(nextPublishedState = form.is_published) {
    const payload = buildPayload(nextPublishedState);
    if (!payload) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        editingId ? `/api/admin/berita/${editingId}` : "/api/admin/berita",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan berita.");
      }

      setMessage(data?.message || "Berita berhasil disimpan.");
      setDirty(false);
      setOpenForm(false);
      resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus berita "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/berita/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus berita.");
      }

      setMessage(data?.message || "Berita berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus berita.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmitGallery() {
    if (!galleryForm.image_url.trim()) {
      setError("Cover portrait untuk galeri wajib diisi.");
      return;
    }

    if (!isAllowedCoverUrl(galleryForm.image_url)) {
      setError(
        "Link cover galeri hanya mendukung Google Drive, domain website sendiri, atau Supabase Storage publik.",
      );
      return;
    }

    try {
      setGallerySendingId(galleryForm.berita_id);
      setError("");
      setMessage("");

      const response = await fetch("/api/admin/galeri/from-berita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryForm),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal mengirim berita ke galeri.");
      }

      setMessage(
        data?.message || "Item galeri berhasil disimpan dari data berita.",
      );
      handleCloseGalleryForm();
    } catch (err) {
      setError(err.message || "Gagal mengirim berita ke galeri.");
    } finally {
      setGallerySendingId(null);
    }
  }

  return (
    <>
      <section className="space-y-6">
        {(message || error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${error
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
          >
            {error || message}
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Panel admin
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Kelola Berita
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Workflow editorial berita, status publikasi, filter rilis per tahun
              dan bulan, serta pengiriman ke galeri dalam satu panel kerja.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            + Tambah berita
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total berita"
            value={stats.total}
            helper="Seluruh berita yang tersimpan."
          />
          <StatCard
            label="Tayang"
            value={stats.published}
            helper="Berita yang aktif tampil di website."
          />
          <StatCard
            label="Draft"
            value={stats.draft}
            helper="Berita yang belum dipublikasikan."
          />
          <StatCard
            label="Total pembaca"
            value={stats.views}
            helper="Akumulasi views dari seluruh berita."
          />
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                  Berita
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Daftar berita admin
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Kelola artikel, cari data lebih cepat, pantau jumlah rilis per
                  tahun dan bulan, lalu buka form editor dengan workflow yang
                  lebih rapi.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_180px_220px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cari berita
                </label>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari judul, slug, atau kategori..."
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Filter status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua status</option>
                  <option value="published">Tayang</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tahun rilis
                </label>
                <select
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua tahun</option>
                  {yearlyPublishedSummary.map((year) => (
                    <option key={year.key} value={year.key}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bulan rilis
                </label>
                <select
                  value={monthFilter}
                  onChange={(event) => setMonthFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua bulan</option>
                  {monthlyPublishedSummary.map((month) => (
                    <option key={month.key} value={month.key}>
                      {month.label} ({month.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Menampilkan {filteredItems.length} dari {items.length} berita.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    No
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    Judul
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    Kategori
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    Dibaca
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:px-6">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      Memuat data berita...
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      Belum ada data yang cocok.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-5 align-top text-sm text-slate-500 md:px-6">
                        {startIndex + index + 1}
                      </td>

                      <td className="px-5 py-5 align-top md:px-6">
                        <div className="min-w-65">
                          <p className="text-base font-semibold leading-7 text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            /berita/{item.slug}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {truncateText(
                              item.excerpt ||
                              buildExcerptFromHtml(item.content || "", 120) ||
                              "Belum ada ringkasan otomatis.",
                              120,
                            )}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {formatDate(item.published_at)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-5 align-top text-sm font-medium text-slate-700 md:px-6">
                        {item.category || "-"}
                      </td>

                      <td className="px-5 py-5 align-top text-sm font-medium text-slate-700 md:px-6">
                        {Number(item.views || 0)}
                      </td>

                      <td className="px-5 py-5 align-top md:px-6">
                        <StatusPill published={Boolean(item.is_published)} />
                      </td>

                      <td className="px-5 py-5 align-top md:px-6">
                        <div className="flex flex-wrap gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === item.id ? "Menghapus..." : "Hapus"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenGalleryForm(item)}
                              className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                            >
                              Kirim / Edit galeri
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p className="text-sm text-slate-500">
              Halaman {safeCurrentPage} dari {totalPages}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex items-center px-2 text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${safeCurrentPage === item
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {openForm ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 md:p-8">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                  Form berita
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {titleForm}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Form siap disimpan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Judul berita
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Masukkan judul berita"
                        className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                      />
                      <FieldCounter
                        current={form.title.trim().length}
                        helper="Usahakan judul tetap padat dan jelas."
                      />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Slug
                        </label>
                        <input
                          name="slug"
                          value={form.slug}
                          onChange={handleChange}
                          placeholder="slug-berita"
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                        <FieldCounter
                          current={previewSlug.length}
                          helper={`/berita/${previewSlug}`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Kategori
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        >
                          {BERITA_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="max-w-sm">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Tanggal publish
                      </label>
                      <input
                        type="datetime-local"
                        name="published_at"
                        value={form.published_at}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Editor isi berita
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Fokus pada struktur yang rapi, heading seperlunya,
                            dan isi yang enak dibaca.
                          </p>
                        </div>

                        <p className="text-xs text-slate-400">
                          {wordCount} kata • {readingTime} menit baca
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ToolbarButton
                          title="Bold"
                          onClick={() => runEditorCommand("bold")}
                        >
                          <span className="text-sm font-black">B</span>
                        </ToolbarButton>

                        <ToolbarButton
                          title="Italic"
                          onClick={() => runEditorCommand("italic")}
                        >
                          <span className="text-sm font-semibold italic">I</span>
                        </ToolbarButton>

                        <ToolbarButton
                          title="Underline"
                          onClick={() => runEditorCommand("underline")}
                        >
                          <span className="text-sm font-semibold underline">
                            U
                          </span>
                        </ToolbarButton>

                        <ToolbarButton
                          title="Heading 2"
                          onClick={() => runEditorCommand("formatBlock", "h2")}
                        >
                          <span className="text-[11px] font-bold">H2</span>
                        </ToolbarButton>

                        <ToolbarButton
                          title="Heading 3"
                          onClick={() => runEditorCommand("formatBlock", "h3")}
                        >
                          <span className="text-[11px] font-bold">H3</span>
                        </ToolbarButton>

                        <ToolbarButton
                          title="Rata kiri"
                          onClick={() => runEditorCommand("justifyLeft")}
                        >
                          <IconAlignLeft />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Rata tengah"
                          onClick={() => runEditorCommand("justifyCenter")}
                        >
                          <IconAlignCenter />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Rata kanan"
                          onClick={() => runEditorCommand("justifyRight")}
                        >
                          <IconAlignRight />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Justify"
                          onClick={() => runEditorCommand("justifyFull")}
                        >
                          <IconJustify />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Quote"
                          onClick={() =>
                            runEditorCommand("formatBlock", "blockquote")
                          }
                        >
                          <IconQuote />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Bullet list"
                          onClick={() =>
                            runEditorCommand("insertUnorderedList")
                          }
                        >
                          <IconBulletList />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Numbered list"
                          onClick={() => runEditorCommand("insertOrderedList")}
                        >
                          <IconNumberList />
                        </ToolbarButton>

                        <ToolbarButton title="Tautan" onClick={handleInsertLink}>
                          <IconLink />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Reset format"
                          onClick={() => runEditorCommand("removeFormat")}
                        >
                          <IconClearFormat />
                        </ToolbarButton>
                      </div>

                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleEditorInput}
                        className="prose prose-slate mt-4 h-105 max-h-105 overflow-y-auto rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <aside className="space-y-4">
                  <ToggleSwitch
                    checked={form.is_published}
                    onChange={handlePublishedToggle}
                    label="Tayangkan setelah disimpan"
                    description="Aktifkan untuk langsung menampilkan berita di website publik."
                  />

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">Status</p>

                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-start justify-between gap-4">
                        <span>Status</span>
                        <span className="font-semibold text-slate-900">
                          {form.is_published ? "Tayang" : "Draft"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span>Kategori</span>
                        <span className="font-semibold text-slate-900">
                          {form.category}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span>Jumlah kata</span>
                        <span className="font-semibold text-slate-900">
                          {wordCount}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span>Estimasi baca</span>
                        <span className="font-semibold text-slate-900">
                          {readingTime} menit
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">
                        Cover image
                      </p>

                      {form.cover_image ? (
                        <button
                          type="button"
                          onClick={clearCoverImage}
                          className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                        >
                          Hapus cover
                        </button>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Gunakan link gambar publik dari Google Drive, Supabase
                      Storage, atau domain website sendiri.
                    </p>

                    <input
                      value={form.cover_image}
                      onChange={handleCoverLinkChange}
                      placeholder="https://drive.google.com/..."
                      className="mt-4 h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                    />

                    <div className="mt-4">
                      <CoverThumb
                        src={coverPreviewUrl}
                        className="h-36 w-full"
                        fallbackText="Preview cover akan tampil di sini"
                      />
                    </div>

                    {form.cover_image ? (
                      <p className="mt-3 break-all text-xs leading-5 text-slate-400">
                        {form.cover_image}
                      </p>
                    ) : null}
                  </div>
                </aside>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-end md:px-8">
              <button
                type="button"
                onClick={handleCloseForm}
                disabled={saving}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => saveForm(false)}
                disabled={saving}
                className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan sebagai draft"}
              </button>

              <button
                type="button"
                onClick={() => saveForm(true)}
                disabled={saving}
                className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan & tayangkan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {openGalleryForm ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 md:p-8">
          <div className="w-full max-w-2xl rounded-4xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Form galeri
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Kirim ke galeri
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Gunakan cover portrait khusus untuk item galeri yang terhubung
                  ke berita.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseGalleryForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-5 px-6 py-6 md:px-8">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Judul berita
                </label>
                <input
                  value={galleryForm.title}
                  readOnly
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Link berita
                </label>
                <input
                  value={galleryForm.link_url}
                  readOnly
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL cover portrait
                </label>
                <input
                  value={galleryForm.image_url}
                  onChange={(event) =>
                    setGalleryForm((prev) => ({
                      ...prev,
                      image_url: normalizeCoverImageUrl(event.target.value),
                    }))
                  }
                  placeholder="https://drive.google.com/..."
                  className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-sky-500"
                />
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Gunakan gambar portrait/banner khusus galeri dari Google Drive
                  publik.
                </p>
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">
                  Preview cover
                </p>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <CoverThumb
                    src={galleryPreviewUrl}
                    className="mx-auto aspect-3/4 w-full max-w-65"
                    fallbackText="Preview portrait akan tampil di sini"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-end md:px-8">
              <button
                type="button"
                onClick={handleCloseGalleryForm}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitGallery}
                disabled={gallerySendingId === galleryForm.berita_id}
                className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {gallerySendingId === galleryForm.berita_id
                  ? "Mengirim..."
                  : "Kirim ke galeri"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}