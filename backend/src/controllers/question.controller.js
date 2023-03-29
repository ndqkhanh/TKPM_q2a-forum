const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const questionService = require('../services/question.service');

const createQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createQuestion(req);

  res.status(httpStatus.CREATED).send(question);
});

const deleteQuestion = catchAsync(async (req, res) => {
  const question = await questionService.deleteQuestionById(req.params.questionId);
  res.send({ success: !!question });
});

const searchQuestion = catchAsync(async (req, res) => {
  const countQuestions = await questionService.countQuestionInDB(req);
  const listQuestions = await questionService.searchQuestion(req);
  res.send({ count: countQuestions, questions: listQuestions });
});
module.exports = {
  createQuestion,
  deleteQuestion,
  searchQuestion,
};
