# ✅ Checklist Minggu 4 — Testing Final, Deployment & Demo
**Periode**: 12–20 Desember 2026

> **Prasyarat**: MVP live di EC2, semua fitur utama berjalan ✅

---

## 👤 Ferdian (AIFS) — System Integration Testing (SIT) & Final Deployment

### System Integration Testing
- [ ] Jalankan Postman E2E collection lengkap di environment production
  - [ ] Auth flow: register → login → refresh → logout
  - [ ] Protected routes: semua endpoint analytics menolak request tanpa token
  - [ ] Filter: `GET /reviews/summary?aspect=rasa` → data terfilter
  - [ ] Benchmarking: `GET /competitors/benchmarking` → semua kompetitor ada
  - [ ] AI Insights: `POST /ai/insights` → response valid
  - [ ] Cache: request AI kedua < 100ms
- [ ] Test CORS: request dari origin frontend → header CORS benar
- [ ] Test PM2 restart: `pm2 restart lintang-api` → API kembali online dalam < 5 detik
- [ ] Test EC2 reboot: `sudo reboot` → semua service autostart (PM2 startup terkonfigurasi)
- [ ] Verifikasi data RDS persisten setelah reboot EC2

### Final Deployment Production
- [ ] Pastikan semua secret di `.env` menggunakan nilai production (bukan development)
- [ ] `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY` minimal 32 karakter random
- [ ] Semua `console.log` debugging dihapus atau di-disable
- [ ] Nginx dikonfigurasi dengan benar (reverse proxy + serve frontend)
- [ ] PM2 `ecosystem.config.js` dengan `NODE_ENV=production`
- [ ] Jalankan `pm2 save` dan `pm2 startup` untuk autostart

### Demo Preparation
- [ ] Test akses dari berbagai browser (Chrome, Firefox, Safari mobile)
- [ ] Siapkan akun demo: `username: demo_lintang`, `password: demo123`
- [ ] Pastikan data ulasan cukup menarik untuk demo (tidak semua positif/negatif)
- [ ] Screenshot / screen recording fitur utama untuk backup jika koneksi bermasalah

## 👤 Ahmad Ghilman (AIFS) — Bug Fix & API Optimization

- [ ] Review semua error handling — pastikan pesan error user-friendly
- [ ] Validasi semua endpoint mengembalikan format JSON konsisten
- [ ] Pastikan semua endpoint yang butuh auth sudah gunakan `authMiddleware`
- [ ] Optimasi query PostgreSQL yang lambat (tambah EXPLAIN ANALYZE jika perlu)
- [ ] Cek potensi SQL injection — pastikan semua query pakai parameterized query
- [ ] Review dan finalisasi dokumentasi API
- [ ] Update `README.md` backend dengan cara menjalankan lokal dan production

## 👤 Panji Arya Maulana (AIFS) — UI Polish & User Manual

### UI/UX Fixes
- [ ] Review semua halaman di mobile — tidak ada overflow/layout break
- [ ] Semua loading state (skeleton/spinner) tampil dengan benar
- [ ] Error state tampil dengan pesan yang jelas dan tombol retry jika perlu
- [ ] Form validation error ditampilkan inline (bukan hanya alert)
- [ ] Semua teks UI menggunakan terjemahan dari `LocaleContext` (tidak hardcode)
- [ ] Toggle bahasa ID/EN berfungsi untuk semua teks

### User Manual
- [ ] Buat dokumen `docs/user-manual.md` dengan panduan:
  - Cara mengakses dashboard
  - Cara menggunakan filter aspek dan tanggal
  - Cara membaca chart sentimen
  - Cara menggunakan fitur AI Strategy Generator
  - Cara membaca halaman Competitor Benchmarking
- [ ] Tambahkan screenshot untuk setiap langkah
- [ ] Review bersama Pak Nawayoga sebelum demo

## 👤 Annisa & Yanaka (DS) — Validasi Data & Dokumentasi

- [ ] Validasi akhir: jumlah ulasan per bisnis sesuai target
- [ ] Pastikan semua kolom aspek tidak ada yang salah label
- [ ] Siapkan data dictionary final (penjelasan setiap kolom tabel)
- [ ] Finalisasi laporan temuan bisnis:
  - Aspek mana yang paling banyak dikeluhkan?
  - Kompetitor mana yang paling unggul di aspek tertentu?
  - Rekomendasi strategis berdasarkan analisis data
- [ ] Siapkan penjelasan untuk README: proses scraping + cleaning

## 👤 Sabilah (AI) — Model Testing & Dokumentasi

- [ ] Pengujian edge case model:
  - Input sangat pendek ("Enak")
  - Input bahasa campuran (Jawa-Indonesia)
  - Input tanpa aspek jelas
  - Input negatif ekstrem
- [ ] Verifikasi AI insights konsisten untuk query yang sama (cache berfungsi)
- [ ] Test skenario Gemini rate limit → error 503 ditangani
- [ ] Finalisasi `ml-service/README.md`:
  - Cara menjalankan FastAPI
  - Arsitektur model
  - F1-score final
  - Cara mengganti model (jika perlu update)
- [ ] Dokumentasi endpoint FastAPI di Swagger UI (`/docs`)

---

## 🎤 Persiapan Demo — Pak Nawayoga (20 Des 2026)

### Skenario Demo (urutan disarankan)

1. **Login** (30 detik)
   - Buka URL dashboard
   - Login dengan akun demo
   - Redirect ke dashboard

2. **Dashboard Overview** (1 menit)
   - Tunjukkan metric cards (total ulasan, % positif, % negatif)
   - Jelaskan chart donut dan bar chart aspek

3. **Filter Interaktif** (1 menit)
   - Filter aspek "Pelayanan" → chart berubah
   - Filter rentang waktu → data berubah
   - Jelaskan URL berubah (useSearchParams)

4. **AI Strategy Generator** (2 menit)
   - Klik tombol "Generate Strategi AI"
   - Tunggu respons Gemini
   - Baca ringkasan eksekutif dan rekomendasi

5. **Competitor Benchmarking** (1 menit)
   - Pindah ke tab Benchmarking
   - Tunjukkan perbandingan side-by-side
   - Jelaskan mengapa kompetitor dengan rating lebih rendah bisa unggul di aspek tertentu

6. **Q&A** (bebas)

---

## 📋 Deliverables Final

| Deliverable | Penanggung Jawab | Status |
|-------------|-----------------|--------|
| Postman E2E Collection — semua test lulus | Ferdian | ⬜ |
| Application live & stable di EC2 production | Ferdian | ⬜ |
| Bug fix semua endpoint | Ahmad | ⬜ |
| UI polish + responsif mobile | Panji | ⬜ |
| User manual lengkap dengan screenshot | Panji | ⬜ |
| Dataset final di PostgreSQL + data dictionary | Annisa + Yanaka | ⬜ |
| Laporan temuan bisnis | Yanaka | ⬜ |
| Model dokumentasi + F1-score final | Sabilah | ⬜ |
| README root yang komprehensif | Ferdian | ⬜ |
| **DEMO SUKSES kepada Pak Nawayoga** | **Semua Tim** | ⬜ |
