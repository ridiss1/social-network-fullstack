const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { signUpValidator, signInValidator } = require('../validator/index');

const router = express.Router();

router.post('/signup', signUpValidator, signUp);
router.post('/signin', signInValidator, signIn);

module.exports = router;
