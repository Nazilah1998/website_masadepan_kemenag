# TODO - Homepage Slider + Admin CRUD

- [x] 1. Add DB schema for `homepage_slides` in `docs/schema.sql`
- [x] 2. Create library `src/lib/homepage-slides.js` for public/admin queries
- [x] 3. Create admin APIs:
  - [x] `src/app/api/admin/homepage-slides/route.js`
  - [x] `src/app/api/admin/homepage-slides/[id]/route.js`
- [x] 4. Create admin UI:
  - [x] `src/app/admin/homepage-slides/page.jsx`
  - [x] `src/components/admin/AdminHomepageSlidesManager.jsx`
- [x] 5. Update permissions and admin navigation:
  - [x] `src/lib/permissions.js`
  - [x] `src/components/admin/AdminSidebar.jsx`
  - [x] `src/components/admin/AdminHeader.jsx`
- [x] 6. Create homepage section slider:
  - [x] `src/components/HomepageSlidesSection.jsx`
  - [x] integrate into `src/app/page.js`
- [ ] 7. Run critical-path testing and fix issues

# TODO - Modernisasi Konfirmasi Tutup Form Berita

- [x] 1. Tambah state kontrol modal konfirmasi tutup form di `src/components/admin/AdminBeritaManager.jsx`
- [x] 2. Ganti `window.confirm` pada `handleCloseForm()` menjadi alur modal modern
- [x] 3. Tambah komponen modal konfirmasi “Perubahan belum disimpan” dengan style konsisten (light/dark)
- [x] 4. Hubungkan aksi tombol modal:
  - [x] batal / lanjut edit (modal tertutup, form tetap)
  - [x] konfirmasi tutup (form ditutup dan perubahan dibuang)
- [ ] 5. Verifikasi alur UI secara fungsional

# TODO - Smooth Transition Slider Beranda

- [x] 1. Refactor render gambar slider di `src/components/HomepageSlidesSection.jsx` ke layered slide
- [x] 2. Tambahkan animasi transisi halus (opacity + timing + easing) antar slide
- [x] 3. Tambahkan subtle zoom/transform pada slide aktif agar perpindahan lebih lembut
- [x] 4. Pastikan autoplay, tombol prev/next, dan dot indicator tetap sinkron
- [ ] 5. Verifikasi visual perpindahan slider pada UI

# TODO - Optimasi Performa Refresh Slider Beranda

- [ ] 1. Ganti strategi render slider jadi single active image (hindari render semua slide sekaligus)
- [ ] 2. Pertahankan transisi halus dengan pendekatan ringan (fade overlay / fade image)
- [ ] 3. Tambahkan optimasi loading gambar (decoding async, fetchPriority tepat, preload terbatas)
- [ ] 4. Kurangi efek visual berat agar refresh awal terasa lebih smooth
- [ ] 5. Verifikasi performa visual setelah refresh halaman beranda
