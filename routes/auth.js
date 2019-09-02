const express = require('express');
const { signUp } = require('../controllers/auth');
const { signUpValidator } = require('../validator/index');

const router = express.Router();

router.post('/signup', signUpValidator, signUp);

module.exports = router;
