const express = require('express');
const { getPosts, createPost } = require('../controllers/post');
const { userByID } = require('../controllers/user');
const { createPostValidator } = require('../validator/index');
const requireSignin = require('../middleware/requireSignin');

const router = express.Router();

router.get('/', getPosts);
router.post('/post', requireSignin, createPostValidator, createPost);

//any route containing :userID, our app will first execute userByID()
router.param('userID', userByID);

module.exports = router;
