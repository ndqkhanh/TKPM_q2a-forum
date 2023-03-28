const Joi = require('joi');

const createQuestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

module.exports = {
  createQuestion,
};
