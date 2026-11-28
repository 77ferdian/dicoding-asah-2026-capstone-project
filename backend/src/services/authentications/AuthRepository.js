const pool = require('../../utils/dbPool');
const InvariantError = require('../../exceptions/InvariantError');

class AuthRepository {
  async addRefreshToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  }

  async verifyRefreshToken(token) {
    const result = await pool.query(
      'SELECT token FROM authentications WHERE token = $1',
      [token]
    );
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }

  async deleteRefreshToken(token) {
    await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  }
}

module.exports = AuthRepository;
