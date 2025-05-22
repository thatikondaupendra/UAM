// src/middleware/auth.middleware.js

const { verifyToken } = require('../utils/jwt');
const { AppDataSource } = require('../config/database');
const { User } = require('../entities/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = verifyToken(token); // This will throw if invalid/expired

        const userRepository = AppDataSource.getRepository(User);
        const currentUser = await userRepository.findOneBy({ id: decoded.id });

        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = currentUser; // Attach user to request
        next();
    } catch (err) {
        next(err); // Pass the AppError from verifyToken or any other error
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403)); // 403 Forbidden
        }
        next();
    };
};

module.exports = { protect, restrictTo };