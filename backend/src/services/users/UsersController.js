const UsersRepository = require('./UsersRepository');
const UsersValidator = require('./UsersValidator');
const { generateUserId } = require('../../utils/idGenerator');

const usersRepository = new UsersRepository();

const postUser = async (req, res, next) => {
  try {
    UsersValidator.validateUserPayload(req.body);
    const { username, password, fullname } = req.body;

    await usersRepository.verifyUsername(username);
    const id = generateUserId();
    const userId = await usersRepository.addUser({ id, username, password, fullname });

    return res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { postUser };
