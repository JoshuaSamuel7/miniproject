const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed!' });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = { userId: decodedToken.userId };
    console.log("I am Middleware Authentication");
    next();
  } catch (err) {
    console.log("Authentication Failed");
    return res.status(403).json({ message: 'Authentication failed!' });
  }
};
