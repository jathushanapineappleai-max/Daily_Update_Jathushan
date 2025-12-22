// routes/leavereq.routes.js
const express = require('express');
const router = express.Router();
const leavereqController = require('../controllers/leavereq.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// POST a new leave request
// Endpoint: POST /api/leave-request
// Employees can create their own leave requests
router.post('/leave-request', protect, authorize('admin', 'employee'), leavereqController.create);

// Admin can update leave request status
router.put('/leave-request/:id/status', protect, authorize('admin'), leavereqController.updateStatus);

// Admin can get all leave requests
router.get('/leave-request', protect, authorize('admin'), leavereqController.getAll);

// Employees can get their own leave request, admin can get any
router.get('/leave-request/:id', protect, authorize('admin', 'employee'), leavereqController.getById);

// Only admin can delete leave requests
router.delete('/leave-request/:id', protect, authorize('admin'), leavereqController.delete);

module.exports = router;
