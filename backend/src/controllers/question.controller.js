const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const questionService = require('../services/question.service');

const createQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createQuestion(req);

  res.status(httpStatus.CREATED).send(question);
});

module.exports = {
  createQuestion,
};
