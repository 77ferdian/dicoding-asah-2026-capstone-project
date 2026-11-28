const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const pool = require('../../utils/dbPool');

const VALID_ASPECTS = ['rasa', 'harga', 'pelayanan', 'tempat'];

const getCacheKey = (params) =>
  crypto.createHash('md5').update(JSON.stringify(params)).digest('hex');

async function generateInsights({ aspect = null, timeRange = 'all' }) {
  const cacheKey = getCacheKey({ aspect, timeRange });

  // 1. Check cache
  const cached = await pool.query(
    `SELECT response, created_at, expires_at
     FROM ai_cache
     WHERE cache_key = $1 AND expires_at > NOW()`,
    [cacheKey]
  );
  if (cached.rows.length) {
    const row = cached.rows[0];
    return {
      ...row.response,
      cachedAt: row.created_at,
      cacheExpires: row.expires_at,
    };
  }

  // 2. Retrieve review context (RAG)
  let queryStr = `
    SELECT r.review_text, r.sentiment, b.name AS business_name
    FROM reviews r
    JOIN businesses b ON r.business_id = b.id
  `;
  const conditions = [];

  if (aspect && VALID_ASPECTS.includes(aspect)) {
    conditions.push(`r.aspect_${aspect} IS NOT NULL`);
  }
  if (timeRange === 'last_month') {
    conditions.push(`r.review_date >= NOW() - INTERVAL '1 month'`);
  } else if (timeRange === 'last_week') {
    conditions.push(`r.review_date >= NOW() - INTERVAL '1 week'`);
  }

  if (conditions.length) {
    queryStr += ` WHERE ${conditions.join(' AND ')}`;
  }
  queryStr += ` ORDER BY r.review_date DESC LIMIT 50`;

  const reviewsResult = await pool.query(queryStr);
  const reviewContext = reviewsResult.rows
    .map((r) => `[${r.business_name}][${r.sentiment}]: ${r.review_text}`)
    .join('\n');

  // 3. Build structured prompt
  let periodLabel = 'semua waktu';
  if (timeRange === 'last_month') periodLabel = '1 bulan terakhir';
  if (timeRange === 'last_week') periodLabel = '1 minggu terakhir';

  const prompt = `
Kamu adalah analis bisnis UMKM kuliner di Indonesia yang berpengalaman.
Analisis ulasan digital berikut dari Lintang Bakso dan kompetitornya di Surabaya:

--- ULASAN ---
${reviewContext || 'Tidak ada data ulasan yang sesuai filter.'}
--- AKHIR ULASAN ---

Aspek yang difokuskan: ${aspect || 'semua aspek (Rasa, Harga, Pelayanan, Tempat)'}
Periode: ${periodLabel}

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
  let parsedResponse;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gagal memparse respons AI.');
    }
    parsedResponse = JSON.parse(jsonMatch[0]);
  } catch (err) {
    const serviceError = new Error('Layanan AI sedang tidak tersedia. Coba lagi nanti.');
    serviceError.statusCode = 503;
    throw serviceError;
  }

  // 5. Save to cache (TTL 1 hour)
  const cacheResult = await pool.query(
    `INSERT INTO ai_cache (cache_key, response, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')
     ON CONFLICT (cache_key) DO UPDATE
       SET response = EXCLUDED.response,
           created_at = NOW(),
           expires_at = NOW() + INTERVAL '1 hour'
     RETURNING created_at, expires_at`,
    [cacheKey, JSON.stringify(parsedResponse)]
  );

  const { created_at: cachedAt, expires_at: cacheExpires } = cacheResult.rows[0];

  return {
    ...parsedResponse,
    cachedAt,
    cacheExpires,
  };
}

module.exports = { generateInsights };
