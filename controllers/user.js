const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          err: 'User not found'
        });
      }
      req.profile = user;
      next();
    });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      err: 'User is not authorized to perform this action'
    });
  }
  next();
};

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err)
      return res.status(400).json({
        err
      });
    res.json(users);
  }).select('_id name email');
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

// exports.updateUser = (req, res) => {
//     let user = req.profile;
//     user = _.extend(user, req.body);
//     user.updated = Date.now();
//     user.save()
//         .then(() => {
//             user.hashed_password = undefined;
//             user.salt = undefined;
//             res.json(user)
//         })
// }

exports.updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: 'Image could not be uploaded'
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save().then(() => {
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

exports.removeUser = (req, res) => {
  user = req.profile;
  user
    .remove()
    .then(() => {
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json({
        message: 'Delete success!'
      });
    })
    .catch(err => res.status(400).json(err));
};

exports.getPhotoUser = (req, res) => {
  if (req.profile.photo.data) {
    res.set(('Content-Type', req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  } else res.send(undefined);
};

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) return res.status(400).json({ err });
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) return res.status(400).json({ err });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) return res.status(400).json({ err });
      next();
    }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) return res.status(400).json({ err });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

exports.findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) return res.json({ err });
    res.json(users);
  });
};
