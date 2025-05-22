// src/services/request.service.js

const { AppDataSource } = require('../config/database');
const { Request } = require('../entities/Request');
const { User } = require('../entities/User');
const { Software } = require('../entities/Software');
const AppError = require('../utils/AppError');

class RequestService {
    constructor() {
        this.requestRepository = AppDataSource.getRepository(Request);
        this.userRepository = AppDataSource.getRepository(User);
        this.softwareRepository = AppDataSource.getRepository(Software);
    }

    async createRequest(userId, softwareId, accessType, reason) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new AppError('User not found.', 404);
        }

        const software = await this.softwareRepository.findOneBy({ id: softwareId });
        if (!software) {
            throw new AppError('Software not found.', 404);
        }

        // Basic check if accessType is valid for the software
        const softwareAccessLevels = JSON.parse(software.accessLevels);
        if (!softwareAccessLevels.includes(accessType)) {
            throw new AppError(`Access type "${accessType}" is not supported by this software.`, 400);
        }

        const newRequest = this.requestRepository.create({
            user,
            software,
            accessType,
            reason,
            status: 'Pending', // Default status
        });
        return this.requestRepository.save(newRequest);
    }

    async getAllRequests(userRole, userId) {
        if (userRole === 'admin') {
            return this.requestRepository.find({ relations: ['user', 'software'] });
        } else {
            return this.requestRepository.find({ where: { user: { id: userId } }, relations: ['user', 'software'] });
        }
    }

    async getRequestById(id, userRole, userId) {
        const request = await this.requestRepository.findOne({ where: { id }, relations: ['user', 'software'] });
        if (!request) {
            throw new AppError('Request not found.', 404);
        }
        if (userRole === 'user' && request.user.id !== userId) {
            throw new AppError('You do not have permission to view this request.', 403);
        }
        return request;
    }

    async updateRequestStatus(requestId, status) {
        const request = await this.requestRepository.findOneBy({ id: requestId });
        if (!request) {
            throw new AppError('Request not found.', 404);
        }
        request.status = status;
        return this.requestRepository.save(request);
    }
}

module.exports = new RequestService();