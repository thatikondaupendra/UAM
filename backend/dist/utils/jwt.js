"use strict";

// src/utils/jwt.js

var jwt = require('jsonwebtoken');
var AppError = require('./AppError');
var generateToken = function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expires in 1 hour
  });
};
var verifyToken = function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired token.', 401);
  }
};
module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken
};