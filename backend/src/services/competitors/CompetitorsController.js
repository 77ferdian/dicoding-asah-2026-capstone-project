const CompetitorsRepository = require('./CompetitorsRepository');

const competitorsRepository = new CompetitorsRepository();

const getBenchmarking = async (req, res, next) => {
  try {
    const data = await competitorsRepository.getBenchmarking();

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getBenchmarking };
