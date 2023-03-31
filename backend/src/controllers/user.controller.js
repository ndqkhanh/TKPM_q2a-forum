const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { use } = require('passport');

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  delete user.password;
  res.send(user);
});


const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  delete user.password;
  res.send(user);
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  delete user.password;
  res.send(user);
});

module.exports = {
  getUser,
  updateUser,
  getProfile,
};
