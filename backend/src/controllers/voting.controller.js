const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const votingService = require('../services/voting.service');

const VoteAnswer = catchAsync(async (req, res) => {
  let vote = await votingService.VoteAnswer(req);
  return res.send({ success: !!vote });
});

module.exports = {
  VoteAnswer,
};
