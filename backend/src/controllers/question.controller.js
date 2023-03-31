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

const updateQuestion = catchAsync(async (req, res) => {
  const question = await questionService.updateQuestion(req);
  res.send(question);
});

const searchQuestion = catchAsync(async (req, res) => {
  const countQuestions = await questionService.countQuestionInDB(req);
  const listQuestions = await questionService.searchQuestion(req);
  res.send({ count: countQuestions, questions: listQuestions });
});

const getLatestFeed = catchAsync(async (req, res) => {
  const latestFeed = await questionService.getLatestFeed(req.params.page);
  res.send(latestFeed);
});

const getAllAnswersAndVotings = catchAsync(async (req, res) => {
  const questionRecord = await questionService.getQuestionByID(req);
  const countAnswer = await questionService.countAnswerByQuestionID(req);
  const answers = await questionService.GetAnswersByQuestionIDPagination(req);
  const answersAndvotings = await questionService.GetAnswersAndVotings(answers, req.user.id);
  res.send({ question: questionRecord, answers: { count: countAnswer, data: answersAndvotings } });
});
module.exports = {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  searchQuestion,
  getLatestFeed,
  getAllAnswersAndVotings,
};
