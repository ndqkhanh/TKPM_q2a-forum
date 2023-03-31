const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const questionValidation = require('../../validations/question.validation');
const questionControlller = require('../../controllers/question.controller');
const route = express.Router();

route
  .route('/')
  .post(auth('createQuestion'), validate(questionValidation.createQuestion), questionControlller.createQuestion);

route
  .route('/:questionId')
  .delete(auth('deleteQuestion'), validate(questionValidation.deleteQuestion), questionControlller.deleteQuestion)
  .post(auth('updateQuestion'), validate(questionValidation.updateQuestion), questionControlller.updateQuestion);

route
  .route('/search/:offset/:limit')
  .post(auth('searchQuestion'), validate(questionValidation.searchQuestion), questionControlller.searchQuestion);

route
  .route('/feed/:page')
  .get(auth('getLatestFeed'), validate(questionValidation.getLatestFeed), questionControlller.getLatestFeed);

route
  .route('/:questionId/:page/:limit')
  .get(
    auth('getAllAnswersAndVotings'),
    validate(questionValidation.getAllAnswersAndVotings),
    questionControlller.getAllAnswersAndVotings
  );

module.exports = route;
