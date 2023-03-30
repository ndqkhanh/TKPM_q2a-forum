const Joi = require('joi');

const newAnswer = {
  body: Joi.object().keys({
    qid: Joi.string().uuid().required(),
    content: Joi.string().required(),
  }),
};

const updateAnswer = {
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

const pickCorrectAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    correct: Joi.boolean().required(),
  }),
};

const deleteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().uuid().required(),
  }),
};


module.exports = {
  newAnswer,
  updateAnswer,
  deleteAnswer,
  pickCorrectAnswer,
};
