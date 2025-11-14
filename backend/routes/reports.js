const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Report generation routes
router.get('/financial/:reportType', auth, authorizeHierarchy('treasurer'), reportController.generateFinancialReport);
router.get('/pdf/:reportType', auth, authorizeHierarchy('treasurer'), reportController.generatePDFReport);
router.get('/export/:format/:reportType', auth, authorizeHierarchy('treasurer'), reportController.exportReport);

// Custom report generation
router.post('/custom', auth, authorizeHierarchy('treasurer'), reportController.generateCustomReport);

// Utility routes
router.get('/date-ranges', auth, reportController.getDateRanges);
router.get('/metadata', auth, reportController.getReportMetadata);
router.get('/statistics', auth, authorizeHierarchy('treasurer'), reportController.getReportStatistics);

module.exports = router;
