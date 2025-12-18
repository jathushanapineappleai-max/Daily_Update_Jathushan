// routes/leavebalance.routes.js
const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leavebalance.controller');

// GET list
router.get('/', leaveBalanceController.getAll);

// GET single
router.get('/:id', leaveBalanceController.getById);

// Manual move from leave request -> leave_balance
router.post('/move-from-request', leaveBalanceController.moveFromRequest);

// Manual revert
router.post('/revert-from-request', leaveBalanceController.revertFromRequest);

module.exports = router;
