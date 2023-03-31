const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const votingValidation = require('../../validations/voting.validation');
const votingControlller = require('../../controllers/voting.controller');

const router = express.Router();

router.route('/:answerId').post(auth('voteAnswer'), validate(votingValidation.VoteAnswer), votingControlller.VoteAnswer);

module.exports = router;
