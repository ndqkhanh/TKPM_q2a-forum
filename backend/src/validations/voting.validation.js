const Joi = require('joi');

const VoteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.number().required(),
  }),
};

module.exports = {
  VoteAnswer,
};
