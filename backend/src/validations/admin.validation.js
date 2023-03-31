const Joi = require('joi');
const { status } = require('./custom.validation');

const banUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.boolean().required(),
  }),
};

const getUsers = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

const getPendingQuestions = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
const setConfiguration = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object().keys({
    value: Joi.string(),
  }),
};

module.exports = {
  banUser,
  getUsers,
  getPendingQuestions,
  setConfiguration,
};
