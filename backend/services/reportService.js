const Transaction = require('../models/Transaction');
const PDFDocument = require('pdf-lib').PDFDocument;
const fs = require('fs').promises;
const path = require('path');

class ReportService {
  constructor() {
    // Simple in-memory cache for report data (5 minute TTL)
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generate cache key
  getCacheKey(reportType, startDate, endDate, options) {
    const key = `${reportType}_${startDate.toISOString()}_${endDate.toISOString()}_${JSON.stringify(options)}`;
    return key;
  }

  // Get from cache
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      console.log(`📋 Cache hit for ${key}`);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  // Set to cache
  setToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`💾 Cached report data for ${key}`);
  }
  
  // Generate comprehensive financial report
  async generateFinancialReport(reportType, startDate, endDate, options = {}) {
    try {
      console.log(`📊 Generating ${reportType} report from ${startDate} to ${endDate}`);

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check cache first (except for outstanding_dues which is real-time)
      if (reportType !== 'outstanding_dues') {
        const cacheKey = this.getCacheKey(reportType, start, end, options);
        const cachedResult = this.getFromCache(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      }

      let result;
      switch (reportType) {
        case 'income_statement':
          result = await this.generateIncomeStatement(start, end, options);
          break;
        case 'cash_flow':
          result = await this.generateCashFlowReport(start, end, options);
          break;
        case 'transaction_summary':
          result = await this.generateTransactionSummary(start, end, options);
          break;
        case 'budget_variance':
          result = await this.generateBudgetVariance(start, end, options);
          break;
        case 'outstanding_dues':
          result = await this.generateOutstandingDues(options);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      // Cache the result (except for outstanding_dues)
      if (reportType !== 'outstanding_dues') {
        const cacheKey = this.getCacheKey(reportType, start, end, options);
        this.setToCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('Report generation error:', error);
      throw error;
    }
  }

  // Generate Income Statement Report
  async generateIncomeStatement(startDate, endDate, options = {}) {
    console.log(`📊 Generating income statement: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Use Promise.all to run income and expense queries in parallel
    const [incomeData, expenseData] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            type: 'income',
            status: { $in: ['approved', 'paid'] }
          }
        },
        {
          $group: {
            _id: {
              category: '$category',
              classification: '$transactionClassification'
            },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.classification',
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
      ]),
      Transaction.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            type: 'expense',
            status: { $in: ['approved', 'paid'] }
          }
        },
        {
          $group: {
            _id: {
              category: '$category',
              classification: '$transactionClassification'
            },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.classification',
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
      ])
    ]);



    const totalIncome = incomeData.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.totalAmount, 0);
    const netIncome = totalIncome - totalExpenses;

    // Get previous period for comparison (only if not skipped)
    let previousPeriod = null;
    if (!options.skipComparison) {
      const periodLength = endDate - startDate;
      const prevStartDate = new Date(startDate.getTime() - periodLength);
      const prevEndDate = new Date(startDate.getTime() - 1);

      console.log(`📊 Generating comparison period: ${prevStartDate.toISOString()} to ${prevEndDate.toISOString()}`);
      previousPeriod = await this.generateIncomeStatement(prevStartDate, prevEndDate, { skipComparison: true });
    }

    return {
      reportType: 'income_statement',
      period: { startDate, endDate },
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        profitMargin: totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : 0
      },
      income: {
        classifications: incomeData,
        total: totalIncome
      },
      expenses: {
        classifications: expenseData,
        total: totalExpenses
      },
      comparison: options.skipComparison ? null : {
        previousPeriod: previousPeriod.summary,
        changes: {
          incomeChange: totalIncome - (previousPeriod.summary?.totalIncome || 0),
          expenseChange: totalExpenses - (previousPeriod.summary?.totalExpenses || 0),
          netIncomeChange: netIncome - (previousPeriod.summary?.netIncome || 0)
        }
      },
      generatedAt: new Date(),
      generatedBy: options.userId
    };
  }

  // Generate Cash Flow Report
  async generateCashFlowReport(startDate, endDate, options = {}) {
    const dailyCashFlow = await Transaction.aggregate([
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
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing dates with zero values
    const filledDailyFlow = this.fillMissingDates(dailyCashFlow, startDate, endDate);

    // Calculate running balance
    let runningBalance = options.openingBalance || 2000000; // Base balance
    const cashFlowWithBalance = filledDailyFlow.map(day => {
      runningBalance += day.netFlow;
      return {
        ...day,
        runningBalance
      };
    });

    const totalInflow = filledDailyFlow.reduce((sum, day) => sum + day.inflow, 0);
    const totalOutflow = filledDailyFlow.reduce((sum, day) => sum + day.outflow, 0);
    const netCashFlow = totalInflow - totalOutflow;

    return {
      reportType: 'cash_flow',
      period: { startDate, endDate },
      summary: {
        openingBalance: options.openingBalance || 2000000,
        totalInflow,
        totalOutflow,
        netCashFlow,
        closingBalance: runningBalance
      },
      dailyFlow: cashFlowWithBalance,
      generatedAt: new Date(),
      generatedBy: options.userId
    };
  }

  // Generate Transaction Summary Report
  async generateTransactionSummary(startDate, endDate, options = {}) {
    const query = {
      date: { $gte: startDate, $lte: endDate }
    };

    // Apply filters
    if (options.category) query.category = options.category;
    if (options.classification) query.transactionClassification = options.classification;
    if (options.status) query.status = options.status;
    if (options.type) query.type = options.type;

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'firstName lastName role')
      .populate('vendor', 'companyName contactInfo')
      .populate('resident', 'firstName lastName unitNumber')
      .sort({ date: -1 })
      .limit(options.limit || 1000);

    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          }
        }
      }
    ]);

    return {
      reportType: 'transaction_summary',
      period: { startDate, endDate },
      filters: options,
      summary: summary[0] || {
        totalTransactions: 0,
        totalAmount: 0,
        totalIncome: 0,
        totalExpenses: 0,
        pendingCount: 0,
        approvedCount: 0,
        paidCount: 0
      },
      transactions,
      generatedAt: new Date(),
      generatedBy: options.userId
    };
  }

  // Generate Budget Variance Report
  async generateBudgetVariance(startDate, endDate, options = {}) {
    const budgetYear = options.budgetYear || new Date().getFullYear();
    
    const actualData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ['approved', 'paid'] },
          'budgetAllocation.budgetYear': budgetYear
        }
      },
      {
        $group: {
          _id: {
            category: '$category',
            budgetCategory: '$budgetAllocation.budgetCategory'
          },
          actualAmount: { $sum: '$amount' },
          budgetedAmount: { $first: '$budgetAllocation.budgetedAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const varianceData = actualData.map(item => {
      const variance = (item.budgetedAmount || 0) - item.actualAmount;
      const variancePercent = item.budgetedAmount > 0 
        ? ((variance / item.budgetedAmount) * 100).toFixed(2)
        : 0;

      return {
        ...item,
        variance,
        variancePercent,
        status: variance >= 0 ? 'under_budget' : 'over_budget'
      };
    });

    return {
      reportType: 'budget_variance',
      period: { startDate, endDate },
      budgetYear,
      variances: varianceData,
      summary: {
        totalBudgeted: varianceData.reduce((sum, item) => sum + (item.budgetedAmount || 0), 0),
        totalActual: varianceData.reduce((sum, item) => sum + item.actualAmount, 0),
        totalVariance: varianceData.reduce((sum, item) => sum + item.variance, 0)
      },
      generatedAt: new Date(),
      generatedBy: options.userId
    };
  }

  // Generate Outstanding Dues Report
  async generateOutstandingDues(options = {}) {
    const outstandingTransactions = await Transaction.find({
      type: 'income',
      status: { $in: ['pending', 'overdue'] }
    })
    .populate('createdBy', 'firstName lastName role')
    .populate('resident', 'firstName lastName unitNumber')
    .sort({ dueDate: 1, date: 1 });

    const summary = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: { $in: ['pending', 'overdue'] }
        }
      },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalOutstanding = summary.reduce((sum, item) => sum + item.totalAmount, 0);

    return {
      reportType: 'outstanding_dues',
      summary: {
        totalOutstanding,
        pendingAmount: summary.find(s => s._id === 'pending')?.totalAmount || 0,
        overdueAmount: summary.find(s => s._id === 'overdue')?.totalAmount || 0,
        pendingCount: summary.find(s => s._id === 'pending')?.count || 0,
        overdueCount: summary.find(s => s._id === 'overdue')?.count || 0
      },
      transactions: outstandingTransactions,
      generatedAt: new Date(),
      generatedBy: options.userId
    };
  }

  // Export to CSV format
  async exportToCSV(reportData) {
    const { reportType, transactions } = reportData;
    
    if (!transactions || !Array.isArray(transactions)) {
      throw new Error('No transaction data available for CSV export');
    }

    const headers = [
      'Date', 'Description', 'Type', 'Classification', 'Category', 
      'Amount', 'Status', 'Created By', 'Vendor', 'Reference'
    ];

    const csvRows = [headers.join(',')];
    
    transactions.forEach(transaction => {
      const row = [
        new Date(transaction.date).toLocaleDateString(),
        `"${transaction.description}"`,
        transaction.type,
        transaction.transactionClassification,
        transaction.category,
        transaction.amount,
        transaction.status,
        transaction.createdBy ? `"${transaction.createdBy.firstName} ${transaction.createdBy.lastName}"` : '',
        transaction.vendor ? `"${transaction.vendor.companyName}"` : '',
        transaction.referenceNumber || ''
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Helper method to fill missing dates in cash flow data
  fillMissingDates(dailyFlow, startDate, endDate) {
    const filledData = [];
    const dataMap = new Map();

    // Create a map of existing data
    dailyFlow.forEach(day => {
      dataMap.set(day._id, day);
    });

    // Generate all dates in the range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];

      if (dataMap.has(dateStr)) {
        filledData.push(dataMap.get(dateStr));
      } else {
        filledData.push({
          _id: dateStr,
          inflow: 0,
          outflow: 0,
          netFlow: 0
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  }

  // Get predefined date ranges
  getPredefinedDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      today: {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      },
      yesterday: {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999)
      },
      thisWeek: {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay(), 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()), 23, 59, 59, 999)
      },
      lastWeek: {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7, 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1, 23, 59, 59, 999)
      },
      thisMonth: {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      },
      lastMonth: {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      },
      thisQuarter: this.getQuarterDates(now, 0),
      lastQuarter: this.getQuarterDates(now, -1),
      thisYear: {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      },
      lastYear: {
        startDate: new Date(now.getFullYear() - 1, 0, 1),
        endDate: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
      }
    };
  }

  // Helper method to get quarter dates
  getQuarterDates(date, quarterOffset = 0) {
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3) + quarterOffset;
    const adjustedYear = year + Math.floor(quarter / 4);
    const adjustedQuarter = ((quarter % 4) + 4) % 4;
    
    const startMonth = adjustedQuarter * 3;
    const endMonth = startMonth + 2;
    
    return {
      startDate: new Date(adjustedYear, startMonth, 1),
      endDate: new Date(adjustedYear, endMonth + 1, 0, 23, 59, 59, 999)
    };
  }
}

module.exports = new ReportService();
