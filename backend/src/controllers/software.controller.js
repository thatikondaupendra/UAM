// src/controllers/software.controller.js

const softwareService = require('../services/software.service');
const { CreateSoftwareDto } = require('../dtos/software.dto');
const { validate } = require('../middleware/validation.middleware');
const AppError = require('../utils/AppError');

const createSoftware = async (req, res, next) => {
    try {
        const { name, description, accessLevels } = req.validatedBody;
        const software = await softwareService.createSoftware(name, description, accessLevels);
        res.status(201).json({
            status: 'success',
            message: 'Software created successfully!',
            data: software,
        });
    } catch (error) {
        next(error);
    }
};

const getAllSoftware = async (req, res, next) => {
    try {
        const softwares = await softwareService.getAllSoftware();
        res.status(200).json({
            status: 'success',
            results: softwares.length,
            data: softwares,
        });
    } catch (error) {
        next(error);
    }
};

const getSoftwareById = async (req, res, next) => {
    try {
        const softwareId = parseInt(req.params.id, 10);
        if (isNaN(softwareId)) {
            return next(new AppError('Invalid Software ID.', 400));
        }
        const software = await softwareService.getSoftwareById(softwareId);
        res.status(200).json({
            status: 'success',
            data: software,
        });
    } catch (error) {
        next(error);
    }
};

const updateSoftware = async (req, res, next) => {
    try {
        const softwareId = parseInt(req.params.id, 10);
        if (isNaN(softwareId)) {
            return next(new AppError('Invalid Software ID.', 400));
        }
        // Basic validation for updates (can be expanded with a dedicated UpdateSoftwareDto)
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.accessLevels) {
            if (!Array.isArray(req.body.accessLevels) || req.body.accessLevels.length === 0) {
                return next(new AppError('Access levels must be a non-empty array.', 400));
            }
            const allowedAccessLevels = ['Read', 'Write', 'Admin'];
            const invalidLevels = req.body.accessLevels.filter(level => !allowedAccessLevels.includes(level));
            if (invalidLevels.length > 0) {
                return next(new AppError(`Invalid access level(s): ${invalidLevels.join(', ')}.`, 400));
            }
            updates.accessLevels = req.body.accessLevels;
        }

        if (Object.keys(updates).length === 0) {
            return next(new AppError('No valid fields provided for update.', 400));
        }

        const updatedSoftware = await softwareService.updateSoftware(softwareId, updates);
        res.status(200).json({
            status: 'success',
            message: 'Software updated successfully!',
            data: updatedSoftware,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSoftware = async (req, res, next) => {
    try {
        const softwareId = parseInt(req.params.id, 10);
        if (isNaN(softwareId)) {
            return next(new AppError('Invalid Software ID.', 400));
        }
        await softwareService.deleteSoftware(softwareId);
        res.status(204).json({ // 204 No Content for successful deletion
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSoftware: [validate(CreateSoftwareDto), createSoftware],
    getAllSoftware,
    getSoftwareById,
    updateSoftware,
    deleteSoftware,
};