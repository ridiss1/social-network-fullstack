const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const { userSignupValidator } = require('../helpers');
const { userById } = require('../controllers/user');
const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.post('/signout', signout);

//any route containing :userId, out app will first execute userById()
router.param('userId', userById);

module.exports = router;
