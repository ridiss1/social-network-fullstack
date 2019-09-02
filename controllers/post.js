const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().select('_id title body');
    res.json({ posts });
  } catch (error) {
    console.log(err);
    res.status(400).json({ error });
  }
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const post = new Post(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(err);
    res.status(400).json({ error });
  }
};
