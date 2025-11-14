const reportService = require('../services/reportService');
const pdfTemplateService = require('../services/pdfTemplateService');

// Generate financial report
exports.generateFinancialReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, ...options } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Validate report type
    const validReportTypes = ['income_statement', 'cash_flow', 'transaction_summary', 'budget_variance', 'outstanding_dues'];
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report type'
      });
    }

    // Add user context to options
    options.userId = req.user._id;

    console.log(`📊 Generating ${reportType} report for user ${req.user.firstName} ${req.user.lastName}`);

    const reportData = await reportService.generateFinancialReport(
      reportType,
      startDate,
      endDate,
      options
    );

    res.json({
      success: true,
      report: reportData
    });

  } catch (error) {
    console.error('Generate financial report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial report',
      error: error.message
    });
  }
};

// Generate PDF report
exports.generatePDFReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, ...options } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Add user context to options
    options.userId = req.user._id;

    console.log(`📄 Generating PDF ${reportType} report for user ${req.user.firstName} ${req.user.lastName}`);

    // Generate report data
    const reportData = await reportService.generateFinancialReport(
      reportType,
      startDate,
      endDate,
      options
    );

    // Generate PDF
    const pdfBytes = await pdfTemplateService.generateReportPDF(reportData, options);

    // Set response headers for PDF download
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBytes.length);

    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Generate PDF report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF report',
      error: error.message
    });
  }
};

// Export report data
exports.exportReport = async (req, res) => {
  try {
    const { format, reportType } = req.params;
    const { startDate, endDate, ...options } = req.query;

    // Validate parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    if (!['csv', 'json'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid export format. Supported formats: csv, json'
      });
    }

    // Add user context to options
    options.userId = req.user._id;

    console.log(`📤 Exporting ${reportType} report as ${format} for user ${req.user.firstName} ${req.user.lastName}`);

    // Generate report data
    const reportData = await reportService.generateFinancialReport(
      reportType,
      startDate,
      endDate,
      options
    );

    if (format === 'csv') {
      const csvData = await reportService.exportToCSV(reportData);
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvData);
    } else if (format === 'json') {
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(reportData);
    }

  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};

// Generate custom report with flexible parameters
exports.generateCustomReport = async (req, res) => {
  try {
    const {
      reportType,
      startDate,
      endDate,
      filters = {},
      groupBy,
      includeCharts = true,
      includeComparison = true
    } = req.body;

    // Validate required parameters
    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Report type, start date, and end date are required'
      });
    }

    const options = {
      ...filters,
      groupBy,
      includeCharts,
      includeComparison,
      userId: req.user._id
    };

    console.log(`🎯 Generating custom ${reportType} report for user ${req.user.firstName} ${req.user.lastName}`);

    const reportData = await reportService.generateFinancialReport(
      reportType,
      startDate,
      endDate,
      options
    );

    res.json({
      success: true,
      report: reportData
    });

  } catch (error) {
    console.error('Generate custom report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate custom report',
      error: error.message
    });
  }
};

// Get predefined date ranges
exports.getDateRanges = async (req, res) => {
  try {
    const dateRanges = reportService.getPredefinedDateRanges();

    res.json({
      success: true,
      dateRanges
    });

  } catch (error) {
    console.error('Get date ranges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get date ranges',
      error: error.message
    });
  }
};

// Get report metadata (available report types, categories, etc.)
exports.getReportMetadata = async (req, res) => {
  try {
    const metadata = {
      reportTypes: [
        {
          id: 'income_statement',
          name: 'Income Statement',
          description: 'Comprehensive income and expense analysis with category breakdown',
          features: ['category_breakdown', 'period_comparison', 'profit_analysis']
        },
        {
          id: 'cash_flow',
          name: 'Cash Flow Report',
          description: 'Daily cash inflows and outflows with running balance',
          features: ['daily_breakdown', 'running_balance', 'trend_analysis']
        },
        {
          id: 'transaction_summary',
          name: 'Transaction Summary',
          description: 'Detailed transaction listings with filtering options',
          features: ['detailed_listing', 'advanced_filtering', 'export_options']
        },
        {
          id: 'budget_variance',
          name: 'Budget Variance',
          description: 'Budget vs actual analysis with variance calculations',
          features: ['variance_analysis', 'budget_tracking', 'performance_metrics']
        },
        {
          id: 'outstanding_dues',
          name: 'Outstanding Dues',
          description: 'Pending and overdue payment tracking',
          features: ['due_tracking', 'aging_analysis', 'collection_status']
        }
      ],
      exportFormats: [
        { id: 'pdf', name: 'PDF', description: 'Professional formatted report' },
        { id: 'csv', name: 'CSV', description: 'Spreadsheet compatible data' },
        { id: 'json', name: 'JSON', description: 'Raw data format' }
      ],
      categories: [
        'maintenance', 'utilities', 'emergency', 'vendor_payment', 'dues',
        'insurance', 'security', 'cleaning', 'landscaping', 'repairs',
        'facility_rental', 'parking', 'other'
      ],
      classifications: [
        'recurring_income', 'adhoc_income', 'recurring_expense', 'adhoc_expense'
      ],
      statuses: ['pending', 'approved', 'rejected', 'paid', 'overdue', 'cancelled'],
      dateRangePresets: [
        'today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 
        'lastMonth', 'thisQuarter', 'lastQuarter', 'thisYear', 'lastYear'
      ]
    };

    res.json({
      success: true,
      metadata
    });

  } catch (error) {
    console.error('Get report metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report metadata',
      error: error.message
    });
  }
};

// Get report statistics for dashboard
exports.getReportStatistics = async (req, res) => {
  try {
    const { period = 'thisMonth' } = req.query;
    const dateRanges = reportService.getPredefinedDateRanges();
    const selectedRange = dateRanges[period] || dateRanges.thisMonth;

    // Generate quick statistics
    const incomeStatement = await reportService.generateFinancialReport(
      'income_statement',
      selectedRange.startDate,
      selectedRange.endDate,
      { skipComparison: true, userId: req.user._id }
    );

    const outstandingDues = await reportService.generateFinancialReport(
      'outstanding_dues',
      null,
      null,
      { userId: req.user._id }
    );

    const statistics = {
      period: {
        name: period,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate
      },
      summary: incomeStatement.summary,
      outstandingDues: outstandingDues.summary,
      trends: {
        incomeGrowth: incomeStatement.comparison?.changes?.incomeChange || 0,
        expenseGrowth: incomeStatement.comparison?.changes?.expenseChange || 0,
        netIncomeGrowth: incomeStatement.comparison?.changes?.netIncomeChange || 0
      }
    };

    res.json({
      success: true,
      statistics
    });

  } catch (error) {
    console.error('Get report statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report statistics',
      error: error.message
    });
  }
};
