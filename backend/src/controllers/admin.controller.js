const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const banUser = catchAsync(async (req, res) => {
  const user = await adminService.disableUser(req);
  res.send({ success: !!user });
});

const getMetrics = catchAsync(async (req, res) => {
  const metrics = await adminService.getAllMetrics();
  res.send(metrics);
});

const getUsers = catchAsync(async (req, res) => {
  const result = await adminService.getUsers(req.params.page, req.params.limit);
  res.send(result);
});

const listConfigurations = catchAsync(async (req, res) => {
  const configuration = await adminService.listConfigurations();
  res.send(configuration);
});

module.exports = {
  banUser,
  getMetrics,
  getUsers,
  listConfigurations,
};
