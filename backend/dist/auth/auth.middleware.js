"use strict";

var jwt = require('jsonwebtoken');
var _require = require('../config/database'),
  AppDataSource = _require.AppDataSource;
var _require2 = require('../entities/User'),
  User = _require2.User;
var JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development
var userRepository = AppDataSource.getRepository(User);

/**
 * Middleware to authenticate requests using JWT.
 * Attaches user information to `req.user` if authentication is successful.
 */
var authenticateToken = function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token required.'
    });
  }
  jwt.verify(token, JWT_SECRET, function (err, user) {
    if (err) {
      // Token is invalid or expired
      return res.status(403).json({
        message: 'Invalid or expired token.'
      });
    }
    // Attach user payload to request object
    req.user = user; // No type assertion needed in JS
    next();
  });
};

/**
 * Middleware to authorize requests based on user roles.
 * @param {Array<string>} allowedRoles - An array of roles that are allowed to access the route.
 */
var authorizeRoles = function authorizeRoles(allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      // This should ideally be caught by authenticateToken first
      return res.status(401).json({
        message: 'User not authenticated.'
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Insufficient role.'
      });
    }
    next();
  };
};
module.exports = {
  authenticateToken: authenticateToken,
  authorizeRoles: authorizeRoles
};