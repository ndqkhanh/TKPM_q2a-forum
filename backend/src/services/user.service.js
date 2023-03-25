const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const saltRounds = 10;

  userBody.password = await bcrypt.hash(userBody.password, saltRounds);

  const checkUsername = await prisma.users.findUnique({
    where: {
      username: userBody.username,
    },
  });

  if (checkUsername) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  const user = prisma.users.create({
    data: userBody,
  });

  return user;
};

module.exports = {
  createUser,
};
