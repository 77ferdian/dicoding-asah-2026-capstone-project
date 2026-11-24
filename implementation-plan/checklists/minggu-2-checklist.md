# ✅ Checklist Minggu 2 — Pengembangan Modul & Model ML
**Periode**: 27 November – 4 Desember 2026

> **Prasyarat**: Semua deliverables Minggu 1 sudah selesai ✅

---

## 👤 Ahmad Ghilman (AIFS) — Backend Auth & Core Endpoints

### Autentikasi
- [ ] Implementasi `POST /users` dengan validasi Joi
- [ ] Implementasi `UsersRepository.addUser()` + `bcrypt.hash(password, 10)`
- [ ] Implementasi `verifyUsername()` untuk cek duplikat
- [ ] Implementasi `POST /authentications` (login)
- [ ] `AuthRepository.verifyCredentials()` menggunakan `bcrypt.compare()`
- [ ] Generate `accessToken` (15 menit) + `refreshToken` via `tokenManager.js`
- [ ] Simpan `refreshToken` ke tabel `authentications`
- [ ] Implementasi `PUT /authentications` (refresh token)
- [ ] Implementasi `DELETE /authentications` (logout) → hapus dari DB

### Middleware & Auth Guard
- [ ] Implementasi `authMiddleware.js` (verify JWT Bearer)
- [ ] Test: request tanpa token → 401
- [ ] Test: token expired → 401
- [ ] Test: token valid → `req.userId` terisi
- [ ] Setup CORS untuk izinkan origin frontend

### Testing Postman
- [ ] Import collection Postman
- [ ] Test skenario registrasi user baru → 201
- [ ] Test skenario login → 201 + tokens
- [ ] Test skenario duplicate username → 400
- [ ] Test skenario password salah → 400
- [ ] Test refresh token → 200 + accessToken baru
- [ ] Test logout → 200 + token dihapus dari DB

## 👤 Panji Arya Maulana (AIFS) — Frontend Core UI

### Halaman Login
- [ ] Form login dengan controlled components (`useState`)
- [ ] Submit → `POST /authentications` via axios
- [ ] Simpan token ke `localStorage` via `auth.js`
- [ ] Redirect ke `/` setelah login berhasil (`useNavigate`)
- [ ] Loading state pada tombol submit
- [ ] Error handling (tampilkan pesan error dari API)
- [ ] Validasi frontend: username dan password tidak boleh kosong

### Halaman Dashboard (dengan Mock Data)
- [ ] Layout responsif (grid 3 kolom untuk MetricCard, 2 kolom untuk charts)
- [ ] `MetricCard.jsx` — total ulasan, % positif, % negatif
- [ ] `SentimentDonutChart.jsx` menggunakan Recharts (dengan data mock)
- [ ] `AspectBarChart.jsx` untuk 4 aspek (dengan data mock)
- [ ] `FilterBar.jsx` — dropdown aspek + date picker
- [ ] Filter terhubung ke URL `?aspect=rasa&startDate=...` via `useSearchParams`
- [ ] `LoadingSkeleton.jsx` tampil saat loading

### Halaman Benchmarking (dengan Mock Data)
- [ ] Tabel/kartu perbandingan Lintang Bakso vs kompetitor
- [ ] `CompetitorBarChart.jsx` — bar chart horizontal perbandingan
- [ ] Tampilkan data lokasi kompetitor (lat, lng, alamat)

### Komponen Global
- [ ] `Navbar.jsx` dengan link navigasi Dashboard / Benchmarking
- [ ] Tombol toggle bahasa (ID/EN) menggunakan `LocaleContext`
- [ ] Tombol logout → `clearTokens()` + redirect `/login`
- [ ] `InsightPanel.jsx` placeholder (tombol disabled)

## 👤 Ferdian (AIFS) — Database & Testing

- [ ] Test koneksi persisten dari backend ke AWS RDS (bukan hanya sekali)
- [ ] Pastikan `pg.Pool` reconnect otomatis jika koneksi putus
- [ ] Jalankan seed data businesses (`001_seed_businesses.sql`)
- [ ] Import sample data ulasan untuk testing (10–20 baris)
- [ ] Verifikasi seluruh query di `ReviewsRepository` jalan dengan data sample
- [ ] Update file `.env.example` dengan semua variabel terbaru
- [ ] Pastikan `.gitignore` sudah benar (`.env` tidak ter-commit)

## 👤 Annisa Ramadhani (DS) — Data Cleaning

- [ ] Data cleaning final dari CSV scraping Minggu 1
- [ ] Hapus duplikat ulasan
- [ ] Normalisasi tanggal ke format YYYY-MM-DD
- [ ] Pastikan kolom reviewer sudah dianonimisasi semua
- [ ] Ekspor dataset bersih ke `data/reviews_cleaned.csv`
- [ ] Siapkan dictionary data (penjelasan setiap kolom)

## 👤 Yanaka Sofia Pardede (DS) — Labeling & EDA

- [ ] Sampling 200–300 ulasan untuk pelabelan manual
- [ ] Labeling sentimen (positif/negatif) per ulasan
- [ ] Labeling aspek (rasa/harga/pelayanan/tempat) jika disebutkan
- [ ] Pastikan konsistensi label dengan panduan dari Minggu 1
- [ ] Split dataset: 80% train, 20% test (tidak ada data leakage)
- [ ] EDA lanjutan: distribusi aspek, kata-kata paling sering per sentimen

## 👤 Sabilah Amiruddin (AI) — Model Training

- [ ] Fine-tune minimal 1 model ABSA (IndoBERT atau mBERT)
- [ ] Training dengan data berlabel dari Yanaka
- [ ] Evaluasi model dengan F1-score pada data test
- [ ] Bandingkan minimal 2 konfigurasi/model
- [ ] Dokumentasikan F1-score di `ml-service/README.md`
- [ ] Buat `ml-service/main.py` dengan endpoint `/predict` dan `/health`
- [ ] Test FastAPI local: `uvicorn main:app --reload`
- [ ] Test endpoint `/predict` dengan beberapa contoh ulasan

---

## 📋 Deliverables Akhir Minggu 2

| Deliverable | Penanggung Jawab | Status |
|-------------|-----------------|--------|
| Backend auth endpoints berjalan (POST /users, POST/PUT/DELETE /authentications) | Ahmad Ghilman | ⬜ |
| Postman collection test auth lulus semua | Ahmad Ghilman | ⬜ |
| Frontend halaman Login + Dashboard mock | Panji | ⬜ |
| Filter URL `useSearchParams` berfungsi | Panji | ⬜ |
| Data ulasan bersih di CSV | Annisa | ⬜ |
| Dataset berlabel 200+ baris | Yanaka | ⬜ |
| FastAPI `/predict` endpoint berjalan | Sabilah | ⬜ |
| F1-score model terdokumentasi | Sabilah | ⬜ |
