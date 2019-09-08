const _ = require('lodash');
const User = require('../models/User');

exports.userByID = async (req, res, next) => {
  try {
    const userID = req.params.userID;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({ error: 'User not found!' });
    }
    req.profile = user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email _id created updated');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = async (req, res) => {
  try {
    let user = req.profile;
    user = _.extend(user, req.body); // extend - mutate the source object
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = req.profile;
    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};
