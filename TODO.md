# TODO - Optimasi + Fitur Viewer PDF Laporan

- [ ] 1. Optimasi loading preview PDF agar lebih cepat:
  - [ ] Lazy mount viewer hanya saat dibuka
  - [ ] Render bertahap (halaman awal dulu), bukan blocking semua halaman sekaligus
  - [ ] Gunakan ukuran render responsif agar tidak terlalu berat
  - [ ] Cegah re-render berulang yang tidak perlu

- [ ] 2. Tambah toolbar viewer:
  - [ ] Indikator Halaman X / Y
  - [ ] Tombol Prev / Next
  - [ ] Tombol Download dokumen (ikon + label)

- [ ] 3. Tambah scroll internal pada area PDF:
  - [ ] Container tinggi tetap
  - [ ] Overflow vertikal aktif
  - [ ] UX scroll halus untuk melihat halaman bawah

- [ ] 4. Integrasi properti viewer dari daftar dokumen:
  - [ ] Kirim `fileUrl` dan `title` dari `LaporanDocumentsClient` ke `PdfViewerClient`
  - [ ] Rapikan fallback agar tetap inline (tidak memaksa tab baru)

- [ ] 5. Critical-path testing halaman `/laporan/[slug]`:
  - [ ] Buka/Tutup dokumen tetap normal
  - [ ] Preview tampil lebih cepat
  - [ ] Halaman X/Y tampil
  - [ ] Prev/Next berfungsi
  - [ ] Scroll internal berfungsi
  - [ ] Download berfungsi

# TODO - Responsive PDF Viewer Mobile

- [ ] 1. Rapikan toolbar PDF agar responsif dan compact di mobile
- [ ] 2. Pastikan lebar halaman PDF selalu fit container tanpa scroll horizontal
- [ ] 3. Tambahkan kontrol Fit + batas zoom aman untuk mobile
- [ ] 4. Tuning container preview di `LaporanDocumentsClient` untuk padding mobile
- [ ] 5. Uji critical-path mobile/tablet/desktop setelah perbaikan
