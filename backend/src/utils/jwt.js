// src/utils/jwt.js

const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new AppError('Invalid or expired token.', 401);
    }
};

module.exports = { generateToken, verifyToken };