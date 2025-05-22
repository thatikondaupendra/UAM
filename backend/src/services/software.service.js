// src/services/software.service.js

const { AppDataSource } = require('../config/database');
const { Software } = require('../entities/Software');
const AppError = require('../utils/AppError');

class SoftwareService {
    constructor() {
        this.softwareRepository = AppDataSource.getRepository(Software);
    }

    async createSoftware(name, description, accessLevels) {
        const existingSoftware = await this.softwareRepository.findOneBy({ name });
        if (existingSoftware) {
            throw new AppError('Software with this name already exists.', 409);
        }

        const newSoftware = this.softwareRepository.create({
            name,
            description,
            accessLevels: JSON.stringify(accessLevels), // Store array as JSON string
        });
        return this.softwareRepository.save(newSoftware);
    }

    async getAllSoftware() {
        const softwares = await this.softwareRepository.find();
        // Parse accessLevels back to array when fetching
        return softwares.map(s => ({
            ...s,
            accessLevels: JSON.parse(s.accessLevels)
        }));
    }

    async getSoftwareById(id) {
        const software = await this.softwareRepository.findOneBy({ id });
        if (!software) {
            throw new AppError('Software not found.', 404);
        }
        return {
            ...software,
            accessLevels: JSON.parse(software.accessLevels)
        };
    }

    async updateSoftware(id, updates) {
        const software = await this.softwareRepository.findOneBy({ id });
        if (!software) {
            throw new AppError('Software not found.', 404);
        }

        // Handle accessLevels update specifically
        if (updates.accessLevels) {
            updates.accessLevels = JSON.stringify(updates.accessLevels);
        }

        Object.assign(software, updates);
        return this.softwareRepository.save(software);
    }

    async deleteSoftware(id) {
        const result = await this.softwareRepository.delete(id);
        if (result.affected === 0) {
            throw new AppError('Software not found.', 404);
        }
        return { message: 'Software deleted successfully.' };
    }
}

module.exports = new SoftwareService();