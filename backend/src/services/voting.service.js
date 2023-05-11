// const { PrismaClient, Prisma } = require('@prisma/client');
const httpStatus = require('http-status');
const Database = require('../utils/database');
const ApiError = require('../utils/ApiError');

const prisma = Database().getInstance();

const VoteAnswer = async (req) => {
  const answer = await prisma.answers.findUnique({
    where: {
      id: req.params.answerId,
    },
  });

  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer Not Found');
  }

  const checkVotingExist = await prisma.voting.findFirst({
    where: {
      aid: req.params.answerId,
      uid: req.user.id,
    },
  });

  if (req.body.status === 2 && !checkVotingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Voting Not Found');
  }

  if (req.body.status === 2) {
    const voting = await prisma.voting.delete({
      where: {
        id: checkVotingExist.id,
      },
    });
    return voting;
  }

  let flag = true;
  if (req.body.status === 0) flag = true;
  else flag = false;
  if (!checkVotingExist) {
    const voting = await prisma.voting.create({
      data: {
        uid: req.user.id,
        aid: answer.id,
        status: flag,
      },
    });
    return voting;
  }
  const voting = await prisma.voting.update({
    data: {
      status: flag,
    },
    where: {
      id: checkVotingExist.id,
    },
  });
  return voting;
};

module.exports = {
  VoteAnswer,
};
