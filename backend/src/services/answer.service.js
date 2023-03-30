const httpStatus = require('http-status');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');

const createAnswer = async (req) => {
  const checkQuestionExists = await prisma.questions.findUnique({
    where: {
      id: req.body.qid,
    },
  });
  if (!checkQuestionExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Question does not exist');
  }
  // Check if the question is approved
  if (checkQuestionExists.status !== 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Question is not approved');
  }
  const userid = req.user.id;
  const answer = prisma.answers.create({
    data: {
      qid: req.body.qid,
      content: req.body.content,
      uid: userid,
    },
  });
  return answer;
};

const changeAnswer = async (req) => {
  const checkAnswerExists = await prisma.answers.findUnique({
    where: {
      id: req.params.answerId,
    },
  });
  if (!checkAnswerExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Answer does not exist');
  }
  const answer = prisma.answers.update({
    where: {
      id: req.params.answerId,
    },
    data: {
      content: req.body.content,
      updated_at: new Date(),
    },
  });
  return answer;
};

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

const delAnswerById = async (answerId) => {
  const checkAnswerExists = await prisma.answers.findUnique({
    where: {
      id: answerId,
    },
  });
  if (!checkAnswerExists) {
    return null;
  }
  let deleteAnswer = null;
  if (checkAnswerExists) {
    deleteAnswer = await prisma.answers.delete({
      where: {
        id: answerId,
      },
    });
  }
  return deleteAnswer;
};

module.exports = {
  createAnswer,
  changeAnswer,
  delAnswerById,
  pickCorrectAnswerById,
};
