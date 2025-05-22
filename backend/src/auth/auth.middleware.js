const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const { User } = require('../entities/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development
const userRepository = AppDataSource.getRepository(User);

/**
 * Middleware to authenticate requests using JWT.
 * Attaches user information to `req.user` if authentication is successful.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ message: 'Invalid or expired token.' });
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
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // This should ideally be caught by authenticateToken first
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient role.' });
        }

        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };