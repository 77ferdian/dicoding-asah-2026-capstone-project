const ReviewsRepository = require('./ReviewsRepository');
const InvariantError = require('../../exceptions/InvariantError');

const reviewsRepository = new ReviewsRepository();
const VALID_ASPECTS = ['rasa', 'harga', 'pelayanan', 'tempat'];

const getReviewsSummary = async (req, res, next) => {
  try {
    const { aspect, startDate, endDate } = req.query;

    if (aspect && !VALID_ASPECTS.includes(aspect)) {
      throw new InvariantError(
        'Aspek harus salah satu dari: rasa, harga, pelayanan, tempat.'
      );
    }

    const data = await reviewsRepository.getSummary({ aspect, startDate, endDate });

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getReviewsSummary };
