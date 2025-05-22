"use strict";

// src/routes/index.js

var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');
var softwareController = require('../controllers/software.controller');
var requestController = require('../controllers/request.controller');
var _require = require('../middleware/auth.middleware'),
  protect = _require.protect,
  restrictTo = _require.restrictTo;

// --- Auth Routes ---
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);

// --- Software Routes (Protected) ---
router.route('/software').post(protect, restrictTo('admin'), softwareController.createSoftware) // Only admins can create
.get(protect, softwareController.getAllSoftware); // All logged-in users can view

router.route('/software/:id').get(protect, softwareController.getSoftwareById).patch(protect, restrictTo('admin'), softwareController.updateSoftware) // Only admins can update
["delete"](protect, restrictTo('admin'), softwareController.deleteSoftware); // Only admins can delete

// --- Request Routes (Protected) ---
router.route('/requests').post(protect, requestController.createRequest) // Any logged-in user can create a request
.get(protect, requestController.getAllRequests); // Users see their own, admins see all

router.route('/requests/:id').get(protect, requestController.getRequestById);

// Admin-specific request routes
router.patch('/requests/:id/status', protect, restrictTo('admin'), requestController.updateRequestStatus); // Only admins can update status

module.exports = router;