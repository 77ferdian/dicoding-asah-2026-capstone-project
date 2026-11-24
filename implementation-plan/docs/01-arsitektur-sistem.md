# 01 — Arsitektur Sistem

## Overview

Platform ini dibangun menggunakan **decoupled full-stack architecture** dengan 4 layer utama yang saling berkomunikasi via REST API.

---

## Diagram Arsitektur (C4 Level 2 — Container)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   ⚛️  React.js SPA  (Vite + React Router v6 + Tailwind CSS)    │
│        Hosting: Vercel / Nginx di EC2                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP REST API + Bearer JWT Token
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                             │
│   🟢 Express.js Backend  (Node.js 20 LTS)                       │
│        Runtime: AWS EC2 Ubuntu 22.04                            │
│        Process Manager: PM2                                     │
│        Port: 5000                                               │
└───────────────┬────────────────────────┬────────────────────────┘
                │  SQL via pg.Pool        │  HTTP POST /predict
                ▼                         ▼
┌───────────────────────┐   ┌─────────────────────────────────────┐
│      DATA LAYER       │   │          AI / ML LAYER              │
│  🐘 AWS RDS PostgreSQL│   │  🐍 FastAPI  (Python 3.11)          │
│     Port: 5432        │   │     Model: IndoBERT / ABSA          │
│     DB: lintang_bakso │   │     Port: 8000                      │
│     SSL: required     │   │                                     │
│                       │   │  🤖 Gemini API / Groq API           │
│                       │   │     (GenAI RAG Engine)              │
└───────────────────────┘   └─────────────────────────────────────┘
```

---

## Komponen Detail

### 1. Client Layer — React.js SPA

| Aspek | Spesifikasi |
|-------|-------------|
| Framework | React.js v18/v19 |
| Build Tool | Vite |
| Routing | react-router-dom v6 (`<BrowserRouter>`) |
| State (Global) | Context API (`LocaleContext`) + `useMemo` |
| State (Local) | `useState`, `useEffect` per komponen |
| URL Filter | `useSearchParams()` |
| HTTP Client | Axios dengan interceptor token |
| UI Library | Tailwind CSS |
| Chart | Recharts |
| Icons | react-icons (`fi`, `fa`) |
| Validasi Props | PropTypes |

### 2. Server Layer — Express.js

| Aspek | Spesifikasi |
|-------|-------------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 4.x |
| Database Driver | `pg` (node-postgres) dengan `Pool` |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` (salt 10) |
| Validasi Input | `Joi` |
| CORS | `cors` middleware |
| Process Manager | PM2 |
| Error Handling | Custom exception classes |

### 3. Data Layer — PostgreSQL (AWS RDS)

| Aspek | Spesifikasi |
|-------|-------------|
| Engine | PostgreSQL 15.x |
| Host | AWS RDS (us-east-1 / ap-southeast-1) |
| SSL | `rejectUnauthorized: false` di production |
| Tabel Utama | users, authentications, businesses, reviews, ai_cache |

### 4. AI/ML Layer

| Aspek | Spesifikasi |
|-------|-------------|
| ML Serving | FastAPI (Python 3.11) + Uvicorn |
| Model | IndoBERT / ABSA (BERT-based) |
| GenAI | Gemini API (google-generativeai) atau Groq API |
| Caching | Cache hasil LLM di tabel `ai_cache` PostgreSQL (TTL 1 jam) |

---

## Alur Data Utama

### A. Login Flow
```
User → POST /authentications → Validate (Joi) → 
Check password (bcrypt.compare) → Sign JWT → 
Store refreshToken di DB → Return { accessToken, refreshToken }
```

### B. Dashboard Data Flow
```
User → GET /reviews/summary?aspect=rasa → 
authMiddleware (verify JWT) → ReviewsRepository.getSummary() → 
SQL query PostgreSQL → Transform data → Return JSON
```

### C. AI Insights RAG Flow
```
User klik "Generate Strategi AI" → 
POST /ai/insights { aspect, timeRange } → 
authMiddleware → AiService.generateInsights() →
  1. Cek ai_cache (cache hit? return langsung)
  2. Query reviews dari PostgreSQL (konteks RAG)
  3. Build prompt + konteks ulasan
  4. Call Gemini API → parse JSON response
  5. Simpan ke ai_cache (TTL 1 jam)
  6. Return { executiveSummary, actionableRecommendations }
```

---

## Keputusan Arsitektur (Architecture Decision Records)

### ADR-001: Menggunakan Context API bukan Redux
**Keputusan**: Gunakan React Context API untuk state global (locale, auth).  
**Alasan**: Kompleksitas proyek tidak membutuhkan Redux. Context + useMemo sudah cukup dan sesuai kurikulum Dicoding.

### ADR-002: Cache AI di PostgreSQL bukan Redis
**Keputusan**: Simpan cache hasil LLM di tabel `ai_cache` PostgreSQL.  
**Alasan**: Menghindari penambahan infrastruktur Redis. PostgreSQL sudah ada dan tersedia. Cache berdasarkan hash(aspect + timeRange).

### ADR-003: Modular Service Pattern Backend
**Keputusan**: Pisahkan setiap domain (users, auth, reviews, competitors, ai) ke subfolder `services/` masing-masing dengan controller, repository, routes, validator.  
**Alasan**: Maintainability, easier debugging, sesuai pattern yang diajarkan Dicoding.

---

> 📅 Last updated: 24 November 2026 | Author: Tim A26-CS065
