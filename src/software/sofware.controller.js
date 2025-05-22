const { Router } = require('express');
const { SoftwareService } = require('./software.service');
const { authenticateToken, authorizeRoles } = require('../auth/auth.middleware');
const { validate } = require('class-validator');
const { plainToInstance } = require('class-transformer');
const { CreateSoftwareDto } = require('../dtos/software.dto');

const router = Router();
const softwareService = new SoftwareService();

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

// Create new software (Admin only)
router.post(
    '/',
    authenticateToken,
    authorizeRoles(['Admin']),
    validateDto(CreateSoftwareDto),
    async (req, res, next) => {
        try {
            const software = await softwareService.createSoftware(req.body);
            res.status(201).json(software);
        } catch (error) {
            if (error.message === 'Software with this name already exists.') {
                return res.status(409).json({ message: error.message });
            }
            next(error);
        }
    }
);

// Get all software (Accessible by all authenticated roles)
router.get(
    '/',
    authenticateToken,
    authorizeRoles(['Employee', 'Manager', 'Admin']),
    async (req, res, next) => {
        try {
            const software = await softwareService.getAllSoftware();
            res.status(200).json(software);
        } catch (error) {
            next(error);
        }
    }
);

// Get software by ID (Accessible by all authenticated roles)
router.get(
    '/:id',
    authenticateToken,
    authorizeRoles(['Employee', 'Manager', 'Admin']),
    async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid software ID.' });
            }
            const software = await softwareService.getSoftwareById(id);
            if (!software) {
                return res.status(404).json({ message: 'Software not found.' });
            }
            res.status(200).json(software);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;