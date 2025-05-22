// src/routes/index.js

const express = require('express');
const router = express.Router();


const { registerUser, loginUser } = require('../controllers/a.c');
const authController = require('../controllers/a.c').default;
const softwareController = require('../controllers/software.controller');
const requestController = require('../controllers/request.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// --- Auth Routes ---
router.post('/signup', registerUser);
router.post('/login', loginUser);

// --- Software Routes (Protected) ---
router.route('/software')
    .post(protect, restrictTo('admin'), softwareController.createSoftware) // Only admins can create
    .get(protect, softwareController.getAllSoftware); // All logged-in users can view

router.route('/software/:id')
    .get(protect, softwareController.getSoftwareById)
    .patch(protect, restrictTo('admin'), softwareController.updateSoftware) // Only admins can update
    .delete(protect, restrictTo('admin'), softwareController.deleteSoftware); // Only admins can delete

// --- Request Routes (Protected) ---
router.route('/requests')
    .post(protect, requestController.createRequest) // Any logged-in user can create a request
    .get(protect, requestController.getAllRequests); // Users see their own, admins see all

router.route('/requests/:id')
    .get(protect, requestController.getRequestById);

// Admin-specific request routes
router.patch('/requests/:id/status', protect, restrictTo('admin'), requestController.updateRequestStatus); // Only admins can update status

module.exports = router;