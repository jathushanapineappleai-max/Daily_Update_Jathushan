const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const financeController = require('../controllers/financeController');

// Financial statistics (must be before parameterized routes)
router.get('/stats', auth, financeController.getFinancialStats);

// Bulk approval routes (must be before parameterized routes)
router.post('/bulk-approve', auth, authorizeHierarchy('treasurer'), financeController.bulkApproveTransactions);
router.get('/pending', auth, authorizeHierarchy('treasurer'), financeController.getPendingTransactions);

// Recurring transaction management
router.post('/recurring', auth, authorizeHierarchy('treasurer'), financeController.createRecurringTransaction);
router.get('/recurring', auth, authorizeHierarchy('treasurer'), financeController.getRecurringTransactions);
router.put('/recurring/:id/stop', auth, authorizeHierarchy('treasurer'), financeController.stopRecurringTransaction);

// Classification routes
router.get('/classification/:classificationType', auth, authorizeHierarchy('treasurer'), financeController.getTransactionsByType);

// Transaction CRUD routes
router.get('/', auth, financeController.getFinances);
router.post('/', auth, authorizeHierarchy('treasurer'), financeController.createTransaction);
router.put('/:id', auth, authorizeHierarchy('treasurer'), financeController.updateTransaction);
router.delete('/:id', auth, authorizeHierarchy('treasurer'), financeController.deleteTransaction);

// Resident transaction request routes
router.post('/request', auth, financeController.createTransactionRequest);
router.get('/my-requests', auth, financeController.getMyTransactionRequests);

// Transaction approval routes
router.put('/:id/approve', auth, authorizeHierarchy('treasurer'), financeController.approveTransaction);
router.put('/:id/reject', auth, authorizeHierarchy('treasurer'), financeController.rejectTransaction);
router.put('/:id/mark-paid', auth, authorizeHierarchy('treasurer'), financeController.markTransactionPaid);

module.exports = router;
