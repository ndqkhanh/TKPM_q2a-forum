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


module.exports = {
  disableUser,
};
