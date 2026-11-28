const express = require('express');
const {
  getMapData,
  listCandidates,
  addCandidate,
  deleteCandidate,
  analyzeCandidate,
  compareCandidates,
  generateInsight,
  geocodeAddress,
  scrapeReviews,
} = require('./ExpansionController');

const router = express.Router();

router.get('/map-data', getMapData);
router.get('/candidates', listCandidates);
router.post('/candidates', addCandidate);
router.delete('/candidates/:id', deleteCandidate);
router.post('/candidates/:id/analyze', analyzeCandidate);
router.post('/candidates/:id/insight', generateInsight);
router.get('/compare', compareCandidates);
router.get('/geocode', geocodeAddress);
router.post('/scrape-reviews', scrapeReviews);

module.exports = router;
