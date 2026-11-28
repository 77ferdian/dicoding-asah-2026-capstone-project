const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { postInsights } = require('./AiController');

const router = express.Router();

router.post('/insights', authMiddleware, postInsights);

module.exports = router;
