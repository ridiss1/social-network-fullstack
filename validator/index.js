const { check } = require('express-validator');

exports.createPostValidator = [
  check('title', 'Write a title')
    .not()
    .isEmpty(),
  check('title', 'Title must be between 4 to 150 characters').isLength({
    min: 4,
    max: 150
  }),
  check('body', 'Write a body')
    .not()
    .isEmpty(),
  check('body', 'Body must be between 4 to 2000 characters').isLength({
    min: 4,
    max: 2000
  })
];

exports.signUpValidator = [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Email is not valid')
    .matches(
      /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
    )
    .isLength({
      min: 4,
      max: 320
    }),
  check('password', 'Password is required')
    .not()
    .isEmpty(),
  check('password')
    .isLength({
      min: 6
    })
    .withMessage('Password must contain at least 6 characters')
];
