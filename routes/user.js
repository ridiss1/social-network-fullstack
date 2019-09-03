const express = require('express');
const {
  userByID,
  allUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/user');
const requireSignin = require('../middleware/requireSignin');

const router = express.Router();

router.get('/users', allUsers);
router.get('/user/:userID', getUser);
router.put('/user/:userID', updateUser);
router.delete('/user/:userID', deleteUser);

//any route containing :userID, our app will first execute userByID()
router.param('userID', userByID);

module.exports = router;
