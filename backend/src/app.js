const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/index');
const softwareRoutes = require('./software/sofware.controller');
const requestRoutes = require('./requests/request.controller');

const validateDto=require('./auth/auth.controller');
const RegisterUserDto=require('./dtos/auth.dto');
const { AuthService } = require('./auth/auth.service');

const authService = new AuthService();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend's actual URL
  credentials: true, // Allow cookies to be sent (if you're using sessions/cookies for auth)
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Enable CORS for all origins (for development)
// Middleware
app.use(express.json()); // Enable JSON body parsing

const authRoute = require('./routes/index'); // Assuming you export your router from auth.routes.js

app.use('/api/auth',authRoute);


require('dotenv').config();
// API Routes
//if(app.use('/auth/signup', authRoutes)){
//    console.log("used api,auth,singup")
//}

// Register a new user
//app.post('http://localhost:3000/api/auth/signup', validateDto(RegisterUserDto), async (req, res, next) => {
//    try {
//        const user = await authService.register(req.body);
//        res.status(201).json({ message: 'User registered successfully.', user });
//    } catch (error) {
//        if (error.message === 'Username already exists.') {
//            return res.status(409).json({ message: error.message });
//        }
//        next(error); // Pass other errors to global error handler
//    }
//});
//
if(app.use('/auth/login', authRoutes)){
    console.log("used api,auth,login")
}
app.use('/employee', authRoutes);
app.use('/admin',authRoutes);
app.use('/requests', requestRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.status(200).send('UAM Backend API is running!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred.',
        errors: err.errors || undefined
    });
});

module.exports = { app };
