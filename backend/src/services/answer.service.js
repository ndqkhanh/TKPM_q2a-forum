const httpStatus = require('http-status');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');

const pickCorrectAnswerById = async (req) => {
  const checkAnswerExists = await prisma.answers.findUnique({
    where: {
      id: req.params.answerId,
    },
  });
  if (!checkAnswerExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Answer does not exist');
  }
  const checkOwnQuestion = await prisma.questions.findUnique({
    where: {
      id: checkAnswerExists.qid,
    },
  });
  if (checkOwnQuestion.uid !== req.user.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not the owner of this question');
  }
  const existCorrectAns = await prisma.answers.findFirst({
    where: {
      qid: checkAnswerExists.qid,
      correct: true,
    },
  });

  // When pick another correct answer when already exist one
  // Delete correct the old one
  // Pick correct the new one
  if (existCorrectAns && existCorrectAns.id != req.params.answerId) {
    const deleteCorrectExistedAnswer = await prisma.answers.update({
      where: {
        id: existCorrectAns.id,
      },
      data: {
        correct: null,
        updated_at: new Date(),
      },
    });

    const updateCorrectNewAnswer = await prisma.answers.update({
      where: {
        id: req.params.answerId,
      },
      data: {
        correct: req.body.correct === true ? true : null,
        updated_at: new Date(),
      },
    });

    return updateCorrectNewAnswer;
  }

  // Update a existed answer in database
  const answer = await prisma.answers.update({
    where: {
      id: req.params.answerId,
    },
    data: {
      correct: req.body.correct === true ? true : null,
      updated_at: new Date(),
    },
  });
  return answer;
};

module.exports = {
  pickCorrectAnswerById,
};
