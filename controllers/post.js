const Post = require('../models/Post');
const fs = require('fs');
const { validationResult } = require('express-validator');
const formidable = require('formidable');
const _ = require('lodash');

exports.postByID = async (req, res, next) => {
  try {
    const userID = req.params.postID;
    const post = await Post.findById(userID);
    if (!post) {
      return res.status(400).json({ error: 'Post not found!' });
    }
    req.post = post;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('postedBy', 'id name')
      .select('_id title body');
    res.json({ posts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    let post = new Post(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      return res.json(result);
    });
  });
};

exports.postsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate('postedBy', '_id name')
      .sort('_created');
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = req.post;
    post = _.extend(post, req.body); // extend - mutate the source object
    post.updated = Date.now();
    await post.save();
    res.json({ post });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.deletePost = async (req, res) => {
  try {
    let post = req.post;
    await post.remove();
    res.json({ message: 'Post deleted ' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
