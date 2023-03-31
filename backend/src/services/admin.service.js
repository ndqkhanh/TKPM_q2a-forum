const httpStatus = require('http-status');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

const disableUser = async (req) => {
  const checkUserExists = await userService.getUserById(req.params.userId);
  if (!checkUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!(checkUserExists.role === 2)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is a moderator or an admin');
  }
  if (checkUserExists.disabled === true && req.body.status === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already banned');
  } else if (checkUserExists.disabled === false && req.body.status === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already unbanned');
  }
  const user = await prisma.users.update({
    where: { id: req.params.userId },
    data: { disabled: req.body.status },
  });
  return user;
};

const getAllMetrics = async () => {
  const questionCount = await prisma.questions.count();
  const userCount = await prisma.users.count();
  const answerCount = await prisma.answers.count();
  return { numOfQuestions: questionCount, numOfUsers: userCount, numOfAnswers: answerCount };
};

const getPendingQuestions = async (page, limit) => {
  const listPendingQuestions = await prisma.questions.findMany({
    skip: page * limit,
    take: limit,
    where: {
      status: 0,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });
  const countPendingQuestions = await prisma.questions.count({
    where: {
      status: 0,
    },
  });

  for (let i = 0; i < listPendingQuestions.length; i++) {
    const question = listPendingQuestions[i];
    question.userData = await prisma.users.findUnique({
      where: {
        id: question.uid,
      },
      select: {
        name: true,
        profilepictureurl: true,
      },
    });
  }
  return { count: countPendingQuestions, data: listPendingQuestions };
};

const setConfiguration = async (req) => {
  const isConfigExist = await prisma.configuration.findUnique({
    where: { slug: req.params.slug },
  });

  if (!isConfigExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Configuration Not Found');
  }

  const config = await prisma.configuration.update({
    where: { slug: req.params.slug },
    data: {
      value: req.body.value,
    },
  });

  return config;
};
module.exports = {
  disableUser,
  getAllMetrics,
  getPendingQuestions,
  setConfiguration,
};
