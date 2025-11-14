const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Transaction type is required']
  },
  transactionClassification: {
    type: String,
    enum: ['recurring_income', 'adhoc_income', 'recurring_expense', 'adhoc_expense'],
    required: [true, 'Transaction classification is required']
  },
  category: {
    type: String,
    enum: [
      'maintenance',
      'maintenance_fee',
      'utilities',
      'emergency',
      'vendor_payment',
      'dues',
      'insurance',
      'security',
      'cleaning',
      'landscaping',
      'repairs',
      'facility_rental',
      'parking',
      'other'
    ],
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date // For expenses that have payment due dates
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid', 'overdue', 'cancelled'],
    default: 'pending',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'check', 'card', 'online', 'other'],
    required: function() {
      return this.status === 'paid';
    }
  },
  referenceNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Reference number cannot exceed 50 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvalWorkflow: {
    requiredApprovals: {
      type: Number,
      default: 1,
      min: 1,
      max: 3
    },
    approvals: [{
      approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [500, 'Comments cannot exceed 500 characters']
      },
      date: {
        type: Date
      }
    }],
    finalApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    finalApprovalDate: {
      type: Date
    }
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  unitNumber: {
    type: String,
    trim: true,
    maxlength: [10, 'Unit number cannot exceed 10 characters']
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['invoice', 'receipt', 'contract', 'estimate', 'other'],
      default: 'other'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recurringTransaction: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'semi_annual', 'annual']
    },
    nextDueDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    parentTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    // New fields for recurring management
    autoGenerate: {
      type: Boolean,
      default: false
    },
    generatedCount: {
      type: Number,
      default: 0
    },
    maxGenerations: {
      type: Number,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  budgetAllocation: {
    budgetCategory: {
      type: String,
      trim: true
    },
    budgetYear: {
      type: Number,
      min: 2020,
      max: 2050
    },
    budgetedAmount: {
      type: Number,
      min: 0
    }
  },
  taxInformation: {
    taxable: {
      type: Boolean,
      default: false
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100
    },
    taxAmount: {
      type: Number,
      min: 0
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  // Unit-based maintenance integration
  unitReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  maintenanceFeeReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitMaintenanceFee'
  },
  unitMaintenanceDetails: {
    unitNumber: {
      type: String,
      trim: true
    },
    billingPeriod: {
      month: {
        type: Number,
        min: 1,
        max: 12
      },
      year: {
        type: Number,
        min: 2020,
        max: 2050
      }
    },
    surfaceArea: {
      type: Number,
      min: 0
    },
    maintenanceRate: {
      type: Number,
      min: 0
    },
    totalFeeAmount: {
      type: Number,
      min: 0
    },
    paymentAmount: {
      type: Number,
      min: 0
    },
    feeStatus: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partially_paid', 'waived', 'cancelled']
    },
    isPartialPayment: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if transaction is overdue
transactionSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && 
         ['pending', 'approved'].includes(this.status);
});

// Virtual for approval status
transactionSchema.virtual('approvalStatus').get(function() {
  if (!this.approvalWorkflow || !this.approvalWorkflow.approvals) {
    return 'pending';
  }

  const approvals = this.approvalWorkflow.approvals;
  const approved = approvals.filter(a => a.status === 'approved').length;
  const rejected = approvals.filter(a => a.status === 'rejected').length;

  if (rejected > 0) return 'rejected';
  if (approved >= this.approvalWorkflow.requiredApprovals) return 'approved';
  return 'pending';
});

// Virtual for net amount (including tax)
transactionSchema.virtual('netAmount').get(function() {
  if (this.taxInformation.taxable && this.taxInformation.taxAmount) {
    return this.amount + this.taxInformation.taxAmount;
  }
  return this.amount;
});

// Indexes for performance - optimized for reporting queries
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, category: 1 });
transactionSchema.index({ transactionClassification: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdBy: 1 });
transactionSchema.index({ vendor: 1 });
transactionSchema.index({ resident: 1 });
transactionSchema.index({ dueDate: 1 });
transactionSchema.index({ 'budgetAllocation.budgetYear': 1 });
transactionSchema.index({ 'approvalWorkflow.approvals.approver': 1 });
transactionSchema.index({ 'recurringTransaction.isRecurring': 1 });
transactionSchema.index({ 'recurringTransaction.nextDueDate': 1 });

// Compound indexes for report queries (most important for performance)
transactionSchema.index({ date: -1, type: 1, status: 1 });
transactionSchema.index({ date: -1, transactionClassification: 1, status: 1 });
transactionSchema.index({ type: 1, status: 1, category: 1 });
transactionSchema.index({ date: -1, type: 1, category: 1, status: 1 });

// Unit maintenance indexes
transactionSchema.index({ unitReference: 1 });
transactionSchema.index({ maintenanceFeeReference: 1 });
transactionSchema.index({ 'unitMaintenanceDetails.unitNumber': 1 });
transactionSchema.index({ 'unitMaintenanceDetails.billingPeriod.year': 1, 'unitMaintenanceDetails.billingPeriod.month': 1 });

// Pre-save middleware to calculate tax amount and handle empty vendor
transactionSchema.pre('save', function(next) {
  // Handle empty vendor field
  if (this.vendor === '' || this.vendor === null) {
    this.vendor = undefined;
  }

  // Calculate tax amount
  if (this.taxInformation.taxable && this.taxInformation.taxRate) {
    this.taxInformation.taxAmount = (this.amount * this.taxInformation.taxRate) / 100;
  }
  next();
});

// Method to add approval
transactionSchema.methods.addApproval = function(approverId, status, comments = '') {
  const existingApproval = this.approvalWorkflow.approvals.find(
    approval => approval.approver.toString() === approverId.toString()
  );
  
  if (existingApproval) {
    existingApproval.status = status;
    existingApproval.comments = comments;
    existingApproval.date = new Date();
  } else {
    this.approvalWorkflow.approvals.push({
      approver: approverId,
      status: status,
      comments: comments,
      date: new Date()
    });
  }
  
  // Check if all required approvals are met
  const approvedCount = this.approvalWorkflow.approvals.filter(
    a => a.status === 'approved'
  ).length;
  
  if (approvedCount >= this.approvalWorkflow.requiredApprovals) {
    this.status = 'approved';
    this.approvalWorkflow.finalApprover = approverId;
    this.approvalWorkflow.finalApprovalDate = new Date();
  } else if (status === 'rejected') {
    this.status = 'rejected';
  }
  
  return this.save();
};

// Method to mark as paid
transactionSchema.methods.markAsPaid = function(paymentMethod, referenceNumber = '') {
  this.status = 'paid';
  this.paymentMethod = paymentMethod;
  this.referenceNumber = referenceNumber;
  
  return this.save();
};

// Method to generate next recurring transaction
transactionSchema.methods.generateNextRecurring = function() {
  if (!this.recurringTransaction.isRecurring || !this.recurringTransaction.autoGenerate) {
    return null;
  }

  const nextDate = new Date(this.recurringTransaction.nextDueDate);
  const frequency = this.recurringTransaction.frequency;

  // Calculate next due date based on frequency
  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semi_annual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  // Create new transaction data
  const newTransactionData = {
    description: this.description,
    amount: this.amount,
    type: this.type,
    transactionClassification: this.transactionClassification,
    category: this.category,
    subcategory: this.subcategory,
    date: nextDate,
    dueDate: nextDate,
    status: 'pending',
    createdBy: this.createdBy,
    vendor: this.vendor,
    unitNumber: this.unitNumber,
    resident: this.resident,
    budgetAllocation: this.budgetAllocation,
    taxInformation: this.taxInformation,
    recurringTransaction: {
      isRecurring: false, // Generated transactions are not recurring themselves
      parentTransaction: this._id
    },
    notes: `Auto-generated from recurring transaction: ${this.description}`
  };

  return newTransactionData;
};

// Method to stop recurring transaction
transactionSchema.methods.stopRecurring = function() {
  this.recurringTransaction.isActive = false;
  this.recurringTransaction.autoGenerate = false;
  return this.save();
};

// Static method to get monthly summary
transactionSchema.statics.getMonthlySummary = function(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        categories: {
          $push: {
            category: '$_id.category',
            amount: '$totalAmount',
            count: '$count'
          }
        },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
};

// Static method to get transactions by classification
transactionSchema.statics.getByClassification = function(classification, options = {}) {
  const query = { transactionClassification: classification };

  if (options.status) {
    query.status = options.status;
  }

  if (options.dateRange) {
    query.date = {
      $gte: options.dateRange.start,
      $lte: options.dateRange.end
    };
  }

  return this.find(query)
    .populate('createdBy', 'firstName lastName role')
    .populate('vendor', 'companyName')
    .populate('resident', 'firstName lastName unitNumber')
    .sort({ date: -1 });
};

// Static method to get income statement data
transactionSchema.statics.getIncomeStatement = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          category: '$category',
          classification: '$transactionClassification'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          type: '$_id.type',
          classification: '$_id.classification'
        },
        categories: {
          $push: {
            category: '$_id.category',
            amount: '$totalAmount',
            count: '$count'
          }
        },
        totalAmount: { $sum: '$totalAmount' }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        classifications: {
          $push: {
            classification: '$_id.classification',
            categories: '$categories',
            totalAmount: '$totalAmount'
          }
        },
        grandTotal: { $sum: '$totalAmount' }
      }
    }
  ]);
};

// Static method to get cash flow data
transactionSchema.statics.getCashFlowData = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          type: '$type'
        },
        amount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        inflow: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$amount', 0] }
        },
        outflow: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$amount', 0] }
        },
        netFlow: {
          $sum: {
            $cond: [
              { $eq: ['$_id.type', 'income'] },
              '$amount',
              { $multiply: ['$amount', -1] }
            ]
          }
        },
        transactionCount: { $sum: '$count' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get transaction trends
transactionSchema.statics.getTransactionTrends = function(startDate, endDate, groupBy = 'day') {
  const dateFormat = {
    day: "%Y-%m-%d",
    week: "%Y-%U",
    month: "%Y-%m",
    year: "%Y"
  };

  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: {
          period: { $dateToString: { format: dateFormat[groupBy], date: "$date" } },
          type: '$type',
          classification: '$transactionClassification'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.period',
        income: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$totalAmount', 0] }
        },
        expenses: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$totalAmount', 0] }
        },
        recurringIncome: {
          $sum: {
            $cond: [
              { $eq: ['$_id.classification', 'recurring_income'] },
              '$totalAmount',
              0
            ]
          }
        },
        adhocIncome: {
          $sum: {
            $cond: [
              { $eq: ['$_id.classification', 'adhoc_income'] },
              '$totalAmount',
              0
            ]
          }
        },
        recurringExpenses: {
          $sum: {
            $cond: [
              { $eq: ['$_id.classification', 'recurring_expense'] },
              '$totalAmount',
              0
            ]
          }
        },
        adhocExpenses: {
          $sum: {
            $cond: [
              { $eq: ['$_id.classification', 'adhoc_expense'] },
              '$totalAmount',
              0
            ]
          }
        },
        transactionCount: { $sum: '$count' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get category breakdown
transactionSchema.statics.getCategoryBreakdown = function(startDate, endDate, type = null) {
  const matchStage = {
    date: { $gte: startDate, $lte: endDate },
    status: { $in: ['approved', 'paid'] }
  };

  if (type) {
    matchStage.type = type;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.category',
        totalAmount: { $sum: '$totalAmount' },
        totalCount: { $sum: '$count' },
        avgAmount: { $avg: '$avgAmount' },
        types: {
          $push: {
            type: '$_id.type',
            amount: '$totalAmount',
            count: '$count'
          }
        }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
