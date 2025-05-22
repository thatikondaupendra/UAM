const { Router } = require('express');
const { RequestService } = require('./request.service');
const { authenticateToken, authorizeRoles } = require('../auth/auth.middleware');
const { validate } = require('class-validator');
const { plainToInstance } = require('class-transformer');
const { CreateRequestDto, UpdateRequestStatusDto } = require('../dtos/request.dto');

const router = Router();
const requestService = new RequestService();

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

// Create a new access request (Employee only)
router.post(
    '/',
    authenticateToken,
    authorizeRoles(['Employee']),
    validateDto(CreateRequestDto),
    async (req, res, next) => {
        try {
            // req.user is populated by authenticateToken middleware
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token.' });
            }
            const request = await requestService.createRequest(req.body, userId);
            res.status(201).json(request);
        } catch (error) {
            if (error.message === 'Software not found.' || error.message === 'User not found.' || error.message.includes('Access type')) {
                return res.status(404).json({ message: error.message });
            }
            next(error);
        }
    }
);

// Get all requests for the authenticated user (Employee only)
router.get(
    '/my-requests',
    authenticateToken,
    authorizeRoles(['Employee']),
    async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token.' });
            }
            const requests = await requestService.getRequestsByUserId(userId);
            res.status(200).json(requests);
        }
        catch (error) {
            next(error);
        }
    }
);

// Get all pending requests (Manager only)
router.get(
    '/pending',
    authenticateToken,
    authorizeRoles(['Manager']),
    async (req, res, next) => {
        try {
            const requests = await requestService.getPendingRequests();
            res.status(200).json(requests);
        } catch (error) {
            next(error);
        }
    }
);

// Update request status (Manager only)
router.patch(
    '/:id',
    authenticateToken,
    authorizeRoles(['Manager']),
    validateDto(UpdateRequestStatusDto),
    async (req, res, next) => {
        try {
            const requestId = parseInt(req.params.id, 10);
            if (isNaN(requestId)) {
                return res.status(400).json({ message: 'Invalid request ID.' });
            }
            const updatedRequest = await requestService.updateRequestStatus(requestId, req.body);
            res.status(200).json(updatedRequest);
        } catch (error) {
            if (error.message === 'Request not found.' || error.message.includes('Cannot change status')) {
                return res.status(404).json({ message: error.message });
            }
            next(error);
        }
    }
);

module.exports = router;