const Unit = require('../models/Unit');
const User = require('../models/User');
const UnitMaintenanceFee = require('../models/UnitMaintenanceFee');
const Transaction = require('../models/Transaction');
const notificationService = require('../services/notificationService');

// Get all maintenance fees with pagination and filtering
exports.getMaintenanceFees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.month && req.query.year) {
      filter['billingPeriod.month'] = parseInt(req.query.month);
      filter['billingPeriod.year'] = parseInt(req.query.year);
    }

    if (req.query.unitId) {
      filter.unit = req.query.unitId;
    }

    if (req.query.overdue === 'true') {
      filter.status = 'overdue';
    }

    // Get maintenance fees without population
    const fees = await UnitMaintenanceFee.find(filter)
      .sort({ 'billingPeriod.year': -1, 'billingPeriod.month': -1 })
      .skip(skip)
      .limit(limit);

    // Get unit information separately to avoid population issues
    const unitIds = fees.map(fee => fee.unit);
    const units = await Unit.find({ _id: { $in: unitIds } })
      .populate('owner', 'firstName lastName email phone');

    // Create a map for quick lookup
    const unitMap = new Map();
    units.forEach(unit => {
      unitMap.set(unit._id.toString(), unit);
    });

    // Get user information for generatedBy
    const userIds = fees.map(fee => fee.generatedBy).filter(id => id);
    const users = await User.find({ _id: { $in: userIds } }, 'firstName lastName');
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), user);
    });

    // Manually attach unit and user data to fees
    const feesWithData = fees.map(fee => {
      const feeObj = fee.toObject();
      feeObj.unit = unitMap.get(fee.unit.toString()) || null;
      feeObj.generatedBy = userMap.get(fee.generatedBy?.toString()) || null;
      return feeObj;
    });

    // Get total count for pagination
    const totalFees = await UnitMaintenanceFee.countDocuments(filter);
    const totalPages = Math.ceil(totalFees / limit);

    // Calculate summary statistics
    const summary = await UnitMaintenanceFee.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalFees: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: { $ifNull: ['$paymentDetails.paidAmount', 0] } },
          totalOutstanding: { $sum: { $ifNull: ['$paymentDetails.remainingAmount', '$totalAmount'] } },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);

    res.json({
      success: true,
      fees: feesWithData,
      pagination: {
        currentPage: page,
        totalPages,
        totalFees,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: summary.length > 0 ? summary[0] : null
    });

  } catch (error) {
    console.error('Get maintenance fees error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance fees',
      error: error.message
    });
  }
};

// Generate monthly maintenance fees for all units
exports.generateMonthlyFees = async (req, res) => {
  try {
    const { month, year } = req.params;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Validate month and year
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month. Must be between 1 and 12.'
      });
    }

    if (yearNum < 2020 || yearNum > 2050) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year. Must be between 2020 and 2050.'
      });
    }

    // Check if fees already generated for this period
    const existingFees = await UnitMaintenanceFee.countDocuments({
      'billingPeriod.month': monthNum,
      'billingPeriod.year': yearNum
    });

    if (existingFees > 0) {
      return res.status(400).json({
        success: false,
        message: `Maintenance fees for ${month}/${year} have already been generated.`
      });
    }

    // Get all active units
    const units = await Unit.find({ isActive: true }).populate('owner', 'firstName lastName email');
    
    if (units.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active units found.'
      });
    }

    const generatedFees = [];
    const errors = [];

    // Generate fees for each unit
    for (const unit of units) {
      try {
        const calculation = unit.calculateMaintenanceForPeriod(monthNum, yearNum);
        
        // Calculate due date (5th of the month)
        const dueDate = new Date(yearNum, monthNum - 1, 5);
        
        const maintenanceFee = new UnitMaintenanceFee({
          unit: unit._id,
          billingPeriod: { month: monthNum, year: yearNum },
          feeBreakdown: calculation,
          totalAmount: calculation.totalAmount,
          dueDate,
          generatedBy: req.user._id
        });

        await maintenanceFee.save();
        generatedFees.push(maintenanceFee);

      } catch (error) {
        console.error(`Error generating fee for unit ${unit.unitNumber}:`, error);
        errors.push({
          unitNumber: unit.unitNumber,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Generated maintenance fees for ${generatedFees.length} units`,
      generatedCount: generatedFees.length,
      totalUnits: units.length,
      period: { month: monthNum, year: yearNum },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Generate monthly fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly fees',
      error: error.message
    });
  }
};

// Get maintenance fee by ID
exports.getMaintenanceFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fee = await UnitMaintenanceFee.findById(id)
      .populate({
        path: 'unit',
        populate: {
          path: 'owner tenant',
          select: 'firstName lastName email phone'
        }
      })
      .populate('generatedBy lastModifiedBy', 'firstName lastName')
      .populate('paymentDetails.payments.paidBy paymentDetails.payments.receivedBy', 'firstName lastName');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance fee not found'
      });
    }

    res.json({
      success: true,
      fee
    });

  } catch (error) {
    console.error('Get maintenance fee by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance fee',
      error: error.message
    });
  }
};

// Record payment for maintenance fee
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, referenceNumber, paidBy, notes } = req.body;

    const fee = await UnitMaintenanceFee.findById(id).populate('unit');
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance fee not found'
      });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Maintenance fee is already fully paid'
      });
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than 0'
      });
    }

    const remainingAmount = fee.totalAmount - (fee.paymentDetails?.paidAmount || 0);
    if (paymentAmount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed remaining balance of LKR ${remainingAmount}`
      });
    }

    // Add payment record
    const paymentData = {
      amount: paymentAmount,
      paidDate: new Date(),
      paymentMethod,
      referenceNumber,
      paidBy: paidBy || req.user._id,
      receivedBy: req.user._id,
      notes
    };

    await fee.addPayment(paymentData);

    // Create corresponding transaction record
    const isPartialPayment = paymentAmount < remainingAmount;
    const paymentType = isPartialPayment ? 'Partial Payment' : 'Full Payment';

    const transaction = new Transaction({
      description: `Maintenance Fee ${paymentType} - Unit ${fee.unit.unitNumber} - ${fee.billingPeriodDisplay}`,
      amount: paymentAmount,
      type: 'income',
      transactionClassification: 'recurring_income',
      category: 'maintenance_fee',
      status: 'paid', // Transaction is paid (money received)
      paymentMethod,
      referenceNumber,
      unitReference: fee.unit._id,
      maintenanceFeeReference: fee._id,
      unitMaintenanceDetails: {
        unitNumber: fee.unit.unitNumber,
        billingPeriod: fee.billingPeriod,
        surfaceArea: fee.unit.surfaceArea,
        maintenanceRate: fee.unit.maintenanceRate,
        totalFeeAmount: fee.totalAmount,
        paymentAmount: paymentAmount,
        feeStatus: fee.status,
        isPartialPayment: isPartialPayment
      },
      createdBy: req.user._id,
      approvedBy: req.user._id,
      approvalWorkflow: {
        requiredApprovals: 1,
        approvals: [{
          approver: req.user._id,
          status: 'approved',
          comments: 'Auto-approved maintenance fee payment',
          date: new Date()
        }]
      }
    });

    await transaction.save();

    // Update the maintenance fee with transaction reference
    fee.linkedTransaction = transaction._id;
    await fee.save();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      fee,
      transaction
    });

  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  }
};

// Add adjustment to maintenance fee
exports.addAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, amount, reason } = req.body;

    const fee = await UnitMaintenanceFee.findById(id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance fee not found'
      });
    }

    const adjustmentData = {
      type,
      description,
      amount: parseFloat(amount),
      appliedBy: req.user._id,
      reason
    };

    await fee.addAdjustment(adjustmentData);

    res.json({
      success: true,
      message: 'Adjustment added successfully',
      fee
    });

  } catch (error) {
    console.error('Add adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add adjustment',
      error: error.message
    });
  }
};

// Get unit's maintenance fee history
exports.getUnitFeeHistory = async (req, res) => {
  try {
    const { unitId } = req.params;
    const limit = parseInt(req.query.limit) || 12;

    const fees = await UnitMaintenanceFee.getUnitFeeHistory(unitId, limit);

    res.json({
      success: true,
      fees
    });

  } catch (error) {
    console.error('Get unit fee history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unit fee history',
      error: error.message
    });
  }
};

// Get overdue maintenance fees
exports.getOverdueFees = async (req, res) => {
  try {
    const overdueFees = await UnitMaintenanceFee.getOverdueFees();

    res.json({
      success: true,
      overdueFees
    });

  } catch (error) {
    console.error('Get overdue fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue fees',
      error: error.message
    });
  }
};

// Get fees for specific period
exports.getFeesForPeriod = async (req, res) => {
  try {
    const { month, year } = req.params;

    const fees = await UnitMaintenanceFee.getFeesForPeriod(
      parseInt(month),
      parseInt(year)
    );

    res.json({
      success: true,
      period: { month: parseInt(month), year: parseInt(year) },
      fees
    });

  } catch (error) {
    console.error('Get fees for period error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fees for period',
      error: error.message
    });
  }
};

// Get maintenance dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Allow month/year to be specified via query params, default to current month
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    console.log(`📊 Getting dashboard stats for ${targetMonth}/${targetYear}`);

    // Get target month statistics
    const currentMonthStats = await UnitMaintenanceFee.aggregate([
      {
        $match: {
          'billingPeriod.month': targetMonth,
          'billingPeriod.year': targetYear
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: { $ifNull: ['$paymentDetails.paidAmount', 0] } }
        }
      }
    ]);

    // Get overdue statistics
    const overdueStats = await UnitMaintenanceFee.aggregate([
      {
        $match: {
          status: 'overdue'
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: { $ifNull: ['$paymentDetails.remainingAmount', '$totalAmount'] } }
        }
      }
    ]);

    // Get total units
    const totalUnits = await Unit.countDocuments({ isActive: true });

    // Get collection rate for current month
    const currentMonthTotal = currentMonthStats.reduce((sum, stat) => sum + stat.totalAmount, 0);
    const currentMonthPaid = currentMonthStats.reduce((sum, stat) => sum + stat.paidAmount, 0);
    const collectionRate = currentMonthTotal > 0 ? (currentMonthPaid / currentMonthTotal) * 100 : 0;

    res.json({
      success: true,
      stats: {
        currentMonth: {
          month: targetMonth,
          year: targetYear,
          totalUnits,
          statusBreakdown: currentMonthStats,
          totalAmount: currentMonthTotal,
          paidAmount: currentMonthPaid,
          collectionRate: Math.round(collectionRate * 100) / 100
        },
        overdue: overdueStats.length > 0 ? overdueStats[0] : { count: 0, totalAmount: 0 }
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};
