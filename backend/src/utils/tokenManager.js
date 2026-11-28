const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const tokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE, 10) || 900,
    }),

  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch {
      throw new InvariantError('Refresh token tidak valid.');
    }
  },
};

module.exports = tokenManager;
