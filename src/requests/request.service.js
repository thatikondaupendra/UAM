const { AppDataSource } = require('../config/database');
const { Request } = require('../entities/Request');
const { User } = require('../entities/User');
const { Software } = require('../entities/Software');

const requestRepository = AppDataSource.getRepository(Request);
const userRepository = AppDataSource.getRepository(User);
const softwareRepository = AppDataSource.getRepository(Software);

class RequestService {
    /**
     * Creates a new access request for a software.
     * @param {object} createRequestDto - Data Transfer Object for creating a request.
     * @param {number} userId - The ID of the user making the request.
     * @returns {Promise<object>} The newly created request object.
     * @throws {Error} If software or user not found, or if access type is invalid for software.
     */
    async createRequest(createRequestDto, userId) {
        const { softwareId, accessType, reason } = createRequestDto;

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found.');
        }

        const software = await softwareRepository.findOneBy({ id: softwareId });
        if (!software) {
            throw new Error('Software not found.');
        }

        // Check if the requested access type is valid for the software
        if (!software.accessLevels.includes(accessType)) {
            throw new Error(`Access type "${accessType}" is not valid for software "${software.name}".`);
        }

        const newRequest = requestRepository.create({
            user,
            software,
            accessType,
            reason,
            status: 'Pending', // Default status
        });
        await requestRepository.save(newRequest);
        return newRequest;
    }

    /**
     * Retrieves all requests for a specific user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array<object>>} An array of request objects.
     */
    async getRequestsByUserId(userId) {
        return requestRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'software'], // Load related user and software data
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Retrieves all pending requests (for managers).
     * @returns {Promise<Array<object>>} An array of pending request objects.
     */
    async getPendingRequests() {
        return requestRepository.find({
            where: { status: 'Pending' },
            relations: ['user', 'software'],
            order: { createdAt: 'ASC' }
        });
    }

    /**
     * Updates the status of an access request.
     * @param {number} requestId - The ID of the request to update.
     * @param {object} updateStatusDto - Data Transfer Object containing the new status.
     * @returns {Promise<object>} The updated request object.
     * @throws {Error} If request not found or if status transition is invalid.
     */
    async updateRequestStatus(requestId, updateStatusDto) {
        const { status } = updateStatusDto;

        const request = await requestRepository.findOne({
            where: { id: requestId },
            relations: ['user', 'software'] // Load relations if needed for logic/response
        });

        if (!request) {
            throw new Error('Request not found.');
        }

        // Prevent updating if already approved/rejected (optional logic)
        if (request.status !== 'Pending') {
            throw new Error(`Request is already ${request.status}. Cannot change status.`);
        }

        request.status = status;
        await requestRepository.save(request);
        return request;
    }
}

module.exports = { RequestService };