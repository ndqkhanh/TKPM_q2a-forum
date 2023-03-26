const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService } = require('../services');

const newAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.createAnswer(req);
  res.send(answer);
});

module.exports = {
  newAnswer,
};
