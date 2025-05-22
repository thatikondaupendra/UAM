const { AppDataSource } = require('../config/database');
const { Software } = require('../entities/Software');

const softwareRepository = AppDataSource.getRepository(Software);

class SoftwareService {
    /**
     * Creates a new software entry.
     * @param {object} createSoftwareDto - Data Transfer Object for creating software.
     * @returns {Promise<object>} The newly created software object.
     * @throws {Error} If software name already exists.
     */
    async createSoftware(createSoftwareDto) {
        const { name, description, accessLevels } = createSoftwareDto;

        const existingSoftware = await softwareRepository.findOneBy({ name });
        if (existingSoftware) {
            throw new Error('Software with this name already exists.');
        }

        const newSoftware = softwareRepository.create({ name, description, accessLevels });
        await softwareRepository.save(newSoftware);
        return newSoftware;
    }

    /**
     * Retrieves all software entries.
     * @returns {Promise<Array<object>>} An array of software objects.
     */
    async getAllSoftware() {
        return softwareRepository.find();
    }

    /**
     * Retrieves a single software entry by ID.
     * @param {number} id - The ID of the software.
     * @returns {Promise<object|null>} The software object or null if not found.
     */
    async getSoftwareById(id) {
        return softwareRepository.findOneBy({ id });
    }
}

module.exports = { SoftwareService };