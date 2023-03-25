const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUserWithUsernameAndPassword(req.body.username, req.body.password);
  const tokens = await tokenService.generateAuthTokens(user);
  delete user.password;
  res.send({ tokens });
});

module.exports = {
  login,
};
