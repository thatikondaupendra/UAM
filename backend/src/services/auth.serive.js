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
        try{console.log("servicejs")
        if (username && password){
            console.log(username,password);
        }
        const existingUser = await this.userRepository.findOneBy({ username });
        console.log("eu",existingUser);
        if (existingUser) {
            throw new AppError('Username already exists.', 409); // 409 Conflict
        }

        console.log("neu");
        const hashedPassword = await hashPassword(password);

        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            role: 'Admin', // Default role
        });
        if(await this.userRepository.save(newUser)){
            console.log("saved");
        }

        const token = generateToken({ id: newUser.id, role: newUser.role });
        console.log(token);
        return { user: newUser, token };
    }
    catch(err){
        console.log(err.message);
    }
    }

async login(username, password) {
    try {
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
    catch (err) {
        console.error("Login service error:", err); // Use console.error for errors
        // Re-throw the error so the calling controller can catch and handle it
        throw err;
    }
}

}

module.exports = new AuthService();