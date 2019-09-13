const express = require('express');
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  getPhotoPost,
  getPost,
  likePost,
  unlikePost,
  comment,
  deleteComment
} = require('../controllers/post');
const { createPostValidator } = require('../helpers');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();
router.put('/like', requireSignin, likePost);
router.put('/unlike', requireSignin, unlikePost);
router.put('/comment', requireSignin, comment);
router.put('/deletecomment', requireSignin, deleteComment);
router.get('/', getPosts);

router.post('/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/by/:userId', requireSignin, postsByUser);
router.get('/photo/:postId', getPhotoPost);
router.get('/:postId', requireSignin, getPost);
router.delete('/:postId', requireSignin, isPoster, deletePost);
router.put('/:postId', requireSignin, isPoster, updatePost);

router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
