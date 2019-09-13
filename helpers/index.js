const formidable = require('formidable');

exports.createPostValidator = (req, res, next) => {
  //title
  req.check('title', 'Write a title').notEmpty();
  req.check('title', 'Title must be between 4 to 150 characters').isLength({
    min: 4,
    max: 150
  });

  //content
  req.check('content', 'Write a content').notEmpty();
  req
    .check('content', 'Content must be between 4 to 2000 characters')
    .isLength({
      min: 4,
      max: 2000
    });
  //process to next middleware
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({
      err: firstError
    });
  }
  next();
};

exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty();

  req
    .check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 32
    });

  req.check('password', 'password is required').notEmpty();
  req
    .check('password', 'password must contain at least 6 characters')
    .isLength({
      min: 6
    })
    .matches(/\d/)
    .withMessage('Password must contain a number');

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({
      err: firstError
    });
  }
  next();
};
