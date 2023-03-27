const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const questionValidation = require('../../validations/question.validation');
const questionControlller = require('../../controllers/question.controller');
const route = express.Router();

route
  .route('/')
  .post(auth('createQuestion'), validate(questionValidation.createQuestion), questionControlller.createQuestion);

module.exports = route;
