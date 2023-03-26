const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/signin', validate(authValidation.login), authController.login);
router.post('/signup', validate(authValidation.register), authController.register);
router.post('/logout', validate(authValidation.logout), authController.logout);

module.exports = router;