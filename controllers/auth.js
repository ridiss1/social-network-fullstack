const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const expressJwt = require('express-jwt');
dotenv.config();

exports.signup = async (req, res) => {
  const userExist = await User.findOne({
    email: req.body.email
  });
  if (userExist)
    return res.status(403).json({
      err: 'Email is taken!'
    });
  const user = await new User(req.body);
  await user.save();
  res.json({
    message: 'Sign up success!!'
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne(
    {
      email
    },
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          err: "Email doesn't exist. Please sign up"
        });
      }
      //if user is found make sure the email and password match
      //create authenticate method in model and use here
      if (!user.authenticate(password)) {
        return res.status(401).json({
          err: 'Email and password do not match'
        });
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        process.env.JWT_SECRET
      );
      res.cookie('t', token, {
        expire: new Date() + 9999
      });
      const { _id, name, email } = user;
      return res.json({
        token,
        user: {
          _id,
          name,
          email
        }
      });
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.json({
    message: 'Signout success!'
  });
};

exports.requireSignin = expressJwt({
  //if the token is valid, express  jwt appends the verified  users id
  // in an auth key to the req obj
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});
