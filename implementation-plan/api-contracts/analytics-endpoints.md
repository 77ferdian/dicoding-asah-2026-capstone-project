# API Contracts — Analytics, Benchmarking & AI Insights

**Base URL**: `http://<server>:5000`  
**Auth**: Semua endpoint di file ini memerlukan `Authorization: Bearer <accessToken>`

---

## 1. `GET /reviews/summary` — Dashboard Ringkasan Sentimen

**Request:**
```http
GET /reviews/summary?aspect=rasa&startDate=2026-01-01&endDate=2026-11-20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
| Parameter | Type | Required | Keterangan |
|-----------|------|----------|------------|
| `aspect` | string | ❌ | `rasa` / `harga` / `pelayanan` / `tempat` |
| `startDate` | date (YYYY-MM-DD) | ❌ | Filter tanggal mulai |
| `endDate` | date (YYYY-MM-DD) | ❌ | Filter tanggal selesai |

**Response 200 OK:**
```json
{
  "status": "success",
  "data": {
    "totalReviews": 450,
    "positive": 315,
    "negative": 135,
    "positivePercentage": 70.0,
    "aspectBreakdown": {
      "rasa": {
        "positive": 120,
        "negative": 15,
        "total": 135
      },
      "harga": {
        "positive": 80,
        "negative": 40,
        "total": 120
      },
      "pelayanan": {
        "positive": 65,
        "negative": 50,
        "total": 115
      },
      "tempat": {
        "positive": 50,
        "negative": 30,
        "total": 80
      }
    }
  }
}
```

**Error Cases:**
| HTTP | Kondisi |
|------|---------|
| 401 | Token tidak ada / kedaluwarsa |
| 400 | Format `aspect` tidak valid |

---

## 2. `GET /competitors/benchmarking` — Perbandingan Kompetitor

**Request:**
```http
GET /competitors/benchmarking
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 OK:**
```json
{
  "status": "success",
  "data": {
    "mainBusiness": {
      "id": 1,
      "name": "Lintang Bakso",
      "rating": 4.5,
      "totalReviews": 450,
      "positivePercentage": 70.0,
      "location": {
        "lat": -7.2500,
        "lng": 112.7500,
        "address": "Surabaya, Jawa Timur"
      }
    },
    "competitors": [
      {
        "id": 2,
        "name": "Bakso Pak Djo",
        "rating": 4.2,
        "totalReviews": 180,
        "positivePercentage": 78.5,
        "location": {
          "lat": -7.2575,
          "lng": 112.7521,
          "address": "Surabaya, Jawa Timur"
        }
      },
      {
        "id": 3,
        "name": "Bakso Solo Roso",
        "rating": 4.1,
        "totalReviews": 120,
        "positivePercentage": 62.0,
        "location": {
          "lat": -7.2610,
          "lng": 112.7480,
          "address": "Surabaya, Jawa Timur"
        }
      }
    ]
  }
}
```

---

## 3. `POST /ai/insights` — Generate AI Strategy Recommendation

**Request:**
```http
POST /ai/insights
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "aspect": "pelayanan",
  "timeRange": "last_month"
}
```

**Body Parameters:**
| Parameter | Type | Required | Keterangan |
|-----------|------|----------|------------|
| `aspect` | string | ❌ | `rasa` / `harga` / `pelayanan` / `tempat` (kosong = semua) |
| `timeRange` | string | ❌ | `last_month` / `last_week` / `all` |

**Response 200 OK:**
```json
{
  "status": "success",
  "data": {
    "executiveSummary": "Pelanggan Lintang Bakso secara umum sangat menyukai kualitas rasa bakso (88% positif). Namun, terjadi peningkatan keluhan pada aspek Pelayanan selama bulan terakhir (50% negatif), berpotensi berdampak pada loyalitas pelanggan.",
    "actionableRecommendations": [
      "Lakukan pelatihan ulang staf kasir dan pelayan untuk mempercepat waktu penyajian pada jam sibuk (12.00–14.00).",
      "Pertimbangkan penambahan 1 orang staf paruh waktu untuk area meja saat akhir pekan dan hari libur.",
      "Kompetitor 'Bakso Pak Djo' memiliki nilai kepuasan pelayanan 78.5% — evaluasi kemungkinan adopsi sistem pemesanan via QR code di meja."
    ],
    "cachedAt": "2026-11-24T10:00:00.000Z",
    "cacheExpires": "2026-11-24T11:00:00.000Z"
  }
}
```

**Error Cases:**
| HTTP | Kondisi | Message |
|------|---------|---------|
| 401 | Token tidak ada / kedaluwarsa | `"Token tidak ditemukan."` |
| 400 | `aspect` tidak valid | `"Aspek harus salah satu dari: rasa, harga, pelayanan, tempat."` |
| 503 | Gemini API rate limit / down | `"Layanan AI sedang tidak tersedia. Coba lagi nanti."` |

---

## Postman Test Scripts

### Test: GET /reviews/summary (Authenticated)

```javascript
// Pre-request: set token dari environment
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('accessToken')
});

// Tests
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("Data structure valid", () => {
  const json = pm.response.json();
  pm.expect(json.status).to.eql('success');
  pm.expect(json.data.totalReviews).to.be.a('number');
  pm.expect(json.data.positivePercentage).to.be.a('number');
  pm.expect(json.data.aspectBreakdown).to.have.keys(['rasa','harga','pelayanan','tempat']);
});
```

### Test: POST /ai/insights

```javascript
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("AI response berisi summary dan rekomendasi", () => {
  const json = pm.response.json();
  pm.expect(json.status).to.eql('success');
  pm.expect(json.data.executiveSummary).to.be.a('string').and.have.length.above(10);
  pm.expect(json.data.actionableRecommendations).to.be.an('array').and.have.length.above(0);
});
```

### Test: Unauthorized Access

```javascript
// Request tanpa Authorization header
pm.test("Status 401", () => pm.response.to.have.status(401));
pm.test("Response status fail", () => {
  pm.expect(pm.response.json().status).to.eql('fail');
});
```

---

## Contoh CURL Commands

```bash
# Login dan simpan token
TOKEN=$(curl -s -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{"username":"owner_lintang","password":"secret123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# GET Summary
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/reviews/summary?aspect=rasa"

# GET Benchmarking
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/competitors/benchmarking"

# POST AI Insights
curl -X POST http://localhost:5000/ai/insights \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"aspect":"pelayanan","timeRange":"last_month"}'
```

---

> 📅 Last updated: 24 November 2026 | Author: Ahmad Ghilman (AIFS)
