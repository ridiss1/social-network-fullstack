const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
require('dotenv').config();

exports.signUp = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array()[0].msg });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(403).json({ error: 'Email is taken!' });

    user = new User(req.body);
    await user.save();
    res.json({ message: 'SignUp success! Please LogIn.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};

exports.signIn = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    //if user is found make sure the email and password match
    //create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ error: 'Email and password do not match.' });
    }
    const { _id, name } = user;
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user }); //Sending the token back to the client
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Server Error...`);
  }
};
