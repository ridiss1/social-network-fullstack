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
