# 02 — Database Schema (PostgreSQL)

**Penanggung Jawab**: Ferdian  
**Database**: AWS RDS PostgreSQL 15.x  
**Database Name**: `lintang_bakso_db`

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌─────────────────────┐
│    users     │       │   authentications   │
├──────────────┤       ├─────────────────────┤
│ id (PK)      │       │ token (PK)          │
│ username     │       └─────────────────────┘
│ password     │
│ fullname     │
│ created_at   │
└──────────────┘

┌───────────────────┐           ┌────────────────────────────────┐
│    businesses     │ 1──────── N│          reviews               │
├───────────────────┤           ├────────────────────────────────┤
│ id (PK)           │           │ id (PK)                        │
│ name              │           │ business_id (FK → businesses)  │
│ is_main (BOOLEAN) │           │ review_text                    │
│ rating            │           │ reviewer (anonimisasi)         │
│ lat               │           │ review_date                    │
│ lng               │           │ sentiment (positive/negative)  │
│ address           │           │ aspect_rasa                    │
│ created_at        │           │ aspect_harga                   │
└───────────────────┘           │ aspect_pelayanan               │
                                │ aspect_tempat                  │
                                │ created_at                     │
                                └────────────────────────────────┘

┌──────────────────────────┐
│        ai_cache          │
├──────────────────────────┤
│ id (PK)                  │
│ cache_key (UNIQUE)       │  ← MD5 hash(aspect+timeRange+businessId)
│ response (JSONB)         │
│ created_at               │
│ expires_at               │  ← TTL 1 jam dari created_at
└──────────────────────────┘
```

---

## SQL Migration Scripts

### File: `database/migrations/001_init_schema.sql`

```sql
-- ============================================================
-- LINTANG BAKSO DB - Initial Schema Migration
-- Tim A26-CS065 | Asah 2026
-- ============================================================

-- Ekstensi UUID (opsional untuk user ID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT 'user-' || substr(md5(random()::text), 1, 12),
  username   VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  fullname   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP   DEFAULT NOW()
);

-- ============================================================
-- TABLE: authentications (refresh tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS authentications (
  token TEXT NOT NULL PRIMARY KEY
);

-- ============================================================
-- TABLE: businesses
-- ============================================================
CREATE TABLE IF NOT EXISTS businesses (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  is_main    BOOLEAN      DEFAULT FALSE,
  rating     NUMERIC(3,1),
  lat        NUMERIC(10,7),
  lng        NUMERIC(10,7),
  address    TEXT,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id               SERIAL       PRIMARY KEY,
  business_id      INTEGER      NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_text      TEXT         NOT NULL,
  reviewer         VARCHAR(100),              -- Sudah dianonimisasi oleh DS team
  review_date      DATE,
  sentiment        VARCHAR(20)  CHECK (sentiment IN ('positive', 'negative')),
  aspect_rasa      VARCHAR(20)  CHECK (aspect_rasa IN ('positive', 'negative', NULL)),
  aspect_harga     VARCHAR(20)  CHECK (aspect_harga IN ('positive', 'negative', NULL)),
  aspect_pelayanan VARCHAR(20)  CHECK (aspect_pelayanan IN ('positive', 'negative', NULL)),
  aspect_tempat    VARCHAR(20)  CHECK (aspect_tempat IN ('positive', 'negative', NULL)),
  created_at       TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- TABLE: ai_cache
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_cache (
  id         SERIAL       PRIMARY KEY,
  cache_key  VARCHAR(255) UNIQUE NOT NULL,
  response   JSONB        NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW(),
  expires_at TIMESTAMP    NOT NULL
);

-- ============================================================
-- INDEXES (untuk performa query filter)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reviews_business_id  ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment    ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_reviews_date         ON reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_aspect_rasa  ON reviews(aspect_rasa);
CREATE INDEX IF NOT EXISTS idx_reviews_aspect_harga ON reviews(aspect_harga);
CREATE INDEX IF NOT EXISTS idx_reviews_pelayanan    ON reviews(aspect_pelayanan);
CREATE INDEX IF NOT EXISTS idx_reviews_tempat       ON reviews(aspect_tempat);
CREATE INDEX IF NOT EXISTS idx_ai_cache_key         ON ai_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires     ON ai_cache(expires_at);
```

### File: `database/seeds/001_seed_businesses.sql`

```sql
-- ============================================================
-- SEED: Businesses (Lintang Bakso + Kompetitor)
-- Data ini diisi oleh tim DS (Annisa & Yanaka)
-- ============================================================
INSERT INTO businesses (name, is_main, rating, lat, lng, address) VALUES
  ('Lintang Bakso',    TRUE,  4.5, -7.2500, 112.7500, 'Surabaya, Jawa Timur'),
  ('Bakso Pak Djo',    FALSE, 4.2, -7.2575, 112.7521, 'Surabaya, Jawa Timur'),
  ('Bakso Solo Roso',  FALSE, 4.1, -7.2610, 112.7480, 'Surabaya, Jawa Timur'),
  ('Bakso Cak Bejo',   FALSE, 3.9, -7.2630, 112.7560, 'Surabaya, Jawa Timur'),
  ('Bakso Malang Asli',FALSE, 4.3, -7.2490, 112.7540, 'Surabaya, Jawa Timur')
ON CONFLICT DO NOTHING;
```

---

## Panduan Import Data Reviews

Tim DS (Annisa) menyiapkan file CSV hasil scraping. Format yang diharapkan:

```csv
business_name,review_text,reviewer,review_date,sentiment,aspect_rasa,aspect_harga,aspect_pelayanan,aspect_tempat
Lintang Bakso,"Baksonya enak banget!",Reviewer_001,2026-10-15,positive,positive,,,
Lintang Bakso,"Pelayanannya lama",Reviewer_002,2026-10-20,negative,,,negative,
```

**Script import CSV ke PostgreSQL:**
```bash
# Copy CSV ke server EC2 dulu
scp reviews_cleaned.csv ubuntu@<ec2-ip>:~/

# Import via psql
psql -h $PGHOST -U $PGUSER -d lintang_bakso_db -c \
  "\COPY reviews_staging (business_name, review_text, reviewer, review_date, sentiment, aspect_rasa, aspect_harga, aspect_pelayanan, aspect_tempat) FROM 'reviews_cleaned.csv' CSV HEADER"
```

---

## Koneksi Database (Node.js)

```javascript
// backend/src/utils/dbPool.js
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     parseInt(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max:      10,                    // connection pool size
  idleTimeoutMillis: 30000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }   // wajib untuk AWS RDS
    : false,
});

pool.on('error', (err) => {
  console.error('PostgreSQL Pool Error:', err);
});

module.exports = pool;
```

---

> 📅 Last updated: 24 November 2026 | Author: Ferdian (AIFS)
