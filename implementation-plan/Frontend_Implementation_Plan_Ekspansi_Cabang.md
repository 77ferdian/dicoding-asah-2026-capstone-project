# Frontend Implementation Plan: Tab “Ekspansi Cabang”

Proyek A26-CS065 · Lintang Bakso · PIC Frontend: Panji Arya Maulana · Draft v0.1

Dokumen ini turunan dari PRD Fitur Keputusan Cabang Baru. Fokusnya hanya sisi frontend (React.js) pada dashboard yang sudah ada, dengan asumsi backend Express mengikuti kontrak API di PRD bagian 8.

## 1. Keputusan Teknis

| Hal | Pilihan | Alasan |
|---|---|---|
| Library peta | **react-leaflet + OpenStreetMap** (default) | Gratis, tanpa billing, tanpa risiko tagihan. Cukup untuk marker, radius, dan popup. |
| Alternatif peta | Google Maps JS API (`@vis.gl/react-google-maps`) | Dipakai jika tim punya akun billing dan butuh Places Autocomplete bawaan. Komponen peta dibungkus agar mudah diganti. |
| Geocoding / cari alamat | Nominatim (OSM), dipanggil lewat backend | Hindari kena rate limit dan ToS dari browser langsung. |
| Data fetching | TanStack Query (`@tanstack/react-query`) | Cache, status loading/error, dan refetch otomatis. |
| State UI | `useState` + context ringan (kandidat terpilih, radius, bobot) | Cukup untuk skala fitur ini, tanpa tambahan Redux. |
| Grafik | Library grafik yang sudah dipakai di dashboard (mis. Recharts) | Konsisten dengan tab sentimen yang ada. |
| Styling | Mengikuti sistem styling dashboard saat ini (Tailwind/CSS yang sama) | Tidak membuat gaya baru. |

Instalasi (jika memakai opsi default):

```bash
npm install leaflet react-leaflet @tanstack/react-query
```

Pastikan CSS Leaflet diimpor sekali di entry point:

```js
import "leaflet/dist/leaflet.css";
```

## 2. Struktur Folder

```
src/
  features/
    expansion/
      pages/
        ExpansionPage.jsx          // layout tab: panel kiri, peta, panel kanan
      components/
        ExpansionMap.jsx           // pembungkus peta (Leaflet/Google)
        CandidateSearch.jsx        // cari alamat + hasil
        CandidateList.jsx          // daftar kandidat, hapus, pilih
        RadiusSelector.jsx         // 500 m / 1 km / 2 km
        ScoreCard.jsx              // skor besar + label
        ScoreBreakdown.jsx         // bar per komponen skor
        AspectGapChart.jsx         // celah aspek vs kompetitor
        AiInsightPanel.jsx         // tombol + hasil rekomendasi AI
        CompareTable.jsx           // perbandingan 2-5 kandidat
        WeightEditor.jsx           // (Could) ubah bobot
        Disclaimer.jsx
      hooks/
        useMapData.js
        useCandidates.js
        useAnalyze.js
        useCompare.js
        useInsight.js
      api/
        expansionApi.js            // semua pemanggilan endpoint
      utils/
        scoreLabel.js              // angka -> label & warna
        format.js
```

## 3. Routing dan Navigasi

- Tambah rute terproteksi `/dashboard/expansion` di dalam layout dashboard yang sudah ada.
- Tambah item menu “Ekspansi Cabang” di sidebar/tab, di samping Ringkasan Sentimen dan Competitor Benchmarking.
- Gunakan guard login yang sama dengan halaman lain; jika token kedaluwarsa (401), arahkan ke halaman login.

```jsx
// contoh
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard/expansion" element={<ExpansionPage />} />
</Route>
```

## 4. Layout Halaman

Desktop (tiga kolom):

```
+------------------+---------------------------+-------------------+
| Panel kiri       | Peta                      | Panel kanan       |
| - Cari alamat    | - Cabang eksisting        | - ScoreCard       |
| - Daftar kandidat| - Kompetitor              | - ScoreBreakdown  |
| - Radius         | - Kandidat + lingkaran    | - AspectGapChart  |
| - Filter         |   radius                  | - AiInsightPanel  |
+------------------+---------------------------+-------------------+
| Tab bawah/atas: Peta  |  Perbandingan                              |
+--------------------------------------------------------------------+
```

Ponsel (< 768 px): peta di atas (tinggi sekitar 45% layar), panel skor menjadi *bottom sheet* yang bisa digeser, daftar kandidat dalam drawer.

## 5. Kontrak API yang Dipakai Frontend

Sesuai PRD bagian 8. Semua request memakai header `Authorization: Bearer <token>`.

```js
// src/features/expansion/api/expansionApi.js
import { http } from "@/lib/http"; // instance fetch/axios yang sudah ada

export const getMapData = () => http.get("/api/expansion/map-data");
export const listCandidates = () => http.get("/api/expansion/candidates");
export const addCandidate = (body) => http.post("/api/expansion/candidates", body); // {label, lat, lng}
export const deleteCandidate = (id) => http.delete(`/api/expansion/candidates/${id}`);
export const analyzeCandidate = (id, body) =>
  http.post(`/api/expansion/candidates/${id}/analyze`, body); // {radius, weights?}
export const compareCandidates = (ids) =>
  http.get(`/api/expansion/compare?ids=${ids.join(",")}`);
export const generateInsight = (id, body) =>
  http.post(`/api/expansion/candidates/${id}/insight`, body);
```

Bentuk respons yang disepakati dengan backend (Ahmad), sebagai acuan awal untuk data mock:

```json
{
  "candidateId": 12,
  "radius": 1000,
  "totalScore": 72,
  "label": "Potensial",
  "breakdown": [
    { "key": "demand", "label": "Potensi permintaan", "score": 85, "weight": 0.30 },
    { "key": "competitorPressure", "label": "Tekanan kompetitor", "score": 60, "weight": 0.20 }
  ],
  "aspectGap": [
    { "aspect": "pelayanan", "ours": 0.78, "competitors": 0.41 }
  ],
  "nearbyCompetitors": [
    { "id": "c1", "name": "…", "lat": -7.25, "lng": 112.75, "rating": 4.1, "distanceM": 420 }
  ]
}
```

## 6. Hook dan State

```js
// useCandidates.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/expansionApi";

export function useCandidates() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["candidates"], queryFn: api.listCandidates });

  const add = useMutation({
    mutationFn: api.addCandidate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["candidates"] }),
  });

  const remove = useMutation({
    mutationFn: api.deleteCandidate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["candidates"] }),
  });

  return { ...query, add, remove };
}
```

```js
// useAnalyze.js
export function useAnalyze(candidateId, radius, weights) {
  return useQuery({
    queryKey: ["analysis", candidateId, radius, weights],
    queryFn: () => api.analyzeCandidate(candidateId, { radius, weights }),
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,
  });
}
```

State halaman (di `ExpansionPage`):

- `selectedCandidateId`
- `radius` (default 1000)
- `weights` (default dari backend; `null` berarti pakai bobot default)
- `compareIds` (array, maksimal 5)

## 7. Komponen Utama

**ExpansionMap**

- Marker cabang eksisting (ikon khusus), kompetitor (warna sesuai rating: hijau ≥ 4.3, kuning 3.8-4.2, merah < 3.8), kandidat (ikon pin berbeda).
- `Circle` radius di sekitar kandidat terpilih.
- Klik peta mengaktifkan mode “tambah kandidat”: tampilkan pin sementara, tombol Simpan/Batal.
- Popup marker: nama, rating, jumlah ulasan, skor aspek singkat.
- Pasang batas zoom dan pusat awal ke area Lintang Bakso di Surabaya.

```jsx
// kerangka ExpansionMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";

function ClickToAdd({ enabled, onPick }) {
  useMapEvents({ click: (e) => enabled && onPick(e.latlng) });
  return null;
}

export default function ExpansionMap({ data, candidates, selected, radius, addMode, onPick }) {
  return (
    <MapContainer center={[-7.2575, 112.7521]} zoom={13} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ClickToAdd enabled={addMode} onPick={onPick} />
      {/* marker cabang, kompetitor, kandidat */}
      {selected && <Circle center={[selected.lat, selected.lng]} radius={radius} />}
    </MapContainer>
  );
}
```

Catatan: atribusi OpenStreetMap wajib tampil. Tile server publik OSM tidak untuk trafik besar; untuk demo dan skala UMKM cukup, tetapi pertimbangkan penyedia tile lain jika trafik naik.

**CandidateSearch**

- Input dengan *debounce* 400 ms; panggil endpoint pencarian alamat di backend (tambahkan `GET /api/expansion/geocode?q=` jika belum ada di kontrak).
- Tampilkan maksimal 5 hasil; klik hasil memindahkan peta dan menawarkan “Jadikan kandidat”.
- Batasi total kandidat 5; tampilkan pesan jika penuh.

**ScoreCard dan ScoreBreakdown**

- Angka besar 0-100 dengan label dan warna: ≥ 75 Sangat Potensial (hijau), 60-74 Potensial (hijau muda), 40-59 Perlu Pertimbangan (kuning), < 40 Kurang Disarankan (merah). Jangan hanya mengandalkan warna; sertakan teks label.
- Bar horizontal per komponen beserta bobot; tooltip menjelaskan cara hitung singkat.

**AspectGapChart**

- Bar berkelompok per aspek (rasa, harga, pelayanan, tempat): Lintang Bakso vs rata-rata kompetitor sekitar. Sorot aspek dengan selisih terbesar sebagai “peluang”.

**AiInsightPanel**

- Tombol “Buat Rekomendasi” → `useMutation`. Selama proses tampilkan skeleton/spinner.
- Tampilkan empat bagian tetap: Ringkasan, Peluang, Risiko, Langkah verifikasi lapangan.
- Jika backend mengembalikan flag `fallback: true` (kuota LLM habis), tampilkan label “Ringkasan otomatis (tanpa AI)”.
- Tombol “Buat ulang” dinonaktifkan sementara untuk mencegah spam (cooldown 10 detik); tangani respons 429 dengan pesan jelas.
- Teks AI dirender sebagai teks biasa (bukan HTML mentah) untuk mencegah injeksi.

**CompareTable**

- Pilih 2-5 kandidat via checkbox di daftar. Tabel: baris = komponen skor, kolom = kandidat; sorot nilai tertinggi per baris. Di ponsel, tabel bisa digeser horizontal di dalam kontainernya.

**Disclaimer**

- Selalu tampil di panel skor: “Skor ini alat bantu berbasis data publik, bukan jaminan hasil. Lakukan survei lapangan sebelum memutuskan.”

## 8. Status Loading, Error, dan Kosong

| Kondisi | Tampilan |
|---|---|
| Memuat data peta | Skeleton peta + teks “Memuat data lokasi…” |
| Belum ada kandidat | Ilustrasi/teks: “Klik peta atau cari alamat untuk menambah lokasi kandidat.” |
| Analisis berjalan | Skeleton pada ScoreCard dan breakdown |
| 401 | Redirect ke login dengan pesan sesi berakhir |
| 403 | “Anda tidak punya akses ke fitur ini.” |
| 429 | “Terlalu banyak permintaan. Coba lagi beberapa saat.” + cooldown |
| 5xx / jaringan | Pesan ringkas + tombol “Coba lagi”, tanpa membocorkan detail teknis |
| Data kompetitor minim | Banner: “Data kompetitor terbatas, hasil bersifat indikatif.” |

## 9. Keamanan dan Konfigurasi

- Jangan menaruh API key sensitif di frontend. Jika memakai Google Maps JS API, gunakan key khusus peta dengan **domain restriction** dan batas kuota harian.
- Variabel lingkungan Vite/CRA, contoh: `VITE_API_BASE_URL`, `VITE_GOOGLE_MAPS_KEY` (hanya bila pakai Google). Jangan commit file `.env`.
- Semua panggilan API melewati instance HTTP yang menyisipkan token dan menangani 401 secara terpusat.
- Sanitasi input pencarian alamat (panjang maksimum) dan validasi koordinat sebelum kirim.

## 10. Aksesibilitas dan Responsif

- Semua kontrol dapat dioperasikan keyboard; tombol memiliki label teks atau `aria-label`.
- Kontras warna memenuhi standar dan makna tidak bergantung warna saja.
- Peta diberi alternatif teks: daftar kandidat dan kompetitor terdekat dalam bentuk tabel.
- Uji pada lebar 360, 768, dan 1280 px.

## 11. Rencana Kerja Frontend

Mengikuti fase di PRD (fitur ini masuk setelah MVP wajib stabil). Estimasi untuk PIC frontend:

| Tahap | Pekerjaan | Estimasi | Keluaran |
|---|---|---|---|
| F0 | Setuju library peta; siapkan rute, menu, dan folder fitur | 0,5 hari | Halaman kosong terproteksi di `/dashboard/expansion` |
| F1 | `ExpansionMap` dengan data mock (cabang, kompetitor) + popup | 1-1,5 hari | Peta menampilkan marker dari mock sesuai kontrak |
| F2 | `CandidateSearch`, `CandidateList`, mode tambah via klik peta, hapus | 1-1,5 hari | Kandidat dapat ditambah/dihapus (mock lalu API) |
| F3 | `RadiusSelector`, `ScoreCard`, `ScoreBreakdown`, `AspectGapChart` | 1,5 hari | Panel skor dinamis terhadap radius |
| F4 | Sambungkan API sungguhan (TanStack Query), error/loading state | 1 hari | Alur dari tambah kandidat sampai skor berjalan |
| F5 | `AiInsightPanel` + cooldown + penanganan 429/fallback | 1 hari | Rekomendasi AI tampil dan tahan error |
| F6 | `CompareTable` + bottom sheet responsif ponsel | 1-1,5 hari | Perbandingan 2-5 kandidat; tampilan ponsel rapi |
| F7 | Uji manual, perbaikan bug, aksesibilitas, bahan user manual | 1 hari | Daftar bug di GitHub Issues tertutup; panduan layar |

Total sekitar 8-9 hari kerja satu orang. Jalur pemangkasan: kerjakan F0-F4 saja (peta, kandidat, skor), tunda F5 dan F6.

## 12. Pengujian Frontend

- **Komponen:** Vitest/Jest + React Testing Library untuk `scoreLabel`, `ScoreCard`, `CandidateList`, dan `CompareTable`.
- **Mock API:** MSW (Mock Service Worker) atau data JSON lokal agar frontend dapat diuji sebelum backend siap.
- **Manual (checklist):**
  - Tambah kandidat via klik peta dan via pencarian alamat.
  - Ubah radius, skor dan lingkaran ikut berubah.
  - Tambah kandidat ke-6, harus ditolak dengan pesan jelas.
  - Token dihapus, akses halaman, harus diarahkan ke login.
  - Matikan jaringan, tombol “Coba lagi” bekerja.
  - Klik “Buat Rekomendasi” berulang cepat, cooldown/429 tertangani.
  - Tampilan di ponsel: peta, bottom sheet, tabel perbandingan.
- **Performa:** peta termuat responsif; analisis ditampilkan kurang dari 5 detik (tanpa LLM) sesuai target PRD.

## 13. Definition of Done (Frontend)

- Tab “Ekspansi Cabang” dapat diakses setelah login dan berfungsi di desktop serta ponsel.
- Pengguna dapat menambah kandidat, melihat skor beserta rincian, dan membandingkan minimal 2 kandidat.
- Rekomendasi AI tampil dengan penanganan error dan fallback.
- Tidak ada API key sensitif di kode frontend; tidak ada error konsol kritis.
- Terdeploy bersama dashboard dan tercantum di user manual.

## 14. Ketergantungan dan Pertanyaan Terbuka

1. Endpoint geocoding (`/api/expansion/geocode`) belum ada di kontrak API; perlu ditambahkan oleh backend.
2. Format final `breakdown` dan `aspectGap` perlu dikunci bersama Ahmad dan Annisa/Yanaka sebelum F3.
3. Keputusan peta: OpenStreetMap atau Google Maps (bergantung akun billing dan hasil cek ToS).
4. Framework dan library UI yang dipakai dashboard saat ini (Tailwind, Recharts, dll.) perlu dikonfirmasi agar komponen baru konsisten.
