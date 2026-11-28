const AuthRepository = require('./AuthRepository');
const AuthValidator = require('./AuthValidator');
const UsersRepository = require('../users/UsersRepository');
const tokenManager = require('../../utils/tokenManager');

const authRepository = new AuthRepository();
const usersRepository = new UsersRepository();

const postAuthentication = async (req, res, next) => {
  try {
    AuthValidator.validatePostAuthPayload(req.body);
    const { username, password } = req.body;

    const userId = await usersRepository.verifyUserCredential(username, password);
    const accessToken = tokenManager.generateAccessToken({ userId });
    const refreshToken = tokenManager.generateRefreshToken({ userId });

    await authRepository.addRefreshToken(refreshToken);

    return res.status(201).json({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const putAuthentication = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshTokenPayload(req.body);
    const { refreshToken } = req.body;

    await authRepository.verifyRefreshToken(refreshToken);
    const { userId } = tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = tokenManager.generateAccessToken({ userId });

    return res.status(200).json({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: { accessToken },
    });
  } catch (err) {
    return next(err);
  }
};

const deleteAuthentication = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshTokenPayload(req.body);
    const { refreshToken } = req.body;

    await authRepository.verifyRefreshToken(refreshToken);
    await authRepository.deleteRefreshToken(refreshToken);

    return res.status(200).json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  postAuthentication,
  putAuthentication,
  deleteAuthentication,
};
