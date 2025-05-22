const { Router } = require('express');
const { AuthService } = require('./auth.service');
const { validate } = require('class-validator');
const { plainToInstance } = require('class-transformer');
const { RegisterUserDto, LoginUserDto } = require('../dtos/auth.dto');

const router = Router();
const authService = new AuthService();

// Middleware for DTO validation
const validateDto = (dtoClass) => {
    return async (req, res, next) => {
        const dto = plainToInstance(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed.',
                errors: errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints,
                })),
            });
        }
        req.body = dto; // Replace body with validated DTO instance
        next();
    };
};

// Register a new user
router.post('/signup', validateDto(RegisterUserDto), async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        if (error.message === 'Username already exists.') {
            return res.status(409).json({ message: error.message });
        }
        next(error); // Pass other errors to global error handler
    }
});

// Login user
router.post('http:localhost:3000/api/auth/login', validateDto(LoginUserDto), async (req, res, next) => {
    try {
        const { token, role } = await authService.login(req.body);
        res.status(200).json({ message: 'Login successful.', token, role });
    } catch (error) {
        if (error.message === 'Invalid credentials.') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
});

module.exports = router;