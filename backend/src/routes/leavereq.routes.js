// routes/leavereq.routes.js
const express = require('express');
const router = express.Router();
const leavereqController = require('../controllers/leavereq.controller');

// POST a new leave request
// Endpoint: POST /api/leave-request
router.post('/leave-request', leavereqController.create);
router.put('/leave-request/:id/status', leavereqController.updateStatus);
router.get('/leave-request', leavereqController.getAll);
router.get('/leave-request/:id', leavereqController.getById);
router.delete('/leave-request/:id', leavereqController.delete);

module.exports = router;
