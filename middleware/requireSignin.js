const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = middleware = (req, res, next) => {
  //Get the token from header, whrn we send a request to a protected route, we need to send the token with a header
  const token = req.header('x-auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: `No token, authorization denied.` });
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWt_SECRET); //Decoding the token

    req.user = decoded.user; //req.user will now have all the info. of the user
    next();
  } catch (err) {
    res.status(401).json({ msg: `Token is not valid` });
  }
};
