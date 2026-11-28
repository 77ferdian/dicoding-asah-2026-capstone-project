-- ============================================================
-- LINTANG BAKSO DB - Initial Schema Migration
-- Tim A26-CS065 | Asah 2026
-- ============================================================

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
  reviewer         VARCHAR(100),
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
-- INDEXES
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
