const AiService = require('./AiService');
const InvariantError = require('../../exceptions/InvariantError');

const VALID_ASPECTS = ['rasa', 'harga', 'pelayanan', 'tempat'];

const postInsights = async (req, res, next) => {
  try {
    const { aspect, timeRange } = req.body || {};

    if (aspect && !VALID_ASPECTS.includes(aspect)) {
      throw new InvariantError(
        'Aspek harus salah satu dari: rasa, harga, pelayanan, tempat.'
      );
    }

    const data = await AiService.generateInsights({ aspect, timeRange });

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { postInsights };
