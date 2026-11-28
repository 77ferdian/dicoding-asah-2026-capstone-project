const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const UserPayloadSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.base': 'Username harus berupa string.',
      'string.min': 'Username minimal 3 karakter.',
      'string.max': 'Username maksimal 50 karakter.',
      'string.pattern.base': 'Username hanya boleh berisi huruf, angka, dan underscore.',
      'any.required': 'Username wajib diisi.',
    }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password harus berupa string.',
    'string.min': 'Password minimal 8 karakter.',
    'any.required': 'Password wajib diisi.',
  }),
  fullname: Joi.string().min(1).max(100).required().messages({
    'string.base': 'Fullname harus berupa string.',
    'string.min': 'Fullname minimal 1 karakter.',
    'string.max': 'Fullname maksimal 100 karakter.',
    'any.required': 'Fullname wajib diisi.',
  }),
});

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = UsersValidator;
