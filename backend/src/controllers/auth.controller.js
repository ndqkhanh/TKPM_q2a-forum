const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUserWithUsernameAndPassword(req.body.username, req.body.password);
  const tokens = await tokenService.generateAuthTokens(user);
  delete user.password;
  res.send({ tokens });
});

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  delete user.password;
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  login,
  register,
  logout,
};
