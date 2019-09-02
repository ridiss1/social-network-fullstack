const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.getPosts = (req, res) => {
  res.send('ad');
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
    res.status(400).json({ error });
  }
};
