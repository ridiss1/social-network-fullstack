const express = require('express');
const {
  getPosts,
  createPost,
  postsByUser,
  postByID,
  deletePost,
  updatePost
} = require('../controllers/post');
const { userByID } = require('../controllers/user');
const { createPostValidator } = require('../validator/index');
const requireSignin = require('../middleware/requireSignin');

const router = express.Router();

router.get('/posts', getPosts);
router.post(
  '/post/new/:userID',
  requireSignin,
  createPost,
  createPostValidator
);
router.get('/posts/by/:userID', requireSignin, postsByUser);
router.put('/post/:postID', requireSignin, updatePost);
router.delete('/post/:postID', requireSignin, deletePost);
//any route containing :userID, our app will first execute userByID()
router.param('userID', userByID);

//any route containing :postID, our app will first execute postByID()
router.param('postID', postByID);

module.exports = router;
