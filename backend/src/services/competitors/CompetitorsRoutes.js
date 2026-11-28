const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { getBenchmarking } = require('./CompetitorsController');

const router = express.Router();

router.get('/benchmarking', authMiddleware, getBenchmarking);

module.exports = router;
