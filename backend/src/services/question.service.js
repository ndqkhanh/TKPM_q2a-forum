// const { PrismaClient, Prisma } = require('@prisma/client');
const Database = require('../utils/database');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const prisma = new Database().getInstance();

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

const updateQuestion = async (req) => {
  const { questionId } = req.params;
  const question = await prisma.questions.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question Not Found');
  }

  if (question.uid != req.user.id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not the owner of this question');
  }

  if (question.status != 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question is not approved!');
  }
  const newTitle = req.body.title;
  const newContent = req.body.content;

  const updatedQuestion = await prisma.questions.update({
    where: {
      id: questionId,
    },
    data: {
      content: newContent,
      title: newTitle,
      updated_at: new Date(),
    },
  });

  return updatedQuestion;
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

const getLatestFeed = async (page) => {
  const configuration = await prisma.configuration.findUnique({
    where: {
      slug: 'NUM_OF_QUESTIONS_IN_FEED',
    },
  });

  let numFeed = 10;
  try {
    numFeed = parseInt(configuration.value);
  } catch (error) {
    console.log('Not a number', error);
  }

  const feed = await prisma.questions.findMany({
    skip: page * numFeed,
    take: numFeed,
    where: {
      status: 2,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  for (let i = 0; i < feed.length; i++) {
    const question = feed[i];
    question.numOfAnswers = await prisma.answers.count({
      where: {
        qid: question.id,
      },
    });
    const answer = await prisma.answers.findFirst({
      where: {
        qid: question.id,
        correct: true,
      },
    });
    question.correctAnswerExists = !!answer;
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

  const quesCount = await prisma.questions.count({
    where: {
      status: 2,
    },
  });

  return { count: quesCount, data: feed };
};

const getQuestionByID = async (req) => {
  const questionRecord = await prisma.questions.findUnique({
    where: { id: req.params.questionId },
  });
  const userRecord = await prisma.users.findUnique({
    where: { id: questionRecord.uid },
  });
  return {
    questionInfo: questionRecord,
    uid: userRecord.id,
    name: userRecord.name,
    avatarUrl: userRecord.profilepictureurl,
  };
};
const GetAnswersByQuestionIDPagination = async (req) => {
  const answers = await prisma.answers.findMany({
    skip: req.params.page * req.params.limit,
    take: req.params.limit,
    where: { qid: req.params.questionId },
  });

  return answers;
};

const GetAnswersAndVotings = async (answers, userId) => {
  const answersAndvotings = [];
  for (let i = 0; i < answers.length; i++) {
    const upvotes = await prisma.voting.findMany({
      where: { aid: answers[i].id, status: true },
    });

    const downvotes = await prisma.voting.findMany({
      where: { aid: answers[i].id, status: false },
    });

    const user = await prisma.users.findUnique({
      where: { id: answers[i].uid },
    });
    const voting = await prisma.voting.findFirst({
      where: {
        aid: answers[i].id,
        uid: userId,
      },
    });
    answersAndvotings.push({
      answer: answers[i],
      count_upvotes: upvotes.length,
      count_downvotes: downvotes.length,
      minus_upvote_downvote: upvotes.length - downvotes.length,
      name: user.name,
      profilepictureurl: user.profilepictureurl,
      voting_status: voting ? voting.status : null,
    });
  }

  return answersAndvotings;
};

const countAnswerByQuestionID = async (req) => {
  const answers = await prisma.answers.findMany({
    where: { qid: req.params.questionId },
  });

  return answers.length;
};
module.exports = {
  createQuestion,
  deleteQuestionById,
  updateQuestion,
  searchQuestion,
  getLatestFeed,
  GetAnswersByQuestionIDPagination,
  GetAnswersAndVotings,
  countAnswerByQuestionID,
  countQuestionInDB,
  getQuestionByID,
};
