// src/middleware/validation.middleware.js

const AppError = require('../utils/AppError');

const validate = (DtoClass) => async (req, res, next) => {
    const dtoInstance = new DtoClass(req.body);
    const errors = dtoInstance.validate();

    if (errors.length > 0) {
        // Concatenate all error messages for a single response
        const errorMessage = errors.join('; ');
        return next(new AppError(errorMessage, 400)); // 400 Bad Request
    }
    // Optionally, if you want to ensure the DTO instance is used later
    req.validatedBody = dtoInstance;
    next();
};

module.exports = { validate };