"use strict";

var express = require('express');
var cors = require('cors');
var authRoutes = require('./auth/auth.controller');
var softwareRoutes = require('./software/sofware.controller');
var requestRoutes = require('./requests/request.controller');
var validateDto = require('./auth/auth.controller');
var RegisterUserDto = require('./dtos/auth.dto');
var _require = require('./auth/auth.service'),
  AuthService = _require.AuthService;
var authService = new AuthService();
var app = express();
var authRoute = require('./routes/index'); // Assuming you export your router from auth.routes.js

app.use('/api/auth', authRoute);
// Middleware
app.use(express.json()); // Enable JSON body parsing
app.use(cors()); // Enable CORS for all origins (for development)

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
if (app.use('/auth/login', authRoutes)) {
  console.log("used api,auth,login");
}
app.use('/api/software', softwareRoutes);
app.use('/api/requests', requestRoutes);

// Basic root route
app.get('/', function (req, res) {
  res.status(200).send('UAM Backend API is running!');
});

// Global error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred.',
    errors: err.errors || undefined
  });
});
module.exports = {
  app: app
};