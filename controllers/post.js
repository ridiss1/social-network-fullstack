const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .select('_id title content created likes comments')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          err
        });
      }
      req.post = post;
      next();
    });
};

exports.getPost = (req, res) => {
  return res.json(req.post);
};

exports.getPosts = (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .select('_id title content created likes comments')
    .sort({ created: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.json({ err }));
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: 'Image could not be uploaded'
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
    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          err
        });
      }
      res.json(post);
    });
  });
};

exports.postsByUser = (req, res) => {
  Post.find({
    postedBy: req.profile._id
  })
    .populate('postedBy', '_id name')
    .sort('_created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          err
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      err: ' User is not authorized'
    });
  }
  next();
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        err
      });
    }
    res.json({
      message: ' Post deleted successfully!'
    });
  });
};

// exports.updatePost = (req, res) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) return res.status(400).json({
//             err
//         });
//         res.json(post);
//     })
// }

exports.updatePost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: 'Image could not be uploaded'
      });
    }
    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save().then(() => {
      res.json(post);
    });
  });
};

exports.getPhotoPost = (req, res) => {
  if (req.post.photo.data) {
    res.set(('Content-Type', req.post.photo.contentType));
    return res.send(req.post.photo.data);
  } else res.send(undefined);
};

exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  )
    .select('_id title content created likes')
    .exec((err, data) => {
      if (err) res.json({ err });
      res.json(data);
    });
};

exports.unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  )
    .select('_id title content created likes')
    .exec((err, data) => {
      if (err) res.json({ err });
      res.json(data);
    });
};

exports.comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .select('_id title content created likes comments')
    .exec((err, data) => {
      if (err) res.json({ err });
      res.json(data);
    });
};

exports.deleteComment = (req, res) => {
  let comment = req.body.comment;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .select('_id title content created likes comments')
    .exec((err, data) => {
      if (err) res.json({ err });
      res.json(data);
    });
};
