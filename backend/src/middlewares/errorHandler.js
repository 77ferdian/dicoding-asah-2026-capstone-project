const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  if (err.statusCode === 503) {
    return res.status(503).json({
      status: 'error',
      message: err.message || 'Layanan AI sedang tidak tersedia. Coba lagi nanti.',
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server.',
  });
};

module.exports = errorHandler;
