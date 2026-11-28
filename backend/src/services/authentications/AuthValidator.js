const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PostAuthSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': "'username' wajib diisi.",
  }),
  password: Joi.string().required().messages({
    'any.required': "'password' wajib diisi.",
  }),
});

const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': "'refreshToken' wajib diisi.",
  }),
});

const AuthValidator = {
  validatePostAuthPayload: (payload) => {
    const { error } = PostAuthSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateRefreshTokenPayload: (payload) => {
    const { error } = RefreshTokenSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = AuthValidator;
