const { PrismaClient, Prisma } = require('@prisma/client');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const prisma = new PrismaClient();

const createQuestion = async (req) => {
  const userId = req.user.id;
  const question = prisma.questions.create({
    data: {
      uid: userId,
      content: req.body.content,
      title: req.body.title,
    },
  });
  return question;
};

const deleteQuestionById = async (questionId) => {
  const existQuestion = await prisma.questions.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!existQuestion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question Not Found');
  }

  const deleteQuestion = await prisma.questions.delete({
    where: {
      id: questionId,
    },
  });

  return deleteQuestion;
};

module.exports = {
  createQuestion,
  deleteQuestionById,
};
