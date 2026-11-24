# 📁 Implementation Plan — Lintang Bakso AI Analytics Platform
**Tim A26-CS065 | Asah 2026 (Dicoding × GoTo)**

---

## 🗂️ Struktur Folder

```
implementation-plan/
├── README.md                        ← Halaman ini (index & navigasi)
│
├── docs/
│   ├── 01-arsitektur-sistem.md      ← Diagram & penjelasan arsitektur
│   ├── 02-database-schema.md        ← Skema PostgreSQL lengkap
│   ├── 03-backend-express.md        ← Panduan implementasi backend
│   ├── 04-frontend-react.md         ← Panduan implementasi frontend
│   ├── 05-ai-ml-service.md          ← FastAPI ML serving & RAG
│   └── 06-deployment-aws.md         ← Setup EC2, PM2, RDS, Security Groups
│
├── api-contracts/
│   ├── auth-endpoints.md            ← Kontrak API autentikasi
│   └── analytics-endpoints.md      ← Kontrak API analytics, benchmarking, AI
│
└── checklists/
    ├── minggu-1-checklist.md        ← Checklist setup & perancangan
    ├── minggu-2-checklist.md        ← Checklist pengembangan modul
    ├── minggu-3-checklist.md        ← Checklist integrasi & MVP
    ├── minggu-4-checklist.md        ← Checklist testing & deployment
    └── security-checklist.md       ← Checklist keamanan sebelum production
```

---

## 🔗 Navigasi Cepat

| Dokumen | Penanggung Jawab | Status |
|---------|-----------------|--------|
| [Arsitektur Sistem](docs/01-arsitektur-sistem.md) | Semua Tim | 📝 Draft |
| [Database Schema](docs/02-database-schema.md) | Ferdian | 📝 Draft |
| [Backend Express.js](docs/03-backend-express.md) | Ahmad Ghilman | 📝 Draft |
| [Frontend React.js](docs/04-frontend-react.md) | Panji Arya | 📝 Draft |
| [AI/ML Service](docs/05-ai-ml-service.md) | Sabilah | 📝 Draft |
| [Deployment AWS](docs/06-deployment-aws.md) | Ferdian | 📝 Draft |
| [API Auth Contracts](api-contracts/auth-endpoints.md) | Ahmad Ghilman | 📝 Draft |
| [API Analytics Contracts](api-contracts/analytics-endpoints.md) | Ahmad Ghilman | 📝 Draft |

---

## ⏱️ Roadmap 4 Minggu

```
Minggu 1 (20–26 Nov)  → Setup, Scraping, Kontrak API, Mockup
Minggu 2 (27 Nov–4 Des) → Backend Auth, Model ML, Frontend Mock
Minggu 3 (5–11 Des)   → Integrasi AI + Frontend, MVP Deploy
Minggu 4 (12–20 Des)  → E2E Testing, Bug Fix, Demo Nawayoga
```

---

> 📌 Semua file ini adalah **living documents** — update setiap kali ada perubahan keputusan teknis.
