const express = require('express');
const { postUser } = require('./UsersController');

const router = express.Router();

router.post('/', postUser);

module.exports = router;
