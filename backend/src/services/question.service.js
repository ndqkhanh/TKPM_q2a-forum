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

module.exports = {
  createQuestion,
};
