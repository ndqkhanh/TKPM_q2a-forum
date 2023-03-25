const Joi = require('joi');
const { password, username } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  login,
};
