const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak ditemukan.',
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid atau kedaluwarsa.',
    });
  }
};

module.exports = authMiddleware;
