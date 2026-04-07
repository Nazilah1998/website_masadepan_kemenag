"use client";
import { useEffect, useMemo, useState } from "react";
const emptyForm = {
  title: "",
  slug: "",
  category: "Informasi",
  excerpt: "",
  content: "",
  is_published: true,
  is_important: false,
  published_at: "",
  attachment_url: "",
  attachment_name: "",
  attachment_path: "",
  attachment_source: "",
  attachment_type: "",
};
function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
}
function slugPreview(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
function inferAttachmentTypeFromUrl(url) {
  const lower = String(url || "").toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/)) return "image";
  if (lower.match(/\.pdf(\?|$)/)) return "pdf";
  if (lower.includes("drive.google.com")) return "link";
  return "link";
}
export default function AdminPengumumanManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attachmentMode, setAttachmentMode] = useState("upload");
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });
  const titleForm = useMemo(() => {
    return editingId ? "Edit pengumuman" : "Tambah pengumuman";
  }, [editingId]);
  async function loadItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/pengumuman", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data pengumuman.");
      }
      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data pengumuman.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadItems();
  }, []);
  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setAttachmentMode("upload");
    setEditingId(null);
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
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Informasi",
      excerpt: item.excerpt || "",
      content: item.content || "",
      is_published: Boolean(item.is_published),
      is_important: Boolean(item.is_important),
      published_at: toDateTimeLocal(item.published_at),
      attachment_url: item.attachment_url || "",
      attachment_name: item.attachment_name || "",
      attachment_path: item.attachment_path || "",
      attachment_source: item.attachment_source || "",
      attachment_type: item.attachment_type || "",
    });
    setAttachmentMode(item.attachment_source === "link" ? "link" : "upload");
    setOpenForm(true);
  }
  function handleCloseForm() {
    setOpenForm(false);
    resetForm();
  }
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  async function handleAttachmentUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      setMessage("");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/pengumuman/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Gagal upload file.");
      }
      setForm((prev) => ({
        ...prev,
        attachment_url: data.item.attachment_url,
        attachment_name: data.item.attachment_name,
        attachment_path: data.item.attachment_path,
        attachment_source: data.item.attachment_source,
        attachment_type: data.item.attachment_type,
      }));
      setMessage("File berhasil diupload.");
    } catch (err) {
      setError(err.message || "Gagal upload file.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }
  function handleAttachmentLinkChange(event) {
    const url = event.target.value;
    setForm((prev) => ({
      ...prev,
      attachment_url: url,
      attachment_name: url ? "Link Lampiran" : "",
      attachment_path: "",
      attachment_source: url ? "link" : "",
      attachment_type: url ? inferAttachmentTypeFromUrl(url) : "",
    }));
  }
  function clearAttachment() {
    setForm((prev) => ({
      ...prev,
      attachment_url: "",
      attachment_name: "",
      attachment_path: "",
      attachment_source: "",
      attachment_type: "",
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const response = await fetch(
        editingId
          ? `/api/admin/pengumuman/${editingId}`
          : "/api/admin/pengumuman",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan pengumuman.");
      }
      setMessage(data?.message || "Pengumuman berhasil disimpan.");
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan pengumuman.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus pengumuman "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;
    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");
      const response = await fetch(`/api/admin/pengumuman/${item.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus pengumuman.");
      }
      setMessage(data?.message || "Pengumuman berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus pengumuman.");
    } finally {
      setDeletingId(null);
    }
  }
  return (
    <section className="space-y-6">
      {" "}
      {(message || error) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {" "}
          {error || message}{" "}
        </div>
      )}{" "}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {" "}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {" "}
              Pengumuman{" "}
            </p>{" "}
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {" "}
              Daftar pengumuman admin{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-slate-600">
              {" "}
              Kelola pengumuman website: tambah, edit, hapus, dan atur status
              tayang.{" "}
            </p>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {" "}
            + Tambah Pengumuman{" "}
          </button>{" "}
        </div>{" "}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          {" "}
          <div className="overflow-x-auto">
            {" "}
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              {" "}
              <thead className="bg-slate-50">
                {" "}
                <tr className="text-left text-slate-600">
                  {" "}
                  <th className="px-4 py-3 font-semibold">No</th>{" "}
                  <th className="px-4 py-3 font-semibold">Judul</th>{" "}
                  <th className="px-4 py-3 font-semibold">Kategori</th>{" "}
                  <th className="px-4 py-3 font-semibold">Publish</th>{" "}
                  <th className="px-4 py-3 font-semibold">Status</th>{" "}
                  <th className="px-4 py-3 font-semibold">Aksi</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-slate-100 bg-white">
                {" "}
                {loading ? (
                  <tr>
                    {" "}
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      {" "}
                      Memuat data pengumuman...{" "}
                    </td>{" "}
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    {" "}
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      {" "}
                      Belum ada pengumuman.{" "}
                    </td>{" "}
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="align-top">
                      {" "}
                      <td className="px-4 py-4 text-slate-600">
                        {index + 1}
                      </td>{" "}
                      <td className="px-4 py-4">
                        {" "}
                        <div className="max-w-md">
                          {" "}
                          <p className="font-semibold text-slate-900">
                            {" "}
                            {item.title}{" "}
                          </p>{" "}
                          <p className="mt-1 text-xs text-slate-500">
                            {" "}
                            /pengumuman/{item.slug}{" "}
                          </p>{" "}
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {" "}
                            {item.excerpt}{" "}
                          </p>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-4 py-4 text-slate-700">
                        {" "}
                        {item.category || "Informasi"}{" "}
                      </td>{" "}
                      <td className="px-4 py-4 text-slate-700">
                        {" "}
                        {formatDate(item.published_at)}{" "}
                      </td>{" "}
                      <td className="px-4 py-4">
                        {" "}
                        <div className="flex flex-col gap-2">
                          {" "}
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {" "}
                            {item.is_published ? "Tayang" : "Draft"}{" "}
                          </span>{" "}
                          {item.is_important ? (
                            <span className="inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              {" "}
                              Penting{" "}
                            </span>
                          ) : null}{" "}
                          {item.attachment_url ? (
                            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {" "}
                              {item.attachment_type === "image"
                                ? "Lampiran Gambar"
                                : item.attachment_type === "pdf"
                                  ? "Lampiran PDF"
                                  : "Lampiran Link"}{" "}
                            </span>
                          ) : null}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-4 py-4">
                        {" "}
                        <div className="flex flex-wrap gap-2">
                          {" "}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {" "}
                            Edit{" "}
                          </button>{" "}
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            {" "}
                            {deletingId === item.id
                              ? "Menghapus..."
                              : "Hapus"}{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))
                )}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          {" "}
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {" "}
            <div className="flex items-start justify-between gap-4">
              {" "}
              <div>
                {" "}
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {" "}
                  Form pengumuman{" "}
                </p>{" "}
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {" "}
                  {titleForm}{" "}
                </h3>{" "}
              </div>{" "}
              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {" "}
                Tutup{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {" "}
              <div className="grid gap-5 md:grid-cols-2">
                {" "}
                <label className="block">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Judul pengumuman{" "}
                  </span>{" "}
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul pengumuman"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  />{" "}
                </label>{" "}
                <label className="block">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Slug{" "}
                  </span>{" "}
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder={slugPreview(form.title)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />{" "}
                  <span className="mt-2 block text-xs text-slate-500">
                    {" "}
                    Kosongkan jika ingin dibuat otomatis dari judul.{" "}
                  </span>{" "}
                </label>{" "}
                <label className="block">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Kategori{" "}
                  </span>{" "}
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Contoh: Informasi, Layanan, Pengumuman"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />{" "}
                </label>{" "}
                <label className="block">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Tanggal publish{" "}
                  </span>{" "}
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />{" "}
                </label>{" "}
                <label className="block md:col-span-2">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Ringkasan{" "}
                  </span>{" "}
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tulis ringkasan pengumuman"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  />{" "}
                </label>{" "}
                <label className="block md:col-span-2">
                  {" "}
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {" "}
                    Isi pengumuman{" "}
                  </span>{" "}
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Tulis isi pengumuman lengkap"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  />{" "}
                </label>{" "}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  {" "}
                  <div>
                    {" "}
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {" "}
                      Lampiran pengumuman{" "}
                    </span>{" "}
                    <p className="text-xs text-slate-500">
                      {" "}
                      Bisa upload gambar atau PDF, atau tempel link Google
                      Drive.{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="grid gap-3 md:grid-cols-2">
                    {" "}
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      {" "}
                      <input
                        type="radio"
                        name="attachment_mode"
                        checked={attachmentMode === "upload"}
                        onChange={() => setAttachmentMode("upload")}
                      />{" "}
                      <span className="text-sm font-medium text-slate-700">
                        {" "}
                        Upload file{" "}
                      </span>{" "}
                    </label>{" "}
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      {" "}
                      <input
                        type="radio"
                        name="attachment_mode"
                        checked={attachmentMode === "link"}
                        onChange={() => setAttachmentMode("link")}
                      />{" "}
                      <span className="text-sm font-medium text-slate-700">
                        {" "}
                        Link Google Drive / URL{" "}
                      </span>{" "}
                    </label>{" "}
                  </div>{" "}
                  {attachmentMode === "upload" ? (
                    <div className="space-y-3">
                      {" "}
                      <input
                        type="file"
                        accept="image/*,.pdf,application/pdf"
                        onChange={handleAttachmentUpload}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                      />{" "}
                      <p className="text-xs text-slate-500">
                        {" "}
                        Format yang didukung: JPG, PNG, WEBP, GIF, PDF.{" "}
                      </p>{" "}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {" "}
                      <input
                        type="text"
                        value={
                          attachmentMode === "link" ? form.attachment_url : ""
                        }
                        onChange={handleAttachmentLinkChange}
                        placeholder="Tempel link Google Drive / PDF / gambar"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                      />{" "}
                      <p className="text-xs text-slate-500">
                        {" "}
                        Untuk Google Drive, pastikan file bisa diakses
                        publik.{" "}
                      </p>{" "}
                    </div>
                  )}{" "}
                  {(uploading || form.attachment_url) && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      {" "}
                      {uploading ? (
                        <p className="text-sm text-slate-600">
                          {" "}
                          Sedang upload file...{" "}
                        </p>
                      ) : (
                        <>
                          {" "}
                          <p className="text-sm font-semibold text-slate-800">
                            {" "}
                            Lampiran saat ini{" "}
                          </p>{" "}
                          <p className="mt-1 break-all text-sm text-slate-600">
                            {" "}
                            {form.attachment_name || form.attachment_url}{" "}
                          </p>{" "}
                          <p className="mt-1 text-xs text-slate-500">
                            {" "}
                            Tipe: {form.attachment_type || "-"} | Sumber:{" "}
                            {form.attachment_source || "-"}{" "}
                          </p>{" "}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {" "}
                            <a
                              href={form.attachment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              {" "}
                              Lihat lampiran{" "}
                            </a>{" "}
                            <button
                              type="button"
                              onClick={clearAttachment}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              {" "}
                              Hapus lampiran{" "}
                            </button>{" "}
                          </div>{" "}
                        </>
                      )}{" "}
                    </div>
                  )}{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid gap-3 md:grid-cols-2">
                {" "}
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {" "}
                  <input
                    type="checkbox"
                    name="is_important"
                    checked={form.is_important}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />{" "}
                  <span className="text-sm font-medium text-slate-700">
                    {" "}
                    Tandai sebagai pengumuman penting{" "}
                  </span>{" "}
                </label>{" "}
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {" "}
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />{" "}
                  <span className="text-sm font-medium text-slate-700">
                    {" "}
                    Langsung tayang ke publik{" "}
                  </span>{" "}
                </label>{" "}
              </div>{" "}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                {" "}
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {" "}
                  Batal{" "}
                </button>{" "}
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {" "}
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Update Pengumuman"
                      : "Simpan Pengumuman"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </section>
  );
}
