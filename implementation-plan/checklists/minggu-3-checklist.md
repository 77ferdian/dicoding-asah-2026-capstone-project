# ✅ Checklist Minggu 3 — Integrasi Sistem & MVP
**Periode**: 5–11 Desember 2026

> **Prasyarat**: Backend auth berjalan, Frontend mock selesai, FastAPI `/predict` jalan ✅

---

## 👤 Ahmad Ghilman (AIFS) — Backend Core Analytics & AI Integration

### Endpoint Reviews
- [ ] Implementasi `GET /reviews/summary` dengan filter `aspect`, `startDate`, `endDate`
- [ ] `ReviewsRepository.getSummary()` — query PostgreSQL dengan WHERE dinamis
- [ ] Hitung `positivePercentage` dan `aspectBreakdown` di repository
- [ ] Test: request dengan semua filter kombinasi
- [ ] Test: request tanpa filter → semua data Lintang Bakso

### Endpoint Competitors Benchmarking
- [ ] Implementasi `GET /competitors/benchmarking`
- [ ] `CompetitorsRepository.getBenchmarking()` — join `businesses` + aggregate `reviews`
- [ ] Response berisi `mainBusiness` + `competitors[]` dengan lokasi
- [ ] Test: response sesuai kontrak API

### Integrasi AI Insights
- [ ] Implementasi `POST /ai/insights`
- [ ] `AiService.generateInsights()` — RAG flow lengkap
  - [ ] Cek cache `ai_cache` → return jika hit
  - [ ] Query konteks ulasan dari PostgreSQL (max 50 baris)
  - [ ] Build prompt terstruktur dengan konteks
  - [ ] Call Gemini API → parse JSON response
  - [ ] Simpan ke `ai_cache` (TTL 1 jam)
- [ ] Error handling: Gemini rate limit → 503 dengan pesan jelas
- [ ] Test: generate insights untuk setiap aspek
- [ ] Test: request kedua pada query sama → response dari cache (< 100ms)

### Integrasi FastAPI ML Client
- [ ] Implementasi `MlClient.js` dengan `predictSentiment()` + `checkMlHealth()`
- [ ] Endpoint `GET /health` yang cek status FastAPI
- [ ] Error graceful jika FastAPI down

## 👤 Panji Arya Maulana (AIFS) — Frontend API Integration

### Integrasi Dashboard dengan Backend
- [ ] Ganti mock data `DashboardPage.jsx` dengan `api.get('/reviews/summary')`
- [ ] Axios interceptor: inject `accessToken` ke setiap request
- [ ] Axios interceptor: auto-refresh token jika 401
- [ ] Error state handling (tampilkan pesan error ke user)
- [ ] Loading skeleton saat fetching data

### Filter Aspek + Waktu (URL-Driven)
- [ ] Filter dropdown aspek → update URL `?aspect=rasa`
- [ ] Date picker → update URL `?startDate=...&endDate=...`
- [ ] Charts diperbarui otomatis saat URL param berubah
- [ ] Clear filter button → hapus semua params dari URL

### Integrasi AI Insights Panel
- [ ] `InsightPanel.jsx` — tombol "Generate Strategi AI" aktif
- [ ] Loading state saat request POST /ai/insights berlangsung
- [ ] Tampilkan `executiveSummary` + `actionableRecommendations`
- [ ] Error state jika AI gagal

### Tab Competitor Benchmarking
- [ ] `BenchmarkingPage.jsx` → fetch `GET /competitors/benchmarking`
- [ ] Kartu side-by-side Lintang Bakso vs kompetitor
- [ ] `CompetitorBarChart.jsx` dengan data nyata dari API
- [ ] Tampilkan koordinat/alamat kompetitor

### Responsif & UX
- [ ] Test di viewport mobile 375px (iPhone SE)
- [ ] Test di viewport tablet 768px
- [ ] Test di viewport desktop 1280px
- [ ] Navbar mobile-friendly (hamburger menu jika perlu)

## 👤 Ferdian (AIFS) — Deployment MVP ke Cloud

- [ ] Launch EC2 instance (t2.micro atau t3.small, Ubuntu 22.04)
- [ ] Konfigurasi Security Groups (web-app-sg + database-sg)
- [ ] Install Node.js 20, PM2, Python 3.11, Nginx di EC2
- [ ] Clone repo ke EC2
- [ ] Setup `.env` production di EC2
- [ ] Jalankan backend via PM2 (`pm2 start ecosystem.config.js --env production`)
- [ ] Deploy FastAPI ML service via PM2
- [ ] Build frontend dan serve via Nginx
- [ ] Test akses API dari luar EC2 via public IP
- [ ] Test end-to-end flow dari browser → login → dashboard → AI insights

## 👤 Annisa & Yanaka (DS) — Data ke PostgreSQL

- [ ] Import data reviews bersih ke tabel `reviews` PostgreSQL RDS
- [ ] Verifikasi data: jumlah baris, tidak ada NULL yang tidak wajar
- [ ] Import data lokasi kompetitor ke tabel `businesses`
- [ ] Siapkan data sample benchmarking (semua kompetitor punya reviews)
- [ ] Susun laporan temuan EDA: insight bisnis utama dari data

## 👤 Sabilah (AI) — Integrasi Model & Testing

- [ ] Deploy FastAPI ke EC2 (atau container di EC2 yang sama)
- [ ] Test endpoint `/predict` di environment production
- [ ] Jalankan prediksi batch pada dataset test → catat F1-score final
- [ ] Verifikasi caching AI berjalan (request kedua < 100ms)
- [ ] Test skenario rate limit Gemini → error 503 ditangani dengan baik
- [ ] Dokumentasikan F1-score final di README

---

## 📋 Deliverables Akhir Minggu 3 (MVP)

| Deliverable | Penanggung Jawab | Status |
|-------------|-----------------|--------|
| `GET /reviews/summary` dengan filter berjalan | Ahmad | ⬜ |
| `GET /competitors/benchmarking` berjalan | Ahmad | ⬜ |
| `POST /ai/insights` dengan RAG + cache berjalan | Ahmad + Sabilah | ⬜ |
| Frontend terintegrasi penuh dengan backend | Panji | ⬜ |
| Filter URL `?aspect=rasa` memperbarui chart | Panji | ⬜ |
| AI Insights panel berfungsi end-to-end | Panji + Ahmad | ⬜ |
| MVP live di EC2 (accessible via public IP) | Ferdian | ⬜ |
| Data ulasan lengkap di PostgreSQL RDS | Annisa + Yanaka | ⬜ |
| F1-score model terdokumentasi (target ≥ 0.80) | Sabilah | ⬜ |

---

> 🎯 **MVP Acceptance Criteria**: User bisa login, lihat dashboard, filter aspek, dan generate AI insights dari browser di URL publik EC2.
