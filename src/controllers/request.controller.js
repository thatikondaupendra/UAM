// src/controllers/request.controller.js

const requestService = require('../services/request.service');
const { CreateRequestDto, UpdateRequestStatusDto } = require('../dtos/request.dto');
const { validate } = require('../middleware/validation.middleware');
const AppError = require('../utils/AppError');

const createRequest = async (req, res, next) => {
    try {
        const userId = req.user.id; // From auth.middleware
        const { softwareId, accessType, reason } = req.validatedBody;
        const request = await requestService.createRequest(userId, softwareId, accessType, reason);
        res.status(201).json({
            status: 'success',
            message: 'Request created successfully!',
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

const getAllRequests = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        const requests = await requestService.getAllRequests(userRole, userId);
        res.status(200).json({
            status: 'success',
            results: requests.length,
            data: requests,
        });
    } catch (error) {
        next(error);
    }
};

const getRequestById = async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id, 10);
        if (isNaN(requestId)) {
            return next(new AppError('Invalid Request ID.', 400));
        }
        const userRole = req.user.role;
        const userId = req.user.id;
        const request = await requestService.getRequestById(requestId, userRole, userId);
        res.status(200).json({
            status: 'success',
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

const updateRequestStatus = async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id, 10);
        if (isNaN(requestId)) {
            return next(new AppError('Invalid Request ID.', 400));
        }
        const { status } = req.validatedBody;
        const updatedRequest = await requestService.updateRequestStatus(requestId, status);
        res.status(200).json({
            status: 'success',
            message: 'Request status updated successfully!',
            data: updatedRequest,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRequest: [validate(CreateRequestDto), createRequest],
    getAllRequests,
    getRequestById,
    updateRequestStatus: [validate(UpdateRequestStatusDto), updateRequestStatus],
};