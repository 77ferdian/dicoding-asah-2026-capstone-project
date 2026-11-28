const pool = require('../../utils/dbPool');

class CompetitorsRepository {
  async getBenchmarking() {
    const query = `
      SELECT
        b.id,
        b.name,
        b.is_main,
        b.rating::float AS rating,
        b.lat::float AS lat,
        b.lng::float AS lng,
        b.address,
        COUNT(r.id)::int AS total_reviews,
        COUNT(r.id) FILTER (WHERE r.sentiment = 'positive')::int AS positive_reviews
      FROM businesses b
      LEFT JOIN reviews r ON r.business_id = b.id
      GROUP BY b.id
      ORDER BY b.is_main DESC, b.id ASC
    `;

    const result = await pool.query(query);

    const formatBusiness = (row) => {
      const totalReviews = row.total_reviews || 0;
      const positivePercentage = totalReviews > 0
        ? Number(((row.positive_reviews / totalReviews) * 100).toFixed(1))
        : 0;

      return {
        id: row.id,
        name: row.name,
        rating: row.rating,
        totalReviews,
        positivePercentage,
        location: {
          lat: row.lat,
          lng: row.lng,
          address: row.address,
        },
      };
    };

    const mainRow = result.rows.find((r) => r.is_main);
    const competitorRows = result.rows.filter((r) => !r.is_main);

    return {
      mainBusiness: mainRow ? formatBusiness(mainRow) : null,
      competitors: competitorRows.map(formatBusiness),
    };
  }
}

module.exports = CompetitorsRepository;
