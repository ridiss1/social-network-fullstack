const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(403).json({ error: 'Email is taken!' });

    user = new User(req.body);
    await user.save();
    res.json({ message: 'SignUp success! Please LogIn' });
  } catch (error) {
    console.error(error.message);
    res.send(500).send(`Server Error...`);
  }
};
