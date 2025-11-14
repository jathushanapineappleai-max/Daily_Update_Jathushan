const Transaction = require('../models/Transaction');
const recurringTransactionService = require('../services/recurringTransactionService');
const notificationService = require('../services/notificationService');

// Get all transactions with filtering
exports.getFinances = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      classification,
      status,
      category,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};

    if (type) query.type = type;
    if (classification) query.transactionClassification = classification;
    if (status) query.status = status;
    if (category) query.category = category;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get transactions
    const transactions = await Transaction.find(query)
      .populate('createdBy', 'firstName lastName role')
      .populate('vendor', 'companyName contactInfo')
      .populate('resident', 'firstName lastName unitNumber')
      .populate('approvalWorkflow.approvals.approver', 'firstName lastName role')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get finances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Get transactions by classification type
exports.getTransactionsByType = async (req, res) => {
  try {
    const { classificationType } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Validate classification type
    const validTypes = ['recurring_income', 'adhoc_income', 'recurring_expense', 'adhoc_expense'];
    if (!validTypes.includes(classificationType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid classification type'
      });
    }

    const options = {};
    if (status) options.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.getByClassification(classificationType, options)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({
      transactionClassification: classificationType,
      ...(status && { status })
    });

    res.json({
      success: true,
      transactions,
      classification: classificationType,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions by type',
      error: error.message
    });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      description,
      amount,
      type,
      transactionClassification,
      category,
      subcategory,
      date,
      dueDate,
      vendor,
      unitNumber,
      resident,
      recurringTransaction,
      budgetAllocation,
      taxInformation,
      notes
    } = req.body;

    // Validate required fields
    if (!description || !amount || !type || !transactionClassification || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate classification matches type
    const isIncomeClassification = transactionClassification.includes('income');
    const isExpenseClassification = transactionClassification.includes('expense');

    if ((type === 'income' && !isIncomeClassification) ||
        (type === 'expense' && !isExpenseClassification)) {
      return res.status(400).json({
        success: false,
        message: 'Transaction classification must match transaction type'
      });
    }

    // Auto-approve transactions for authorized roles
    const autoApproveRoles = ['treasurer', 'president', 'administrator'];
    const shouldAutoApprove = autoApproveRoles.includes(req.user.role);

    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      transactionClassification,
      category,
      subcategory,
      date: date ? new Date(date) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: req.user._id,
      vendor: vendor && vendor.trim() !== '' ? vendor : undefined,
      unitNumber,
      resident,
      budgetAllocation,
      taxInformation,
      notes,
      status: shouldAutoApprove ? 'approved' : 'pending'
    };

    // Handle recurring transactions
    if (recurringTransaction && recurringTransaction.isRecurring) {
      const transaction = await recurringTransactionService.createRecurringTransaction({
        ...transactionData,
        recurringTransaction
      });

      res.status(201).json({
        success: true,
        message: 'Recurring transaction created successfully',
        transaction
      });
    } else {
      // Create regular transaction
      const transaction = new Transaction(transactionData);
      await transaction.save();

      await transaction.populate('createdBy', 'firstName lastName role');

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        transaction
      });
    }

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Create recurring transaction
exports.createRecurringTransaction = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdBy: req.user._id
    };
    const transaction = await recurringTransactionService.createRecurringTransaction(transactionData);

    res.status(201).json({
      success: true,
      message: 'Recurring transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Create recurring transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recurring transaction',
      error: error.message
    });
  }
};

// Get all recurring transactions
exports.getRecurringTransactions = async (req, res) => {
  try {
    const recurringTransactions = await recurringTransactionService.getActiveRecurringTransactions();

    res.json({
      success: true,
      recurringTransactions
    });

  } catch (error) {
    console.error('Get recurring transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recurring transactions',
      error: error.message
    });
  }
};

// Stop recurring transaction
exports.stopRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await recurringTransactionService.stopRecurringTransaction(id);

    res.json({
      success: true,
      message: 'Recurring transaction stopped successfully',
      transaction
    });

  } catch (error) {
    console.error('Stop recurring transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop recurring transaction',
      error: error.message
    });
  }
};

// Get financial statistics
exports.getFinancialStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    console.log(`📊 Calculating stats for ${currentYear}-${currentMonth}`);

    // Get monthly summary from transactions
    const monthlySummary = await Transaction.getMonthlySummary(currentYear, currentMonth);
    console.log('📈 Monthly summary:', JSON.stringify(monthlySummary, null, 2));

    // Calculate totals from transactions
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    monthlySummary.forEach(item => {
      console.log(`💰 Processing item: ${item._id} = ${item.totalAmount}`);
      if (item._id === 'income') {
        monthlyIncome = item.totalAmount;
      } else if (item._id === 'expense') {
        monthlyExpenses = item.totalAmount;
      }
    });

    // Get maintenance fee data for current month
    const UnitMaintenanceFee = require('../models/UnitMaintenanceFee');
    const maintenanceFeeStats = await UnitMaintenanceFee.aggregate([
      {
        $match: {
          'billingPeriod.month': currentMonth,
          'billingPeriod.year': currentYear
        }
      },
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$totalAmount' },
          totalPaid: { $sum: { $ifNull: ['$paymentDetails.paidAmount', 0] } },
          totalOutstanding: { $sum: { $ifNull: ['$paymentDetails.remainingAmount', '$totalAmount'] } }
        }
      }
    ]);

    const maintenanceStats = maintenanceFeeStats.length > 0 ? maintenanceFeeStats[0] : { totalFees: 0, totalPaid: 0, totalOutstanding: 0 };
    console.log('🏠 Maintenance stats:', maintenanceStats);

    // Note: Monthly income from transactions already includes maintenance fee payments
    // so we don't add them again

    // Get outstanding dues (pending income transactions + unpaid maintenance fees)
    const transactionOutstanding = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: 'pending',
          transactionClassification: { $in: ['recurring_income', 'adhoc_income'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const transactionOutstandingAmount = transactionOutstanding.length > 0 ? transactionOutstanding[0].total : 0;
    const totalOutstandingDues = transactionOutstandingAmount + maintenanceStats.totalOutstanding;

    // Get total balance (all transactions income - all transactions expenses + maintenance fees paid)
    const allTransactions = await Transaction.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'paid'] }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalTransactionIncome = 0;
    let totalTransactionExpenses = 0;
    allTransactions.forEach(item => {
      if (item._id === 'income') {
        totalTransactionIncome = item.total;
      } else if (item._id === 'expense') {
        totalTransactionExpenses = item.total;
      }
    });

    // Total balance = all income (transactions + maintenance fees) - all expenses
    const totalBalance = totalTransactionIncome + maintenanceStats.totalPaid - totalTransactionExpenses;

    // Calculate budget utilization (monthly expenses / monthly budget)
    const budgetUtilization = monthlyExpenses > 0 ? Math.min((monthlyExpenses / 500000) * 100, 100) : 0;

    res.json({
      success: true,
      stats: {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        outstandingDues: totalOutstandingDues,
        budgetUtilization: Math.round(budgetUtilization)
      }
    });

  } catch (error) {
    console.error('Get financial stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial statistics',
      error: error.message
    });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check permissions
    const canEdit = transaction.createdBy.toString() === req.user._id.toString() ||
                   ['president', 'administrator'].includes(req.user.role) ||
                   (req.user.role === 'treasurer' && transaction.status === 'pending');

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this transaction'
      });
    }

    // Clean vendor field if it's empty
    if (updateData.vendor === '' || (updateData.vendor && updateData.vendor.trim() === '')) {
      updateData.vendor = undefined;
    }

    // Update transaction
    Object.assign(transaction, updateData);
    await transaction.save();

    await transaction.populate('createdBy', 'firstName lastName role');
    await transaction.populate('vendor', 'companyName');

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check permissions - treasurer, president, and administrator can delete transactions
    // Creator can delete their own transactions regardless of status
    const authorizedRoles = ['treasurer', 'president', 'administrator'];
    const isCreator = transaction.createdBy.toString() === req.user._id.toString();
    const hasAuthorizedRole = authorizedRoles.includes(req.user.role);

    if (!isCreator && !hasAuthorizedRole) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }

    // Additional check: Don't allow deletion of paid transactions unless admin
    if (transaction.status === 'paid' && req.user.role !== 'administrator') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete paid transactions. Contact administrator.'
      });
    }

    await Transaction.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

// Approve transaction
exports.approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.addApproval(req.user._id, 'approved', comments);

    res.json({
      success: true,
      message: 'Transaction approved successfully',
      transaction
    });

  } catch (error) {
    console.error('Approve transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve transaction'
    });
  }
};

// Reject transaction
exports.rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.addApproval(req.user._id, 'rejected', comments);

    res.json({
      success: true,
      message: 'Transaction rejected successfully',
      transaction
    });

  } catch (error) {
    console.error('Reject transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject transaction'
    });
  }
};

// Mark transaction as paid
exports.markTransactionPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, referenceNumber } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Transaction must be approved before marking as paid'
      });
    }

    await transaction.markAsPaid(paymentMethod, referenceNumber);

    res.json({
      success: true,
      message: 'Transaction marked as paid successfully',
      transaction
    });

  } catch (error) {
    console.error('Mark transaction paid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark transaction as paid'
    });
  }
};

// Bulk approve transactions
exports.bulkApproveTransactions = async (req, res) => {
  try {
    const { transactionIds, comments } = req.body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Transaction IDs array is required'
      });
    }

    console.log(`📋 Bulk approving ${transactionIds.length} transactions by ${req.user.firstName} ${req.user.lastName}`);

    const results = {
      approved: [],
      failed: [],
      alreadyProcessed: []
    };

    for (const transactionId of transactionIds) {
      try {
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
          results.failed.push({
            id: transactionId,
            reason: 'Transaction not found'
          });
          continue;
        }

        if (transaction.status !== 'pending') {
          results.alreadyProcessed.push({
            id: transactionId,
            status: transaction.status,
            description: transaction.description
          });
          continue;
        }

        // Update transaction status
        transaction.status = 'approved';

        // Add approval to workflow
        if (!transaction.approvalWorkflow) {
          transaction.approvalWorkflow = {
            requiredApprovals: 1,
            approvals: []
          };
        }

        transaction.approvalWorkflow.approvals.push({
          approver: req.user._id,
          status: 'approved',
          comments: comments || 'Bulk approval',
          approvedAt: new Date()
        });

        await transaction.save();

        results.approved.push({
          id: transactionId,
          description: transaction.description,
          amount: transaction.amount
        });

      } catch (error) {
        console.error(`Error approving transaction ${transactionId}:`, error);
        results.failed.push({
          id: transactionId,
          reason: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk approval completed. ${results.approved.length} approved, ${results.failed.length} failed, ${results.alreadyProcessed.length} already processed.`,
      results
    });

  } catch (error) {
    console.error('Bulk approve transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve transactions',
      error: error.message
    });
  }
};

// Get pending transactions for approval
exports.getPendingTransactions = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const pendingTransactions = await Transaction.find({
      status: 'pending'
    })
    .populate('createdBy', 'firstName lastName role')
    .populate('vendor', 'companyName')
    .populate('resident', 'firstName lastName unitNumber')
    .sort({ date: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

    const totalPending = await Transaction.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      transactions: pendingTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPending / limit),
        totalItems: totalPending,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending transactions',
      error: error.message
    });
  }
};

// Create transaction request (for residents and lower roles)
exports.createTransactionRequest = async (req, res) => {
  try {
    const {
      description,
      amount,
      type,
      category,
      subcategory,
      date,
      unitNumber,
      notes,
      requestReason
    } = req.body;

    // Validate required fields
    if (!description || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: description, amount, type, category'
      });
    }

    // Validate amount
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Determine transaction classification based on type and category
    let transactionClassification;
    if (type === 'income') {
      transactionClassification = ['maintenance_fee', 'parking_fee'].includes(category) ? 'recurring_income' : 'adhoc_income';
    } else {
      transactionClassification = ['utilities', 'security', 'cleaning'].includes(category) ? 'recurring_expense' : 'adhoc_expense';
    }

    console.log(`📝 Creating transaction request by ${req.user.firstName} ${req.user.lastName} (${req.user.role})`);

    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      transactionClassification,
      category,
      subcategory,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user._id,
      unitNumber: unitNumber || req.user.unitNumber,
      resident: req.user._id,
      status: 'pending', // All resident requests go to pending
      notes: notes ? `${notes}\n\nRequest Reason: ${requestReason || 'Not specified'}` : `Request Reason: ${requestReason || 'Not specified'}`,
      approvalWorkflow: {
        requiredApprovals: 1,
        approvals: []
      }
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    await transaction.populate('createdBy', 'firstName lastName role');

    console.log(`✅ Transaction request created: ${transaction._id} - ${description} (${amount})`);

    res.status(201).json({
      success: true,
      message: 'Transaction request submitted successfully. It will be reviewed by the treasurer.',
      transaction
    });

  } catch (error) {
    console.error('Create transaction request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction request',
      error: error.message
    });
  }
};

// Get user's own transaction requests
exports.getMyTransactionRequests = async (req, res) => {
  try {
    const { limit = 20, page = 1, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { createdBy: req.user._id };
    if (status) {
      filter.status = status;
    }

    const transactions = await Transaction.find(filter)
      .populate('createdBy', 'firstName lastName role')
      .populate('vendor', 'companyName')
      .populate('approvalWorkflow.approvals.approver', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalRequests = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRequests / limit),
        totalItems: totalRequests,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get my transaction requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction requests',
      error: error.message
    });
  }
};
