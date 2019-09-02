const express = require('express');
const { getPosts, createPost } = require('../controllers/post');
const { createPostValidator } = require('../validator/index');
const requireSignin = require('../middleware/requireSignin');

const router = express.Router();

router.get('/', requireSignin, getPosts);
router.post('/post', createPostValidator, createPost);

module.exports = router;
