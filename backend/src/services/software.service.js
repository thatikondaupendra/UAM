// src/services/software.service.js

const { AppDataSource } = require('../config/database');
const { Software } = require('../entities/Software');
const AppError = require('../utils/AppError');

class SoftwareService {
    constructor() {
        this.softwareRepository = AppDataSource.getRepository(Software);
    }

    async createSoftware(name, description, accessLevels) {
        console.log("css");
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
    try {
        try{
        const softwares = await this.softwareRepository.find();
        }
        catch(err){
            console.log("again");
        }
        const softwares= await this.softwareRepository.find();
        
        // Check if `softwares` is empty before mapping
        if (softwares.length === 0) {
            console.log("No software records found.");
            return []; // Return an empty array if no software is found
        }

        const processedSoftwares = softwares.map(s => {
            let parsedAccessLevels = [];
            // Robust parsing of accessLevels
            if (s.accessLevels && typeof s.accessLevels === 'string') {
                try {
                    parsedAccessLevels = JSON.parse(s.accessLevels);
                } catch (parseError) {
                    // Log the parsing error specifically, but don't stop the whole process
                    console.error(`Error parsing accessLevels for software ID ${s.id || 'unknown'}:`, s.accessLevels, parseError);
                    // Decide how to handle this: return an empty array, or the raw string, or null
                    parsedAccessLevels = []; // Default to empty array on parse error
                }
            } else if (s.accessLevels) {
                // If it's not a string but exists, assume ORM already parsed it or it's directly an array/object
                parsedAccessLevels = s.accessLevels;
            }

            return {
                ...s,
                accessLevels: parsedAccessLevels
            };
        });
        console.log(processedSoftwares.length)

        return processedSoftwares;
    }
    catch (err) {
        // !!! IMPORTANT: Log the actual error and then re-throw it !!!
        console.error("Error in getAllSoftware service:", err);
        throw err; // Re-throw to allow the controller to handle it appropriately (e.g., send 500)
    }
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