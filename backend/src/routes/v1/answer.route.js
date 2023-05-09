const express = require('express');
const validate = require('../../middlewares/validate');
const ansValidation = require('../../validations/answer.validation');
const ansController = require('../../controllers/answer.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(auth('createAnswer'), validate(ansValidation.newAnswer), ansController.newAnswer);

router
  .route('/:answerId')
  .post(auth('updateAnswer'), validate(ansValidation.updateAnswer), ansController.updateAnswer)
  .delete(auth('deleteAnswer'), validate(ansValidation.deleteAnswer), ansController.deleteAnswer);

router
  .route('/:answerId/pick-correct')
  .post(auth('pickCorrectAnswer'), validate(ansValidation.pickCorrectAnswer), ansController.pickCorrectAnswer);

module.exports = router;
