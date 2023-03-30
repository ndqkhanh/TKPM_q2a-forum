const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService } = require('../services');

const newAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.createAnswer(req);
  res.send(answer);
});

const updateAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.changeAnswer(req);
  res.send(answer);
});

const pickCorrectAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.pickCorrectAnswerById(req);
  res.send({ success: !!answer });
});

const deleteAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.delAnswerById(req.params.answerId);
  res.send({ success: !!answer });
});

module.exports = {
  newAnswer,
  updateAnswer,
  deleteAnswer,
  pickCorrectAnswer,
};
