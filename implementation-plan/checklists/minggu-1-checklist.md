# ✅ Checklist Minggu 1 — Setup & Perancangan Kontrak
**Periode**: 20–26 November 2026

---

## 👤 Ferdian (AIFS) — Repo & Infrastructure Setup

- [ ] Buat organisasi / repo GitHub `A26-CS065/lintang-bakso`
- [ ] Setup branch protection: `main` (production), `develop` (staging)
- [ ] Buat `.gitignore` yang mengecualikan `.env`, `node_modules/`, `__pycache__/`
- [ ] Tambahkan `README.md` root dengan gambaran proyek
- [ ] Daftarkan akun AWS (Free Tier) — EC2 + RDS
- [ ] Buat AWS RDS PostgreSQL instance (`lintang_bakso_db`)
- [ ] Test koneksi RDS dari lokal via psql
- [ ] Simpan credential RDS di `.env.example` (tanpa nilai asli)
- [ ] Buat database dan jalankan `001_init_schema.sql`

## 👤 Ahmad Ghilman (AIFS) — Backend Contract & Scaffolding

- [ ] Buat dokumen kontrak API (endpoint, request/response, kode error)
- [ ] Review dan finalisasi dengan tim → semua setuju sebelum lanjut
- [ ] `npm init` di folder `backend/`
- [ ] Install dependencies: express, pg, bcrypt, jsonwebtoken, joi, cors, dotenv
- [ ] Buat struktur folder modular (`src/services/`, `src/middlewares/`, dll.)
- [ ] Implementasi `server.js` dengan semua route terdaftar
- [ ] Implementasi exception classes (`ClientError`, `InvariantError`, dll.)
- [ ] Implementasi `errorHandler.js` global
- [ ] Implementasi `dbPool.js` dan test koneksi PostgreSQL
- [ ] Test API dengan Postman (endpoint dasar `GET /` → 200 OK)

## 👤 Panji Arya Maulana (AIFS) — Frontend Mockup & Scaffolding

- [ ] Buat mockup low-fidelity dashboard (Figma / kertas):
  - [ ] Halaman Login
  - [ ] Halaman Dashboard (metric cards + charts + filter)
  - [ ] Tab Competitor Benchmarking
- [ ] Mockup disetujui tim sebelum Minggu 2
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install: react-router-dom, axios, recharts, react-icons, tailwindcss
- [ ] Setup Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
- [ ] Buat struktur folder (`pages/`, `components/`, `contexts/`, `utils/`)
- [ ] Implementasi `App.jsx` dengan routing dasar
- [ ] Implementasi `LocaleContext.jsx` dengan i18n ID/EN
- [ ] Buat halaman placeholder untuk Login, Dashboard, Benchmarking

## 👤 Annisa Ramadhani (DS) — Data Scraping

- [ ] Setup tools scraping (Selenium / playwright / library pihak ketiga)
- [ ] Scraping ulasan Google Maps Lintang Bakso (target: 300+ ulasan)
- [ ] Scraping ulasan Google Maps 3–5 kompetitor
- [ ] Scraping koordinat lokasi (lat, lng) semua bisnis
- [ ] Anonimisasi nama reviewer (ganti dengan `Reviewer_001`, `Reviewer_002`, dll.)
- [ ] Export data mentah ke CSV/Excel
- [ ] Review data bersama Yanaka untuk memastikan kualitas

## 👤 Yanaka Sofia Pardede (DS) — EDA & Pertanyaan Bisnis

- [ ] Rumuskan minimal 5 pertanyaan bisnis yang ingin dijawab sistem
- [ ] EDA awal dari data scraping Annisa
- [ ] Identifikasi distribusi sentimen awal (manual / simple regex)
- [ ] Rancang format pelabelan sentimen + aspek untuk Minggu 2
- [ ] Siapkan panduan pelabelan (labelbook) untuk konsistensi

## 👤 Sabilah Amiruddin (AI) — Model Exploration

- [ ] Riset model ABSA Bahasa Indonesia (IndoBERT, mBERT, XLM-R)
- [ ] Setup environment Python (`venv`, requirements.txt awal)
- [ ] Eksplorasi dataset publik ABSA Bahasa Indonesia sebagai pre-training
- [ ] Rancang format input/output model → sesuaikan dengan kontrak API Ahmad
- [ ] Diskusi dengan Ahmad: format JSON `/predict` endpoint
- [ ] Rancang prompt engineering awal untuk GenAI fallback

---

## 📋 Deliverables Akhir Minggu 1

| Deliverable | Penanggung Jawab | Status |
|-------------|-----------------|--------|
| Repo GitHub dengan struktur folder | Ferdian | ⬜ |
| AWS RDS terhubung & schema jalan | Ferdian | ⬜ |
| Dokumen kontrak API (disetujui tim) | Ahmad Ghilman | ⬜ |
| Kerangka backend Express.js | Ahmad Ghilman | ⬜ |
| Mockup low-fi (3 halaman) | Panji | ⬜ |
| Kerangka frontend React Vite | Panji | ⬜ |
| Data CSV ulasan mentah (3+ bisnis) | Annisa | ⬜ |
| Dokumen pertanyaan bisnis + EDA awal | Yanaka | ⬜ |
| Rencana model ABSA + format API | Sabilah | ⬜ |

---

> ⚠️ Jika ada yang belum selesai di Minggu 1, lanjutkan di awal Minggu 2 sebelum mulai task baru.
