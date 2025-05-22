const { AppDataSource } = require('../config/database');
const { User } = require('../entities/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development

class AuthService {
    /**
     * Registers a new user with the provided username and password.
     * Hashes the password before saving.
     * @param {object} registerDto - Data Transfer Object containing username and password.
     * @returns {Promise<object>} The newly created user object (without password).
     * @throws {Error} If username already exists.
     */
    async register(registerDto) {
        const { username, password } = registerDto;

        const existingUser = await userRepository.findOneBy({ username });
        if (existingUser) {
            throw new Error('Username already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            role: 'Employee' // Default role for new registrations
        });
        await userRepository.save(newUser);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    /**
     * Authenticates a user with the provided credentials.
     * @param {object} loginDto - Data Transfer Object containing username and password.
     * @returns {Promise<{token: string, role: string}>} A JWT token and user role upon successful authentication.
     * @throws {Error} If credentials are invalid.
     */
    async login(loginDto) {
        const { username, password } = loginDto;

        const user = await userRepository.findOneBy({ username });
        if (!user) {
            throw new Error('Invalid credentials.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials.');
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return { token, role: user.role };
    }
}

module.exports = { AuthService };