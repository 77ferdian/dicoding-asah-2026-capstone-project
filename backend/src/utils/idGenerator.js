const { nanoid } = require('nanoid');

const generateUserId = () => `user-${nanoid(12)}`;

module.exports = { generateUserId };
