const jwt = require('jsonwebtoken');
const statusHelper = require('../utils/status.helper');
const ERRORHelper = require('../utils/error.helper');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        const error = ERRORHelper.create('Authentication required', 401,statusHelper.ERROR);
        return next(error);
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.email = decoded.email;
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      let message = 'Invalid token';
      if (error.name === 'TokenExpiredError') {
        message = 'Token expired';
      }
      var err = ERRORHelper.create(message, 401,statusHelper.ERROR);
        return next(err);
    }
  };
  
  module.exports = authMiddleware;