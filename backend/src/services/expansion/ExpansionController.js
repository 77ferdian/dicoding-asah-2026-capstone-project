const ExpansionService = require('./ExpansionService');
const InvariantError = require('../../exceptions/InvariantError');

const getMapData = async (req, res, next) => {
  try {
    const data = await ExpansionService.getMapData();
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const listCandidates = async (req, res, next) => {
  try {
    const data = ExpansionService.listCandidates();
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const addCandidate = async (req, res, next) => {
  try {
    const { label, lat, lng } = req.body;
    if (!label || lat === undefined || lng === undefined) {
      throw new InvariantError('label, lat, dan lng wajib diisi.');
    }
    const data = ExpansionService.addCandidate({ label, lat, lng });
    return res.status(201).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    ExpansionService.deleteCandidate(req.params.id);
    return res.status(200).json({ status: 'success', message: 'Kandidat dihapus.' });
  } catch (err) {
    return next(err);
  }
};

const analyzeCandidate = async (req, res, next) => {
  try {
    const data = await ExpansionService.analyzeCandidate(req.params.id, req.body);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const compareCandidates = async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);
    const data = await ExpansionService.compareCandidates(ids);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const generateInsight = async (req, res, next) => {
  try {
    const data = await ExpansionService.generateInsight(req.params.id, req.body);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const geocodeAddress = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new InvariantError('Query pencarian (q) wajib diisi.');
    }
    const data = await ExpansionService.geocodeAddress(q);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

const scrapeReviews = async (req, res, next) => {
  try {
    const { placeIds, maxReviews } = req.body;
    if (!Array.isArray(placeIds) || !placeIds.length) {
      throw new InvariantError('placeIds harus berupa array yang tidak kosong.');
    }
    const data = await ExpansionService.scrapePlaceReviews(placeIds, maxReviews);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getMapData,
  listCandidates,
  addCandidate,
  deleteCandidate,
  analyzeCandidate,
  compareCandidates,
  generateInsight,
  geocodeAddress,
  scrapeReviews,
};
