const authService = require('../services/auth.serive');

async function registerUser(req, res, next) {
    try {
        console.log('registerUser controller function entered.'); // Debugging line
        const { username, password } = req.body;
        const user = await authService.register(username,password);
        console.log("user",user);
        console.log(res);
        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        if (error.message === 'Username already exists.') {
            return res.status(409).json({ message: error.message });
        }
        next(error.message);
        console.log("error from c");
    }
}

/**
 * Handles user login.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
async function loginUser(req, res, next) {
    try {
        console.log('loginUser controller function entered.'); // Debugging line
        const {username,password}=req.body;
        const { token, role } = await authService.login(username,password);
        res.status(200).json({ message: 'Login successful.', token, role });
    } catch (error) {
        if (error.message === 'Invalid credentials.') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
}

module.exports = {
    registerUser, // Export the function directly
    loginUser,    // Export the function directly
};