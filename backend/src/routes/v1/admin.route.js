const express = require('express');
const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const adminController = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth');
const { adminService } = require('../../services');

const router = express.Router();

router.route('/metrics').get(auth('getMetrics'), adminController.getMetrics);

router.route('/list-users/:page/:limit').get(auth('getUsers'), validate(adminValidation.getUsers), adminController.getUsers);

router.route('/list-configuration').get(auth('listConfigurations'), adminController.listConfigurations);

module.exports = router;
