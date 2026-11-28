const express = require('express');
const {
  postAuthentication,
  putAuthentication,
  deleteAuthentication,
} = require('./AuthController');

const router = express.Router();

router.post('/', postAuthentication);
router.put('/', putAuthentication);
router.delete('/', deleteAuthentication);

module.exports = router;
