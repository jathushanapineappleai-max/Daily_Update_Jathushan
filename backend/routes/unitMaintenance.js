const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const unitMaintenanceController = require('../controllers/unitMaintenanceController');

// Validation middleware for payment data
const validatePaymentData = (req, res, next) => {
  const { amount, paymentMethod } = req.body;
  
  if (!amount || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: amount, paymentMethod'
    });
  }
  
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number'
    });
  }
  
  const validPaymentMethods = ['cash', 'bank_transfer', 'check', 'card', 'online', 'other'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method. Must be one of: ' + validPaymentMethods.join(', ')
    });
  }
  
  next();
};

// Validation middleware for adjustment data
const validateAdjustmentData = (req, res, next) => {
  const { type, description, amount } = req.body;
  
  if (!type || !description || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: type, description, amount'
    });
  }
  
  const validAdjustmentTypes = ['discount', 'penalty', 'credit', 'additional_charge', 'late_fee', 'waiver'];
  if (!validAdjustmentTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid adjustment type. Must be one of: ' + validAdjustmentTypes.join(', ')
    });
  }
  
  if (typeof amount !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a number'
    });
  }
  
  next();
};

// Validation middleware for month/year parameters
const validatePeriodParams = (req, res, next) => {
  const { month, year } = req.params;
  
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      message: 'Invalid month. Must be between 1 and 12.'
    });
  }
  
  if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2050) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year. Must be between 2020 and 2050.'
    });
  }
  
  next();
};

// GET /api/unit-maintenance/fees - Get all maintenance fees with pagination and filtering
router.get('/fees', auth, unitMaintenanceController.getMaintenanceFees);

// GET /api/unit-maintenance/dashboard-stats - Get dashboard statistics
router.get('/dashboard-stats', 
  auth, 
  authorizeHierarchy('treasurer'), 
  unitMaintenanceController.getDashboardStats
);

// GET /api/unit-maintenance/overdue - Get overdue maintenance fees
router.get('/overdue', 
  auth, 
  authorizeHierarchy('treasurer'), 
  unitMaintenanceController.getOverdueFees
);

// POST /api/unit-maintenance/generate/:month/:year - Generate monthly fees for all units
router.post('/generate/:month/:year', 
  auth, 
  authorizeHierarchy('treasurer'), 
  validatePeriodParams,
  unitMaintenanceController.generateMonthlyFees
);

// GET /api/unit-maintenance/period/:month/:year - Get fees for specific period
router.get('/period/:month/:year', 
  auth, 
  validatePeriodParams,
  unitMaintenanceController.getFeesForPeriod
);

// GET /api/unit-maintenance/unit/:unitId - Get unit's maintenance fee history
router.get('/unit/:unitId', 
  auth, 
  unitMaintenanceController.getUnitFeeHistory
);

// GET /api/unit-maintenance/fees/:id - Get maintenance fee by ID
router.get('/fees/:id', 
  auth, 
  unitMaintenanceController.getMaintenanceFeeById
);

// POST /api/unit-maintenance/fees/:id/payment - Record payment for maintenance fee
router.post('/fees/:id/payment', 
  auth, 
  authorizeHierarchy('treasurer'), 
  validatePaymentData,
  unitMaintenanceController.recordPayment
);

// POST /api/unit-maintenance/fees/:id/adjustment - Add adjustment to maintenance fee
router.post('/fees/:id/adjustment', 
  auth, 
  authorizeHierarchy('treasurer'), 
  validateAdjustmentData,
  unitMaintenanceController.addAdjustment
);

module.exports = router;
