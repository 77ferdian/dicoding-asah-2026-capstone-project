const pool = require('../../utils/dbPool');

const VALID_ASPECTS = ['rasa', 'harga', 'pelayanan', 'tempat'];

class ReviewsRepository {
  async getSummary({ aspect, startDate, endDate }) {
    const conditions = ['b.is_main = TRUE'];
    const params = [];

    if (aspect && VALID_ASPECTS.includes(aspect)) {
      conditions.push(`r.aspect_${aspect} IS NOT NULL`);
    }
    if (startDate) {
      params.push(startDate);
      conditions.push(`r.review_date >= $${params.length}`);
    }
    if (endDate) {
      params.push(endDate);
      conditions.push(`r.review_date <= $${params.length}`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const summaryQuery = `
      SELECT
        COUNT(r.id)::int AS total_reviews,
        COUNT(r.id) FILTER (WHERE r.sentiment = 'positive')::int AS positive,
        COUNT(r.id) FILTER (WHERE r.sentiment = 'negative')::int AS negative,
        COUNT(r.id) FILTER (WHERE r.aspect_rasa = 'positive')::int AS rasa_pos,
        COUNT(r.id) FILTER (WHERE r.aspect_rasa = 'negative')::int AS rasa_neg,
        COUNT(r.id) FILTER (WHERE r.aspect_harga = 'positive')::int AS harga_pos,
        COUNT(r.id) FILTER (WHERE r.aspect_harga = 'negative')::int AS harga_neg,
        COUNT(r.id) FILTER (WHERE r.aspect_pelayanan = 'positive')::int AS pelayanan_pos,
        COUNT(r.id) FILTER (WHERE r.aspect_pelayanan = 'negative')::int AS pelayanan_neg,
        COUNT(r.id) FILTER (WHERE r.aspect_tempat = 'positive')::int AS tempat_pos,
        COUNT(r.id) FILTER (WHERE r.aspect_tempat = 'negative')::int AS tempat_neg
      FROM reviews r
      JOIN businesses b ON r.business_id = b.id
      ${whereClause}
    `;

    const result = await pool.query(summaryQuery, params);
    const row = result.rows[0];

    const totalReviews = row.total_reviews || 0;
    const positive = row.positive || 0;
    const negative = row.negative || 0;
    const positivePercentage = totalReviews > 0
      ? Number(((positive / totalReviews) * 100).toFixed(1))
      : 0;

    return {
      totalReviews,
      positive,
      negative,
      positivePercentage,
      aspectBreakdown: {
        rasa: {
          positive: row.rasa_pos || 0,
          negative: row.rasa_neg || 0,
          total: (row.rasa_pos || 0) + (row.rasa_neg || 0),
        },
        harga: {
          positive: row.harga_pos || 0,
          negative: row.harga_neg || 0,
          total: (row.harga_pos || 0) + (row.harga_neg || 0),
        },
        pelayanan: {
          positive: row.pelayanan_pos || 0,
          negative: row.pelayanan_neg || 0,
          total: (row.pelayanan_pos || 0) + (row.pelayanan_neg || 0),
        },
        tempat: {
          positive: row.tempat_pos || 0,
          negative: row.tempat_neg || 0,
          total: (row.tempat_pos || 0) + (row.tempat_neg || 0),
        },
      },
    };
  }
}

module.exports = ReviewsRepository;
