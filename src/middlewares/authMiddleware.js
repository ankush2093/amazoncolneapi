const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); 
require('dotenv').config(); 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password

    if (!req.user) {
      return res.status(401).json({ message: 'Invalid Token: User not found' });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = authMiddleware;
