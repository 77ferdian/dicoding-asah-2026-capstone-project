# 03 — Backend Express.js

**Penanggung Jawab**: Ahmad Ghilman (AIFS)  
**Runtime**: Node.js 20 LTS + Express.js 4.x  
**Server**: AWS EC2 Ubuntu 22.04 + PM2

---

## Struktur Direktori

```
backend/
├── src/
│   ├── exceptions/
│   │   ├── ClientError.js          ← Base class HTTP error
│   │   ├── InvariantError.js       ← HTTP 400 Bad Request
│   │   ├── NotFoundError.js        ← HTTP 404 Not Found
│   │   └── AuthorizationError.js   ← HTTP 403 Forbidden
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js       ← Verify Bearer JWT
│   │   ├── errorHandler.js         ← Global error handler
│   │   └── corsConfig.js           ← CORS setup
│   │
│   ├── services/
│   │   ├── users/
│   │   │   ├── UsersController.js
│   │   │   ├── UsersRepository.js
│   │   │   ├── UsersRoutes.js
│   │   │   └── UsersValidator.js
│   │   ├── authentications/
│   │   │   ├── AuthController.js
│   │   │   ├── AuthRepository.js
│   │   │   ├── AuthRoutes.js
│   │   │   └── AuthValidator.js
│   │   ├── reviews/
│   │   │   ├── ReviewsController.js
│   │   │   ├── ReviewsRepository.js
│   │   │   └── ReviewsRoutes.js
│   │   ├── competitors/
│   │   │   ├── CompetitorsController.js
│   │   │   ├── CompetitorsRepository.js
│   │   │   └── CompetitorsRoutes.js
│   │   └── ai/
│   │       ├── AiController.js
│   │       ├── AiService.js        ← Gemini/Groq + RAG + Cache
│   │       └── AiRoutes.js
│   │
│   ├── utils/
│   │   ├── dbPool.js               ← pg.Pool singleton
│   │   ├── tokenManager.js         ← JWT sign/verify helpers
│   │   └── idGenerator.js          ← Generate user ID
│   │
│   └── server.js                   ← Express app entrypoint
│
├── ecosystem.config.js             ← PM2 config
├── package.json
└── .env                            ← JANGAN di-commit!
```

---

## Package Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.3",
    "pg": "^8.11.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.12.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "@google/generative-ai": "^0.21.0",
    "nanoid": "^3.3.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

---

## Implementasi Kode Utama

### `src/server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const UsersRoutes  = require('./services/users/UsersRoutes');
const AuthRoutes   = require('./services/authentications/AuthRoutes');
const ReviewsRoutes    = require('./services/reviews/ReviewsRoutes');
const CompetitorsRoutes = require('./services/competitors/CompetitorsRoutes');
const AiRoutes     = require('./services/ai/AiRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users',           UsersRoutes);
app.use('/authentications', AuthRoutes);
app.use('/reviews',         ReviewsRoutes);
app.use('/competitors',     CompetitorsRoutes);
app.use('/ai',              AiRoutes);

// Global error handler (HARUS paling bawah)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Lintang Bakso API running on port ${PORT}`);
});
```

### `src/exceptions/ClientError.js`

```javascript
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}
module.exports = ClientError;
```

```javascript
// InvariantError.js — 400
const ClientError = require('./ClientError');
class InvariantError extends ClientError {
  constructor(message) { super(message, 400); this.name = 'InvariantError'; }
}
module.exports = InvariantError;

// NotFoundError.js — 404
class NotFoundError extends ClientError {
  constructor(message) { super(message, 404); this.name = 'NotFoundError'; }
}
module.exports = NotFoundError;

// AuthorizationError.js — 403
class AuthorizationError extends ClientError {
  constructor(message) { super(message, 403); this.name = 'AuthorizationError'; }
}
module.exports = AuthorizationError;
```

### `src/middlewares/errorHandler.js`

```javascript
const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server.',
  });
};

module.exports = errorHandler;
```

### `src/middlewares/authMiddleware.js`

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Token tidak ditemukan.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ status: 'fail', message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

module.exports = authMiddleware;
```

### `src/utils/tokenManager.js`

```javascript
const jwt = require('jsonwebtoken');

const tokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE) || 900, // 15 menit
    }),

  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (token) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_KEY),
};

module.exports = tokenManager;
```

### `src/services/users/UsersRepository.js`

```javascript
const bcrypt = require('bcrypt');
const pool   = require('../../utils/dbPool');
const InvariantError = require('../../exceptions/InvariantError');

class UsersRepository {
  async addUser({ id, username, password, fullname }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (id, username, password, fullname)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [id, username, hashedPassword, fullname]
    );
    if (!result.rows.length) throw new InvariantError('Gagal menambahkan user.');
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (result.rows.length) throw new InvariantError('Username sudah digunakan.');
  }

  async getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (!result.rows.length) throw new InvariantError('Username tidak ditemukan.');
    return result.rows[0];
  }
}

module.exports = UsersRepository;
```

### `src/services/ai/AiService.js` — RAG Engine

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const pool   = require('../../utils/dbPool');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getCacheKey = (params) =>
  crypto.createHash('md5').update(JSON.stringify(params)).digest('hex');

async function generateInsights({ aspect, timeRange }) {
  const cacheKey = getCacheKey({ aspect, timeRange });

  // 1. Cek cache
  const cached = await pool.query(
    `SELECT response FROM ai_cache WHERE cache_key = $1 AND expires_at > NOW()`,
    [cacheKey]
  );
  if (cached.rows.length) return cached.rows[0].response;

  // 2. Ambil konteks ulasan (RAG retrieval)
  let queryStr = `
    SELECT r.review_text, r.sentiment, b.name AS business_name
    FROM reviews r JOIN businesses b ON r.business_id = b.id
  `;
  const queryParams = [];
  const conditions  = [];

  if (aspect && ['rasa','harga','pelayanan','tempat'].includes(aspect)) {
    conditions.push(`r.aspect_${aspect} IS NOT NULL`);
  }
  if (timeRange === 'last_month') {
    conditions.push(`r.review_date >= NOW() - INTERVAL '1 month'`);
  }
  if (conditions.length) queryStr += ` WHERE ${conditions.join(' AND ')}`;
  queryStr += ` ORDER BY r.review_date DESC LIMIT 50`;

  const reviewsResult = await pool.query(queryStr, queryParams);
  const reviewContext = reviewsResult.rows
    .map(r => `[${r.business_name}][${r.sentiment}]: ${r.review_text}`)
    .join('\n');

  // 3. Buat prompt terstruktur
  const prompt = `
Kamu adalah analis bisnis UMKM kuliner di Indonesia yang berpengalaman.
Analisis ulasan digital berikut dari Lintang Bakso dan kompetitornya di Surabaya:

--- ULASAN ---
${reviewContext || 'Tidak ada data ulasan yang sesuai filter.'}
--- AKHIR ULASAN ---

Aspek yang difokuskan: ${aspect || 'semua aspek (Rasa, Harga, Pelayanan, Tempat)'}
Periode: ${timeRange === 'last_month' ? '1 bulan terakhir' : 'semua waktu'}

Berikan analisis dalam format JSON berikut (tanpa markdown, hanya JSON murni):
{
  "executiveSummary": "Ringkasan eksekutif 2-3 kalimat tentang kondisi kepuasan pelanggan",
  "actionableRecommendations": [
    "Rekomendasi konkret 1 (spesifik dan dapat diterapkan)",
    "Rekomendasi konkret 2",
    "Rekomendasi konkret 3"
  ]
}
Gunakan Bahasa Indonesia. Fokus pada insight bisnis yang konkret.
  `.trim();

  // 4. Call Gemini API
  const model  = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  // 5. Parse JSON dari response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gagal memparse respons AI.');
  const response = JSON.parse(jsonMatch[0]);

  // 6. Simpan ke cache (TTL 1 jam)
  await pool.query(
    `INSERT INTO ai_cache (cache_key, response, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')
     ON CONFLICT (cache_key) DO UPDATE
       SET response = EXCLUDED.response,
           expires_at = NOW() + INTERVAL '1 hour'`,
    [cacheKey, JSON.stringify(response)]
  );

  return response;
}

module.exports = { generateInsights };
```

---

## PM2 Configuration

### `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name:        'lintang-api',
    script:      'src/server.js',
    instances:   1,
    autorestart: true,
    watch:       false,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
      PORT:     5000,
    },
  }],
};
```

**PM2 Commands:**
```bash
# Start
pm2 start ecosystem.config.js --env production

# Save & autostart on reboot
pm2 save
pm2 startup

# Monitor logs
pm2 logs lintang-api
pm2 status

# Restart
pm2 restart lintang-api
```

---

## Variabel Environment Wajib

```dotenv
PGHOST=your-rds-endpoint.rds.amazonaws.com
PGPORT=5432
PGDATABASE=lintang_bakso_db
PGUSER=lintang_admin
PGPASSWORD=your_secure_password

ACCESS_TOKEN_KEY=min32charssupersecretaccesskeyhere
REFRESH_TOKEN_KEY=min32charssupersecretrefreshkeyhere
ACCESS_TOKEN_AGE=900

GEMINI_API_KEY=AIzaSy...
FASTAPI_ML_URL=http://localhost:8000

NODE_ENV=production
PORT=5000
```

---

> 📅 Last updated: 24 November 2026 | Author: Ahmad Ghilman (AIFS)
