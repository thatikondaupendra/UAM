// src/services/auth.service.js

const { AppDataSource } = require('../config/database');
const { User } = require('../entities/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

class AuthService {
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(username, password) {
        const existingUser = await this.userRepository.findOneBy({ username });
        if (existingUser) {
            throw new AppError('Username already exists.', 409); // 409 Conflict
        }

        const hashedPassword = await hashPassword(password);
        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            role: 'user', // Default role
        });
        await this.userRepository.save(newUser);

        const token = generateToken({ id: newUser.id,username: newUser.username, role: newUser.role });
        return { user: newUser, token };
    }

    async login(username, password) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            throw new AppError('Invalid credentials (username or password incorrect).', 401);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials (username or password incorrect).', 401);
        }

        const token = generateToken({ id: user.id, role: user.role });
        return { user, token };
    }
}

module.exports = new AuthService();