"use strict";

var express = require('express');
var cors = require('cors');
var authRoutes = require('./auth/auth.controller');
var softwareRoutes = require('./software/software.controller');
var requestRoutes = require('./requests/request.controller');
var app = express();

// Middleware
app.use(express.json()); // Enable JSON body parsing
app.use(cors()); // Enable CORS for all origins (for development)

// API Routes
app.use('/api/auth', authRoutes);
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