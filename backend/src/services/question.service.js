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

const countQuestionInDB = async (req) => {
  const countQuestion = await prisma.questions.count({
    where: {
      title: {
        contains: req.body.keyword,
      },
      status: 2,
    },
  });
  return countQuestion;
};

const searchQuestion = async (req) => {
  const countQuestions = await prisma.questions.count({});
  if (req.params.offset > countQuestions / req.params.limit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found Questions Related');
  }

  const listQuestions = await prisma.questions.findMany({
    skip: req.params.offset * req.params.limit,
    take: req.params.limit,
    where: {
      title: {
        contains: req.body.keyword,
      },
      status: 2,
    },
  });

  if (!listQuestions) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is no questions related to keywords');
  }

  let data = [];

  for (let i = 0; i < listQuestions.length; i++) {
    const user = await prisma.users.findUnique({
      where: {
        id: listQuestions[i].uid,
      },
    });

    const answers = await prisma.answers.findMany({
      where: {
        qid: listQuestions[i].id,
      },
    });

    let check = false;

    for (let j = 0; j < answers.length; j++) {
      if (answers[j].correct == true) check = true;
    }

    data.push({
      questionData: listQuestions[i],
      numOfAnswers: answers.length,
      correctAnswerExists: check,
      userData: {
        name: user.name,
        profilepictureurl: user.profilepictureurl,
      },
    });
  }
  return data;
};

module.exports = {
  createQuestion,
  deleteQuestionById,
  countQuestionInDB,
  searchQuestion,
};
