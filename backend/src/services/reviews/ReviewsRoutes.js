const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { getReviewsSummary } = require('./ReviewsController');

const router = express.Router();

router.get('/summary', authMiddleware, getReviewsSummary);

module.exports = router;
