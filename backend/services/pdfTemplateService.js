const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class PDFTemplateService {
  
  async generateReportPDF(reportData, options = {}) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      
      // Load fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      let yPosition = height - 50;
      
      // Header
      yPosition = await this.drawHeader(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
      
      // Report content based on type
      switch (reportData.reportType) {
        case 'income_statement':
          yPosition = await this.drawIncomeStatement(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
          break;
        case 'cash_flow':
          yPosition = await this.drawCashFlowReport(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
          break;
        case 'transaction_summary':
          yPosition = await this.drawTransactionSummary(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
          break;
        case 'budget_variance':
          yPosition = await this.drawBudgetVariance(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
          break;
        case 'outstanding_dues':
          yPosition = await this.drawOutstandingDues(page, helveticaBoldFont, helveticaFont, reportData, yPosition, width);
          break;
      }
      
      // Footer
      await this.drawFooter(page, helveticaFont, reportData, width);
      
      return await pdfDoc.save();
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  async drawHeader(page, boldFont, regularFont, reportData, yPosition, width) {
    // Company header
    page.drawText('SpanTower27 Condominium Management', {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    yPosition -= 25;

    // Report title
    const reportTitles = {
      'income_statement': 'Income Statement Report',
      'cash_flow': 'Cash Flow Report',
      'transaction_summary': 'Transaction Summary Report',
      'budget_variance': 'Budget Variance Report',
      'outstanding_dues': 'Outstanding Dues Report'
    };
    
    page.drawText(reportTitles[reportData.reportType] || 'Financial Report', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 20;

    // Period and generation info
    if (reportData.period) {
      const periodText = `Period: ${new Date(reportData.period.startDate).toLocaleDateString()} - ${new Date(reportData.period.endDate).toLocaleDateString()}`;
      page.drawText(periodText, {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
    }
    
    page.drawText(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, {
      x: width - 200,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    yPosition -= 30;

    // Separator line
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    yPosition -= 20;

    return yPosition;
  }

  async drawIncomeStatement(page, boldFont, regularFont, reportData, yPosition, width) {
    const { summary, income, expenses, comparison } = reportData;
    
    // Summary section
    page.drawText('Financial Summary', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    const summaryItems = [
      ['Total Income:', `LKR ${summary.totalIncome.toLocaleString()}`],
      ['Total Expenses:', `LKR ${summary.totalExpenses.toLocaleString()}`],
      ['Net Income:', `LKR ${summary.netIncome.toLocaleString()}`],
      ['Profit Margin:', `${summary.profitMargin}%`]
    ];

    summaryItems.forEach(([label, value]) => {
      page.drawText(label, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(value, {
        x: 250,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: summary.netIncome >= 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0)
      });
      yPosition -= 18;
    });

    yPosition -= 10;

    // Income breakdown
    page.drawText('Income Breakdown', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 20;

    income.classifications.forEach(classification => {
      page.drawText(`${classification._id.replace('_', ' ').toUpperCase()}:`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(`LKR ${classification.totalAmount.toLocaleString()}`, {
        x: 300,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0, 0.6, 0)
      });
      yPosition -= 15;

      classification.categories.forEach(category => {
        page.drawText(`  • ${category.category}`, {
          x: 90,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.4, 0.4, 0.4)
        });
        
        page.drawText(`LKR ${category.amount.toLocaleString()}`, {
          x: 320,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.4, 0.4, 0.4)
        });
        yPosition -= 12;
      });
      yPosition -= 5;
    });

    yPosition -= 10;

    // Expenses breakdown
    page.drawText('Expense Breakdown', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 20;

    expenses.classifications.forEach(classification => {
      page.drawText(`${classification._id.replace('_', ' ').toUpperCase()}:`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(`LKR ${classification.totalAmount.toLocaleString()}`, {
        x: 300,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0.8, 0, 0)
      });
      yPosition -= 15;

      classification.categories.forEach(category => {
        page.drawText(`  • ${category.category}`, {
          x: 90,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.4, 0.4, 0.4)
        });
        
        page.drawText(`LKR ${category.amount.toLocaleString()}`, {
          x: 320,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.4, 0.4, 0.4)
        });
        yPosition -= 12;
      });
      yPosition -= 5;
    });

    // Comparison section if available
    if (comparison && yPosition > 100) {
      yPosition -= 15;
      page.drawText('Period Comparison', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1)
      });
      yPosition -= 20;

      const changes = comparison.changes;
      const comparisonItems = [
        ['Income Change:', changes.incomeChange >= 0 ? `+LKR ${changes.incomeChange.toLocaleString()}` : `LKR ${changes.incomeChange.toLocaleString()}`],
        ['Expense Change:', changes.expenseChange >= 0 ? `+LKR ${changes.expenseChange.toLocaleString()}` : `LKR ${changes.expenseChange.toLocaleString()}`],
        ['Net Income Change:', changes.netIncomeChange >= 0 ? `+LKR ${changes.netIncomeChange.toLocaleString()}` : `LKR ${changes.netIncomeChange.toLocaleString()}`]
      ];

      comparisonItems.forEach(([label, value]) => {
        page.drawText(label, {
          x: 70,
          y: yPosition,
          size: 11,
          font: regularFont,
          color: rgb(0.2, 0.2, 0.2)
        });
        
        const isPositive = value.startsWith('+');
        page.drawText(value, {
          x: 250,
          y: yPosition,
          size: 11,
          font: boldFont,
          color: isPositive ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0)
        });
        yPosition -= 18;
      });
    }

    return yPosition;
  }

  async drawCashFlowReport(page, boldFont, regularFont, reportData, yPosition, width) {
    const { summary, dailyFlow } = reportData;
    
    // Summary section
    page.drawText('Cash Flow Summary', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    const summaryItems = [
      ['Opening Balance:', `LKR ${summary.openingBalance.toLocaleString()}`],
      ['Total Inflow:', `LKR ${summary.totalInflow.toLocaleString()}`],
      ['Total Outflow:', `LKR ${summary.totalOutflow.toLocaleString()}`],
      ['Net Cash Flow:', `LKR ${summary.netCashFlow.toLocaleString()}`],
      ['Closing Balance:', `LKR ${summary.closingBalance.toLocaleString()}`]
    ];

    summaryItems.forEach(([label, value]) => {
      page.drawText(label, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(value, {
        x: 250,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: summary.netCashFlow >= 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0)
      });
      yPosition -= 18;
    });

    yPosition -= 20;

    // Daily cash flow table header
    page.drawText('Daily Cash Flow', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    // Table headers
    const headers = ['Date', 'Inflow', 'Outflow', 'Net Flow', 'Balance'];
    const columnWidths = [80, 80, 80, 80, 100];
    let xPosition = 70;

    headers.forEach((header, index) => {
      page.drawText(header, {
        x: xPosition,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      xPosition += columnWidths[index];
    });
    yPosition -= 15;

    // Table data (show last 10 days to fit on page)
    const recentDays = dailyFlow.slice(-10);
    recentDays.forEach(day => {
      xPosition = 70;
      const rowData = [
        day._id,
        `${day.inflow.toLocaleString()}`,
        `${day.outflow.toLocaleString()}`,
        `${day.netFlow.toLocaleString()}`,
        `${day.runningBalance.toLocaleString()}`
      ];

      rowData.forEach((data, index) => {
        page.drawText(data, {
          x: xPosition,
          y: yPosition,
          size: 9,
          font: regularFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        xPosition += columnWidths[index];
      });
      yPosition -= 12;
    });

    return yPosition;
  }

  async drawTransactionSummary(page, boldFont, regularFont, reportData, yPosition, width) {
    const { summary, transactions } = reportData;
    
    // Summary section
    page.drawText('Transaction Summary', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    const summaryItems = [
      ['Total Transactions:', summary.totalTransactions.toString()],
      ['Total Amount:', `LKR ${summary.totalAmount.toLocaleString()}`],
      ['Total Income:', `LKR ${summary.totalIncome.toLocaleString()}`],
      ['Total Expenses:', `LKR ${summary.totalExpenses.toLocaleString()}`],
      ['Pending:', summary.pendingCount.toString()],
      ['Approved:', summary.approvedCount.toString()],
      ['Paid:', summary.paidCount.toString()]
    ];

    summaryItems.forEach(([label, value]) => {
      page.drawText(label, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(value, {
        x: 250,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1)
      });
      yPosition -= 18;
    });

    yPosition -= 20;

    // Recent transactions table
    page.drawText('Recent Transactions', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    // Table headers
    const headers = ['Date', 'Description', 'Type', 'Amount', 'Status'];
    const columnWidths = [70, 150, 60, 80, 60];
    let xPosition = 50;

    headers.forEach((header, index) => {
      page.drawText(header, {
        x: xPosition,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      xPosition += columnWidths[index];
    });
    yPosition -= 15;

    // Table data (show first 15 transactions to fit on page)
    const displayTransactions = transactions.slice(0, 15);
    displayTransactions.forEach(transaction => {
      xPosition = 50;
      const rowData = [
        new Date(transaction.date).toLocaleDateString(),
        transaction.description.length > 20 ? transaction.description.substring(0, 20) + '...' : transaction.description,
        transaction.type,
        transaction.amount.toLocaleString(),
        transaction.status
      ];

      rowData.forEach((data, index) => {
        page.drawText(data, {
          x: xPosition,
          y: yPosition,
          size: 8,
          font: regularFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        xPosition += columnWidths[index];
      });
      yPosition -= 12;
    });

    return yPosition;
  }

  async drawBudgetVariance(page, boldFont, regularFont, reportData, yPosition, width) {
    const { summary, variances, budgetYear } = reportData;
    
    // Summary section
    page.drawText(`Budget Variance Report - ${budgetYear}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    const summaryItems = [
      ['Total Budgeted:', `LKR ${summary.totalBudgeted.toLocaleString()}`],
      ['Total Actual:', `LKR ${summary.totalActual.toLocaleString()}`],
      ['Total Variance:', `LKR ${summary.totalVariance.toLocaleString()}`],
      ['Variance %:', `${((summary.totalVariance / summary.totalBudgeted) * 100).toFixed(2)}%`]
    ];

    summaryItems.forEach(([label, value]) => {
      page.drawText(label, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(value, {
        x: 250,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: summary.totalVariance >= 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0)
      });
      yPosition -= 18;
    });

    return yPosition;
  }

  async drawOutstandingDues(page, boldFont, regularFont, reportData, yPosition, width) {
    const { summary, transactions } = reportData;
    
    // Summary section
    page.drawText('Outstanding Dues Summary', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 25;

    const summaryItems = [
      ['Total Outstanding:', `LKR ${summary.totalOutstanding.toLocaleString()}`],
      ['Pending Amount:', `LKR ${summary.pendingAmount.toLocaleString()}`],
      ['Overdue Amount:', `LKR ${summary.overdueAmount.toLocaleString()}`],
      ['Pending Count:', summary.pendingCount.toString()],
      ['Overdue Count:', summary.overdueCount.toString()]
    ];

    summaryItems.forEach(([label, value]) => {
      page.drawText(label, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      page.drawText(value, {
        x: 250,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: label.includes('Overdue') ? rgb(0.8, 0, 0) : rgb(0.8, 0.6, 0)
      });
      yPosition -= 18;
    });

    return yPosition;
  }

  async drawFooter(page, font, reportData, width) {
    const footerY = 30;
    
    // Footer line
    page.drawLine({
      start: { x: 50, y: footerY + 20 },
      end: { x: width - 50, y: footerY + 20 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });

    // Footer text
    page.drawText('SpanTower27 Condominium Management System', {
      x: 50,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });

    page.drawText(`Page 1 - Generated on ${new Date().toLocaleDateString()}`, {
      x: width - 200,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
}

module.exports = new PDFTemplateService();
