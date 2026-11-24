# PRD: Platform Analisis Kepuasan Pelanggan & Daya Saing Bisnis "Lintang Bakso" (Spesifikasi AI Full-Stack)

Dokumen Spesifikasi Persyaratan Produk (*Product Requirement Document* / PRD) ini disusun sebagai acuan teknis dan operasional komprehensif bagi pengerjaan proyek *Capstone* tim **A26-CS065** pada program Asah 2026 (led by Dicoding, supported by GoTo). PRD ini secara khusus dirancang untuk mengintegrasikan seluruh kurikulum pembelajaran *full-stack web development* (React.js, Node.js/Express.js, PostgreSQL/AWS RDS, JWT, RESTful API, Postman E2E Testing) dengan kapabilitas *Artificial Intelligence* modern (Machine Learning, Natural Language Processing, dan Large Language Model / RAG).

---

## 1. Pendahuluan & Identifikasi Proyek

### 1.1 Profil Proyek & Mitra UMKM
Berdasarkan dokumen perencanaan proyek *Capstone*, berikut adalah identitas resmi proyek:
* **ID Tim Capstone**: A26-CS065
* **Nama Mitra UMKM**: Lintang Bakso
* **Bidang Usaha**: Kuliner / Food & Beverage (F&B)
* **Lokasi Usaha**: Surabaya, Jawa Timur
* **Judul Use Case**: Pemetaan Kepuasan Pelanggan dan Daya Saing Bisnis Lintang Bakso Berdasarkan Ulasan Digital

### 1.2 Latar Belakang & Pernyataan Masalah (*Problem Statement*)
Lintang Bakso merupakan usaha kuliner di Surabaya yang menghadapi tantangan nyata dalam mengevaluasi kepuasan pelanggan dan menganalisis daya saing produk terhadap kompetitor di wilayah geografis sekitarnya. Meskipun usaha telah menggunakan sistem *Point of Sale* (POS) untuk pengelolaan transaksi kasir, pemilik usaha tetap menemui kendala kritis dalam memahami persepsi pasar secara makro.

Masalah utama yang dihadapi oleh pemilik UMKM meliputi:
1. **Ketidakpastian Penyebab Daya Saing**: Pemilik kesulitan memahami alasan mengapa kompetitor tertentu lebih ramai dikunjungi meskipun memiliki *rating* keseluruhan di Google Maps yang lebih rendah dibanding Lintang Bakso.
2. **Keterbatasan Analisis Manual**: Mengurutkan, membaca, dan mengelompokkan ulasan digital pelanggan satu per satu secara manual membutuhkan waktu yang sangat lama dan berpotensi menghasilkan penilaian yang tidak objektif.
3. **Ketiadaan Rekomendasi Terarah**: Data ulasan mentah tidak memberikan petunjuk tindakan operasional yang konkret tanpa adanya sintesis data otomatis berbasis kecerdasan buatan.

### 1.3 Solusi Produk & Proposisi Nilai (*Value Proposition*)
Solusi yang dibangun adalah sebuah **Web Analytics Dashboard Interaktif Berbasis AI** yang dirancang khusus untuk pemilik UMKM Lintang Bakso. Solusi ini secara otomatis menarik ulasan digital Google Maps dari Lintang Bakso serta 3–5 bisnis kompetitor, mengklasifikasikan sentimen pelanggan (positif dan negatif) pada 4 aspek utama (*Rasa*, *Harga*, *Pelayanan*, dan *Tempat/Lokasi*), serta menyajikan ringkasan eksekutif dan rekomendasi strategi bisnis otomatis berbasis *Generative AI / Large Language Model* (LLM) dengan pendekatan *Retrieval-Augmented Generation* (RAG).

### 1.4 Susunan Tim & Pembagian Peran Lintas Disiplin
Sesuai kesepakatan internal tim A26-CS065, pengerjaan proyek dibagi ke dalam 6 anggota dengan tanggung jawab yang saling terintegrasi:
* **Ferdian** (*AI Full-Stack Developer*) — Penanggung jawab repositori GitHub, koneksi database persisten, pengelolaan berkas `.env`, pengujian otomatis Postman, *System Integration Testing* (SIT), *deployment* final ke PaaS/AWS EC2, serta koordinasi demo produk dengan Pak Nawayoga.
* **Ahmad Ghilman** (*AI Full-Stack Developer*) — Penanggung jawab perancangan kontrak API RESTful, pembangunan backend Express.js, skema autentikasi/otorisasi JWT & bcrypt, perbaikan bug backend, serta integrasi database AWS RDS.
* **Panji Arya Maulana** (*AI Full-Stack Developer*) — Penanggung jawab perancangan *low-fidelity mockup* UI, pengembangan frontend SPA menggunakan React.js, integrasi grafik visualisasi, penyaringan *query parameters*, tampilan responsif seluler, dan penyusunan *user manual*.
* **Annisa Ramadhani** (*Data Science Specialist*) — Penanggung jawab *data scraping batch* ulasan Google Maps & lokasi kompetitor, anonimisasi identitas reviewer, *data wrangling*, serta penyiapan database awal.
* **Yanaka Sofia Pardede** (*Data Science Specialist*) — Penanggung jawab perumusan pertanyaan bisnis, *Exploratory Data Analysis* (EDA), pelabelan sampel sentimen/aspek, serta penyusunan laporan temuan analisis bisnis.
* **Sabilah Amiruddin** (*Next-Gen AI Engineer*) — Penanggung jawab eksplorasi model NLP (IndoBERT/ABSA), pembuatan REST API *serving* model ML via FastAPI, perancangan *prompt engineering* GenAI/RAG, penanganan *rate limit*, dan dokumentasi API model AI.

---

## 2. Target Pengguna & Alur Kerja Utama (*Use Case Workflows*)

### 2.1 Persona Pengguna
Target pengguna utama aplikasi ini adalah **Pemilik / Pengelola UMKM Lintang Bakso**. Pengguna membutuhkan antarmuka web yang bersih, intuitif, mudah diakses melalui perangkat seluler maupun desktop, serta mampu menyajikan analisis bisnis mendalam tanpa menuntut pemahaman teknis mengenai pemrograman atau statistik.

### 2.2 Alur Kerja Utama Aplikasi (*End-to-End User Flow*)
Sebagaimana dirumuskan dalam *Project Plan*, alur penggunaan aplikasi berjalan sebagai berikut:
1. **Autentikasi Pengguna**: Pemilik UMKM mengakses URL *dashboard* web dan melakukan *login* menggunakan akun terdaftar (`POST /authentications`) untuk melindungi kerahasiaan data analisis bisnis.
2. **Visualisasi Ringkasan Sentimen**: Sistem menampilkan halaman utama yang berisi kartu metrik (*metric cards*) total ulasan, persentase sentimen positif dan negatif, serta grafik distribusi sentimen Lintang Bakso dan kompetitor.
3. **Penerapan Filter Interaktif**: Pemilik usaha memilih filter aspek/topik tertentu (*Rasa*, *Harga*, *Pelayanan*, *Tempat/Lokasi*), kategori kompetitor, atau rentang waktu ulasan.
4. **Sintesis Insights Berbasis GenAI/RAG**: Pemilik dapat meminta rekomendasi strategi bisnis berbasis kecerdasan buatan. Server secara *real-time* (24/7 untuk permintaan inferensi AI) mengirimkan konteks ulasan terfilter ke engine LLM untuk menghasilkan ringkasan eksekutif dan rekomendasi tindakan operasional.
5. **Eksplorasi Benchmarking Kompetitor**: Pemilik membuka tab khusus *Competitor Benchmarking* untuk menganalisis perbandingan performa berdampingan (*side-by-side*) terhadap 3–5 kompetitor beserta data lokasi geografisnya.

---

## 3. Arsitektur Sistem AI Full-Stack & Integrasi Layer

Sistem dibangun menggunakan arsitektur terpisah (*decoupled full-stack architecture*) di mana *frontend web*, *backend server*, *database*, dan *service model AI* berkomunikasi melalui API terstandarisasi.

```text
[ React.js SPA Dashboard ] (Vite / React Router v6 / Context API)
           │
           │ HTTP REST API (JSON + Bearer JWT Token)
           ▼
[ Express.js Backend Server ] (Node.js / PM2 / AWS EC2 Ubuntu)
      │               │
      │ SQL Queries   │ HTTP REST Request
      ▼               ▼
[ AWS RDS PostgreSQL ]  [ FastAPI Model Serving & LLM Engine ] (Python / Gemini API)
```

### 3.1 Spesifikasi Lapisan Frontend (*Client Layer*)
* **Framework & Build Tool**: React.js (v18/v19) yang dikompilasi menggunakan Vite untuk performa *build* dan *hot-reloading* yang responsif.
* **Routing & SPA**: `react-router-dom` v6 menggunakan `<BrowserRouter>`, `<Routes>`, `<Route>`, dan `<Link>` untuk navigasi antarhalaman tanpa *page reload*.
* **Dynamic Parameters & Navigation**:
  * `useSearchParams()` untuk menghubungkan input pencarian dan filter aspek langsung ke *query parameters* URL (`?keyword=rasa&aspect=pelayanan`).
  * `useNavigate()` untuk pengalihan halaman secara terprogram pasca-aksi (seperti alur *login* atau *logout*).
  * *Functional Wrapper Pattern* jika terdapat komponen berbasis Class Component untuk mengekstrak React Router Hooks.
* **State Management Global & Local**:
  * React Context API (`LocaleContext`) untuk pengelolaan bahasa antarmuka (Bahasa Indonesia & Inggris) dan preferensi tema.
  * Membalut objek `value` pada Context Provider menggunakan `useMemo()` untuk mengunci referensi memori dan mencegah *re-render* komponen anak yang tidak perlu.
  * Persistensi preferensi pengguna menggunakan `localStorage.getItem('locale')`.
* **Form Handling & Controlled Components**: Setiap form input (`<input>`, `<select>`, `<textarea>`) diikat ke *state* lokal komponen (*single source of truth*) dengan handler `onChange` dan penanganan *loading/feedback state*.
* **Validasi Runtime & Icons**:
  * Penambahan validasi `PropTypes` (`prop-types`) pada komponen yang menerima *props*.
  * Integrasi pustaka `react-icons` (`react-icons/fi` atau `react-icons/fa`) untuk ikon UI interaktif.

### 3.2 Spesifikasi Lapisan Backend (*Server Layer*)
* **Runtime & Framework**: Node.js dengan web framework Express.js yang berjalan di lingkungan server AWS EC2 Ubuntu dan dikelola menggunakan *process manager* PM2 (`pm2 start server.js --name lintang-api`).
* **Arsitektur Modular**: Pemisahan berkas kode ke dalam direktori modular berdasarkan domain tanggung jawab:
  ```text
  src/
  ├── components/       # Komponen UI Reusable (React)
  ├── contexts/         # React Context (LocaleContext)
  ├── exceptions/       # Custom Error Classes (ClientError, InvariantError, NotFoundError, AuthorizationError)
  ├── middlewares/      # Auth, Validate, & CORS Middlewares
  ├── routes/           # Central Route Definition
  ├── services/         # Domain Services (users, authentications, reviews, competitors, ai)
  │   ├── controllers/  # Request & Response Handlers
  │   ├── repositories/ # Database Queries (PostgreSQL Pool)
  │   ├── routes/       # Endpoint Route Definitions
  │   └── validator/    # Joi Validation Schemas
  └── utils/            # Helper API & Data Dictionary
  ```
* **Database Driver & Connection Pooling**: Menggunakan modul `pg` (Node-PostgreSQL) dengan `Pool` yang terhubung ke database AWS RDS PostgreSQL. Penggunaan opsi SSL `rejectUnauthorized: false` wajib diaktifkan pada lingkungan produksi (`NODE_ENV=production`).
* **Autentikasi & Keamanan**:
  * Enkripsi kata sandi pengguna menggunakan `bcrypt` dengan *salt rounds* 10 (`bcrypt.hash(password, 10)`).
  * Skema *Token-Based Authentication* berbasis **JSON Web Token** (JWT) yang memisahkan `accessToken` (masa berlaku 15 menit) dan `refreshToken` yang disimpan secara persisten di tabel `authentications` database PostgreSQL.
  * Middleware `cors` (`cors()`) untuk menangani aturan *Same-Origin Policy* pada browser.
* **Custom Exception Handling**: Penggunaan kelas error turunan khusus untuk mengembalikan pesan kesalahan yang konsisten:
  * `InvariantError` (HTTP 400 Bad Request)
  * `NotFoundError` (HTTP 404 Not Found)
  * `AuthorizationError` (HTTP 403 Forbidden)

### 3.3 Spesifikasi Lapisan AI / ML & GenAI Engine
* **Batch Google Maps Scraping Data**: Data ulasan Lintang Bakso dan 3–5 kompetitor diambil secara *batch* oleh tim DS, dibersihkan dari informasi identitas pribadi (anonimisasi nama reviewer), dan disimpan ke PostgreSQL.
* **Serving Model NLP**: Model klasifikasi sentimen (positif, negatif) dan ekstraksi aspek (Rasa, Harga, Pelayanan, Tempat) yang dilatih oleh tim DS/AI diekspos melalui REST API FastAPI.
* **GenAI / RAG Insights Engine**: Integrasi API LLM (Gemini API / Groq API) yang dipanggil oleh backend Express.js untuk mensintesis ulasan terfilter menjadi ringkasan eksekutif dan rekomendasi strategi bisnis otomatis.

---

## 4. Persyaratan Fungsional (*Functional Requirements*)

Tabel berikut merinci modul persyaratan fungsional aplikasi web yang wajib diselesaikan oleh tim AI Full-Stack:

| Kode FR | Modul / Fitur | Deskripsi Fungsionalitas | Penanggung Jawab |
| :--- | :--- | :--- | :--- |
| **FR-1** | **Autentikasi & Akses Pengguna** | Sistem menyediakan form registrasi (`POST /users`) dan login (`POST /authentications`) berbasis username/email dan password. Server mengembalikan *Access Token* JWT dan *Refresh Token*. Fitur pembaruan token (`PUT /authentications`) dan logout (`DELETE /authentications`) wajib tersedia. Seluruh rute *dashboard* bersifat tertutup (*protected route*). | **Ahmad Ghilman / AIFS** |
| **FR-2** | **Dashboard Ringkasan Sentimen** | Halaman utama menampilkan kartu metrik total ulasan, rasio sentimen positif dan negatif (2 kelas), serta grafik distribusi sentimen secara keseluruhan untuk UMKM Lintang Bakso. | **Panji Arya Maulana / AIFS** |
| **FR-3** | **Filtering Aspek & Rentang Waktu** | Pengguna dapat menyaring visualisasi data ulasan berdasarkan 4 aspek utama (*Rasa*, *Harga*, *Pelayanan*, *Tempat/Lokasi*), pilihan kompetitor, dan rentang tanggal. Transaksi filter terhubung dengan *query parameter* URL (`useSearchParams`). | **Panji Arya Maulana & Ahmad Ghilman** |
| **FR-4** | **Benchmarking Kompetitor** | Sistem menampilkan modul khusus yang membandingkan persentase sentimen Lintang Bakso secara berdampingan (*side-by-side*) dengan 3–5 kompetitor sejenis di Surabaya, dilengkapi data titik lokasi kompetitor. | **Ahmad Ghilman & Panji** |
| **FR-5** | **AI Executive Insights Generator** | Sistem menyediakan tombol "Generate AI Strategy" yang memicu integrasi GenAI/RAG (tersedia 24/7). Server backend mengambil ulasan terfilter, mengirimkan prompt terstruktur ke LLM, dan menampilkan ringkasan eksekutif serta saran taktis perbaikan bisnis. | **Sabilah Amiruddin & Ahmad** |
| **FR-6** | **Manajemen Persistence & Multibahasa** | *Frontend* menyimpan token autentikasi dan preferensi bahasa (Indonesia/Inggris) di `localStorage` dengan pembalutan `useMemo` pada Context Provider untuk mencegah *unnecessary re-render*. | **Panji Arya Maulana / AIFS** |

---

## 5. Spesifikasi Kontrak API RESTful & Integrasi AI

Seluruh komunikasi antarlapisan mematuhi standar JSON RESTful API dengan struktur respons seragam:
* Respons Sukses: `{ "status": "success", "message": "...", "data": { ... } }`
* Respons Gagal Client: `{ "status": "fail", "message": "..." }` (HTTP Status 400, 401, 403, 404)
* Respons Gagal Server: `{ "status": "error", "message": "..." }` (HTTP Status 500)

### 5.1 Endpoints Autentikasi & Pengguna

#### 1. `POST /users` (Registrasi Pengguna Baru)
* **Request Body**:
  ```json
  {
    "username": "owner_lintang",
    "password": "secret_password123",
    "fullname": "Pemilik Lintang Bakso"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "User berhasil ditambahkan",
    "data": {
      "userId": "user-A1b2C3d4E5f6"
    }
  }
  ```

#### 2. `POST /authentications` (Login & Terbit Token)
* **Request Body**:
  ```json
  {
    "username": "owner_lintang",
    "password": "secret_password123"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Authentication berhasil ditambahkan",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "refreshToken": "def456ghi789..."
    }
  }
  ```

#### 3. `PUT /authentications` (Pembaruan Access Token)
* **Request Body**:
  ```json
  {
    "refreshToken": "def456ghi789..."
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Access Token berhasil diperbarui",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6_NEW..."
    }
  }
  ```

#### 4. `DELETE /authentications` (Logout / Hapus Refresh Token)
* **Request Body**:
  ```json
  {
    "refreshToken": "def456ghi789..."
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Refresh token berhasil dihapus"
  }
  ```

---

### 5.2 Endpoints Analytics, Benchmarking & GenAI Insights

#### 1. `GET /reviews/summary` (Ringkasan Sentimen & Filter)
* **Headers**: `Authorization: Bearer <accessToken>`
* **Query Parameters**: `?aspect=rasa&startDate=2026-01-01&endDate=2026-11-20`
* **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "totalReviews": 450,
      "sentimentDistribution": {
        "positive": 315,
        "negative": 135,
        "positivePercentage": 70.0
      },
      "aspectBreakdown": {
        "rasa": { "positive": 120, "negative": 15 },
        "harga": { "positive": 80, "negative": 40 },
        "pelayanan": { "positive": 65, "negative": 50 },
        "tempat": { "positive": 50, "negative": 30 }
      }
    }
  }
  ```

#### 2. `GET /competitors/benchmarking` (Komparasi Kompetitor)
* **Headers**: `Authorization: Bearer <accessToken>`
* **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "mainBusiness": {
        "name": "Lintang Bakso",
        "rating": 4.5,
        "positivePercentage": 70.0
      },
      "competitors": [
        {
          "name": "Bakso Pak Djo",
          "rating": 4.2,
          "positivePercentage": 78.5,
          "location": { "lat": -7.2575, "lng": 112.7521 }
        },
        {
          "name": "Bakso Solo Roso",
          "rating": 4.1,
          "positivePercentage": 62.0,
          "location": { "lat": -7.2610, "lng": 112.7480 }
        }
      ]
    }
  }
  ```

#### 3. `POST /ai/insights` (Generative AI Strategy Recommendation)
* **Headers**: `Authorization: Bearer <accessToken>`
* **Request Body**:
  ```json
  {
    "aspect": "pelayanan",
    "timeRange": "last_month"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "executiveSummary": "Pelanggan Lintang Bakso secara umum sangat menyukai kualitas rasa bakso (88% positif). Namun, terjadi peningkatan keluhan pada aspek Pelayanan selama bulan terakhir (50% negatif).",
      "actionableRecommendations": [
        "Lakukan pelatihan ulang (*retraining*) staf kasir dan pelayan untuk mempercepat waktu penyajian pada jam sibuk (12.00 - 14.00).",
        "Pertimbangkan penambahan 1 orang staf paruh waktu untuk area meja saat akhir pekan.",
        "Kompetitor 'Bakso Pak Djo' memiliki nilai kepuasan pelayanan 78.5% karena mengadopsi sistem pemesanan via QR code di meja."
      ]
    }
  }
  ```

---

## 6. Persyaratan Non-Fungsional (*Non-Functional Requirements*)

### 6.1 Keamanan Sistem (*Security*)
1. **Pengaman Kredensial & Enkripsi**: Seluruh kata sandi pengguna dienkripsi menggunakan `bcrypt` sebelum disimpan ke PostgreSQL.
2. **Perlindungan Kunci API (.env)**: Kredensial sensitif (`PGUSER`, `PGPASSWORD`, `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`, `GEMINI_API_KEY`) wajib disimpan dalam berkas `.env` dan diisolasi dari repositori publik Git via `.gitignore`.
3. **Konfigurasi Firewall AWS Security Groups**:
   * **`web-app-sg`**: Membuka Custom TCP Port `5000` (atau `3000`) untuk publik (`0.0.0.0/0`) serta SSH Port `22`.
   * **`Database-SG`**: Aturan masuk (*Inbound rule*) Port PostgreSQL `5432` secara ketat **hanya mengizinkan sumber (*Source*) dari `web-app-sg`**, bukan publik (`0.0.0.0/0`).
4. **Otorisasi Resource (403 Forbidden)**: Setiap permintaan data ulasan dan pembuatan rekomendasi AI divalidasi kepemilikannya. Panggilan tanpa token yang sah mengembalikan status `401 Unauthorized`, sedangkan panggilan token yang tidak memiliki hak akses mengembalikan `403 Forbidden`.

### 6.2 Performa & Latensi (*Performance & Latency*)
1. **Caching Inferensi AI**: Hasil pembuatan ringkasan dan rekomendasi dari LLM di-cache sementara di server backend untuk mencegah *rate limit* kuota API Gemini/Groq serta mempercepat waktu respon dari rata-rata 3 detik menjadi < 100 ms untuk query yang sama.
2. **Indikator Loading & Asynchronous UI**: Antarmuka React wajib menampilkan indikator *loading* / *skeleton screen* saat melakukan *fetching* API asynchronous agar tidak membuat layar *freeze*.
3. **Optimasi Memori React**: Objek nilai pada Context Provider dibungkus dengan `useMemo()` untuk mencegah *re-render* yang tidak perlu pada hirarki komponen anak.

### 6.3 Reliabilitas & Ketersediaan (*Reliability & Availability*)
1. **Process Management (PM2)**: Aplikasi backend Express dijalankan di AWS EC2 di latar belakang menggunakan PM2 (`pm2 start server.js --name lintang-api`). PM2 dikonfigurasi untuk otomatis melakukan *restart* jika terjadi *unhandled exception* atau server reboot.
2. **Koneksi Database Robust**: Modul `pg.Pool` dikonfigurasi dengan toleransi *reconnect* dan penanganan instruksi SSL yang sesuai dengan infrastruktur AWS RDS PostgreSQL (`ssl: { rejectUnauthorized: false }`).

---

## 7. Jadwal Pengerjaan 4 Minggu (*Roadmap*) & Alokasi Peran

Berdasarkan dokumen *Project Plan*, pelaksanaan proyek terbagi secara presisi dalam 4 minggu:

```text
Minggu 1 (20-26 Nov): Setup Repositori, Batch Scraping, Kontrak API, Mockup Low-Fi Frontend
Minggu 2 (27 Nov-4 Des): Final Cleaning Data, Training Model Sentimen, Backend Auth API, Frontend Core UI
Minggu 3 (5-11 Des): Integrasi Model AI & LLM ke Backend, Integrasi Chart Frontend, E2E Flow MVP
Minggu 4 (12-20 Des): Pengujian E2E System, Perbaikan Bug, Deployment AWS EC2/RDS, Demo Pak Nawayoga
```

### Rincian Tugas Berdasarkan Anggota Tim & Minggu:

#### Minggu 1 (20 Nov – 26 Nov 2026): Inisialisasi & Perancangan Kontrak
* **Annisa Ramadhani & Yanaka Sofia Pardede (DS)**: *Scraping batch* ulasan dan lokasi Lintang Bakso serta 3–5 kompetitor, anonimisasi nama reviewer, *data wrangling* awal, perumusan pertanyaan bisnis, EDA awal, penyiapan sampel pelabelan.
* **Sabilah Amiruddin (AI)**: Eksplorasi model sentimen dan aspek (ABSA/IndoBERT), pendekatan GenAI, penentuan metrik evaluasi F1-score, penyepakatan format data dan kontrak API dengan tim DS dan AIFS.
* **Ferdian (AIFS)**: Inisialisasi repositori GitHub, pembuatan database, pendaftaran akun platform PaaS/AWS.
* **Ahmad Ghilman (AIFS)**: Penyusunan berkas kontrak API (endpoint, format request/response, kode error) dan kerangka backend Express.js.
* **Panji Arya Maulana (AIFS)**: Perancangan mockup *low-fidelity* dashboard (login, ringkasan sentimen, filter, benchmarking) dan kerangka frontend React Vite.

#### Minggu 2 (27 Nov – 4 Des 2026): Pengembangan Modul & Model ML
* **Annisa & Yanaka (DS)**: *Data cleaning* final, pembagian data latih/uji tanpa kebocoran data, pelabelan sentimen & aspek, ekspor dataset bersih dan kamus data.
* **Sabilah (AI)**: Melatih dan membandingkan minimal 2 model/konfigurasi dengan metrik F1-score, membuat REST API *serving* model ML (FastAPI), menyusun prompt terstruktur GenAI.
* **Ahmad Ghilman (AIFS)**: Pengembangan endpoint backend (`/users`, `/authentications`), validasi input Joi, login & autentikasi JWT.
* **Panji Arya Maulana (AIFS)**: Pembangunan komponen dashboard (grafik sentimen, topik, filter, halaman login) menggunakan data *mock* sesuai kontrak API.
* **Ferdian (AIFS)**: Pengujian koneksi database persisten, pengelolaan berkas `.env`, pengujian API menggunakan Postman.

#### Minggu 3 (5 Des – 11 Des 2026): Integrasi Sistem & Minimum Viable Product (MVP)
* **Annisa & Yanaka (DS)**: Memasukkan hasil sentimen dan aspek ke database PostgreSQL, penyiapan data benchmarking 3–5 kompetitor dan data lokasi, penyusunan laporan temuan dan rekomendasi bisnis.
* **Sabilah (AI)**: Integrasi API model ke backend Express dan insight GenAI, penanganan error/kuota API dan *caching*, pengujian model pada data uji dengan pencatatan F1-score di README.
* **Ahmad Ghilman (AIFS)**: Integrasi backend Express dengan API model AI dan database AWS RDS, pembuatan endpoint benchmarking.
* **Panji Arya Maulana (AIFS)**: Integrasi frontend React dengan backend Express (grafik, filter, tab *Competitor Benchmarking*, tampilan responsif ponsel, indikator loading/sukses/gagal).
* **Ferdian (AIFS)**: *Deployment* awal ke PaaS/AWS EC2 dan pengujian integrasi alur utama MVP.

#### Minggu 4 (12 Des – 20 Des 2026): Pengujian Final, Deployment & Demo
* **Annisa & Yanaka (DS)**: Validasi akhir data, finalisasi dataset, kamus data, dan penjelasan proses analisis untuk README dan *user manual*.
* **Sabilah (AI)**: Pengujian model dan insight AI (input tidak valid, kuota habis, konsistensi saran), finalisasi README model dan dokumentasi API.
* **Ferdian (AIFS)**: *System Integration Testing* (SIT), *deployment* final di AWS EC2 & RDS, pelaksanaan demo dan pengumpulan umpan balik dari Pak Nawayoga.
* **Ahmad Ghilman (AIFS)**: Perbaikan bug backend dan optimasi API.
* **Panji Arya Maulana (AIFS)**: Perbaikan UI/UX berdasarkan umpan balik pengguna dan penyusunan *user manual*.

---

## 8. Strategi Pengujian End-to-End & Mitigasi Risiko

### 8.1 Matriks Skenario Pengujian Sistem (*System Testing Matrix*)

Sesuai dengan praktik *automated testing* yang dipelajari pada modul Dicoding, pengujian sistem dilakukan secara menyeluruh menggunakan Postman E2E Test Suite dan verifikasi UI:

| Area Pengujian | Skenario Uji | Metode & Tools | Hasil yang Diharapkan | Penanggung Jawab |
| :--- | :--- | :--- | :--- | :--- |
| **CORS & Middleware** | Request `OPTIONS` dari origin *frontend* dengan header `Access-Control-Allow-Origin`. | Curl / Postman | Server mengembalikan HTTP `204 No Content` atau `200 OK` dengan header CORS aktif. | **Ahmad Ghilman & Ferdian** |
| **Autentikasi & JWT** | Registrasi user baru (`POST /users`), login (`POST /authentications`), pembaruan token (`PUT /authentications`), dan logout (`DELETE /authentications`). | Postman Collection Automated Test | Pengguna berhasil mendaftar, menerima accessToken/refreshToken, dan token terhapus dari database saat logout. | **Ahmad Ghilman / AIFS** |
| **Otorisasi (403)** | Memanggil endpoint analytics atau membuat rekomendasi AI tanpa token atau menggunakan token yang salah/kedaluwarsa. | Postman Script | Server menolak permintaan dengan kode HTTP `401 Unauthorized` atau `403 Forbidden`. | **Ahmad Ghilman / AIFS** |
| **Klasifikasi Sentimen** | Pengujian input ulasan positif dan negatif (misal: *"Baksonya enak banget tapi tempatnya panas"*). | Pipeline Test (FastAPI / Express) | Model berhasil mengklasifikasikan aspek "rasa" sebagai positif dan "tempat" sebagai negatif. | **Yanaka & Sabilah** |
| **AI Recommendation** | Memicu tombol "Generate AI Strategy" pada dashboard. | Frontend & Backend E2E Test | LLM mengembalikan ringkasan eksekutif dan rekomendasi strategi bisnis yang relevan dan terstruktur. | **Sabilah & Panji** |
| **Filter & Visualisasi** | Mengubah filter rentang waktu dan aspek pada dashboard React. | Manual UI & Integration Test | Grafik visualisasi diperbarui secara dinamis tanpa *page reload* sesuai *query parameters*. | **Panji Arya Maulana** |
| **Deployment & PM2** | Restart server EC2 atau eksekusi `pm2 restart lintang-api`. | SSH Terminal AWS EC2 | Server otomatis pulih (*online*) dan data di AWS RDS tetap tersimpan persisten. | **Ferdian / AIFS** |

---

### 8.2 Matriks Manajemen Risiko & Rencana Mitigasi (*Risk Management*)

Tabel berikut memetakan potensi hambatan teknis yang tercantum dalam *Project Plan* beserta langkah mitigasi yang disiapkan:

| Potensi Kendala & Dampak | Langkah Pencegahan Terencana | Rencana Cadangan (*Contingency Plan*) | Penanggung Jawab |
| :--- | :--- | :--- | :--- |
| **Kebocoran API Key LLM / Cloud Services**<br>*(Dampak: Pembengkakan biaya / pemblokiran akun API)* | Menyimpan API Key di berkas `.env` server, mengaktifkan pembatasan domain (*domain restriction*) dan IP whitelisting pada AWS/Gemini Console. | Mengisolasi API Key dengan kuota harian yang ketat (*rate limit*) dan melakukan pemutaran kunci (*key rotation*) secara instan. | **Ferdian / AIFS** |
| **API Generative AI Mengalami Rate Limit / Kuota Habis**<br>*(Dampak: Pembuatan ringkasan otomatis terhenti)* | Menerapkan caching pada hasil rekomendasi di PostgreSQL berdasarkan kombinasi filter aspek dan mengoptimalkan instruksi prompt. | Mengalihkan API ke provider alternatif gratisan (seperti Groq API / Gemini Free Tier) atau menggunakan template ringkasan berbasis aturan. | **Sabilah Amiruddin / AI** |
| **Kendala Integrasi Frontend dan API Backend**<br>*(Dampak: Tampilan dashboard tidak memuat data AI)* | Menyusun berkas kontrak API yang jelas di awal (Minggu 1) dan melakukan pengujian API menggunakan Postman. | Menggunakan data *mock* / dummy temporer pada frontend saat proses pengujian UI. | **Ahmad Ghilman & Panji** |
| **Struktur HTML Google Maps Berubah saat Scraping**<br>*(Dampak: Scraping ulasan gagal / data tidak lengkap)* | Menggunakan library *scraper* ter-update dan menyaring data secara bertahap. | Menggunakan dataset ulasan manual dalam bentuk CSV/Excel yang diunggah secara langsung ke database. | **Annisa Ramadhani / DS** |
| **Akurasi Model Sentimen Rendah**<br>*(Dampak: Hasil analisis tidak mencerminkan ulasan asli)* | Melakukan *preprocessing* data teks (*slang handling*) dan *fine-tuning* hyperparameter model. | Memanfaatkan *prompting* LLM (*Zero-Shot / Few-Shot Learning*) untuk mengklasifikasi sentimen secara langsung. | **Yanaka Sofia Pardede / DS** |
| **Keterbatasan Skill DevOps & Deployment Cloud**<br>*(Dampak: Aplikasi sulit di-deploy atau tidak stabil online)* | Menggunakan platform PaaS siap pakai yang minim konfigurasi manual (seperti Streamlit Community Cloud, Vercel, atau Render/EC2). | Menggunakan platform PaaS alternatif (Railway/Fly.io) atau menjalankan demo dari *environment* lokal jika deployment online bermasalah. | **Ferdian & Ahmad** |
