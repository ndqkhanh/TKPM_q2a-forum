const Joi = require('joi');

const createQuestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().uuid().required(),
  }),
};

const updateQuestion = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    title: Joi.string().required(),
  }),
};

const searchQuestion = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
  }),
  params: Joi.object().keys({
    offset: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

const getLatestFeed = {
  params: Joi.object().keys({
    page: Joi.number().required(),
  }),
};

const getAllAnswersAndVotings = {
  params: Joi.object().keys({
    questionId: Joi.string().uuid().required(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
module.exports = {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  searchQuestion,
  getLatestFeed,
  getAllAnswersAndVotings,
};
