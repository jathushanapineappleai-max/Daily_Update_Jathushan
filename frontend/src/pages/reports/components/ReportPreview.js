import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ReportPreview = ({ reportData, reportType, filters }) => {
  if (!reportData) return null;

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      paid: 'primary',
      rejected: 'error',
      overdue: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  // Chart colors
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  const renderIncomeStatement = () => {
    const { summary, income, expenses, comparison } = reportData;

    // Prepare chart data
    const categoryData = [];
    
    // Add income categories
    income.classifications.forEach(classification => {
      classification.categories.forEach(category => {
        categoryData.push({
          name: category.category.replace('_', ' '),
          income: category.amount,
          expenses: 0,
          type: 'Income'
        });
      });
    });

    // Add expense categories
    expenses.classifications.forEach(classification => {
      classification.categories.forEach(category => {
        const existingCategory = categoryData.find(item => item.name === category.category.replace('_', ' '));
        if (existingCategory) {
          existingCategory.expenses = category.amount;
        } else {
          categoryData.push({
            name: category.category.replace('_', ' '),
            income: 0,
            expenses: category.amount,
            type: 'Expense'
          });
        }
      });
    });

    // Pie chart data for income vs expenses
    const pieData = [
      { name: 'Income', value: summary.totalIncome, color: '#82ca9d' },
      { name: 'Expenses', value: summary.totalExpenses, color: '#ff7300' }
    ];

    return (
      <Box>
        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {formatCurrency(summary.totalIncome)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Income
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatCurrency(summary.totalExpenses)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Expenses
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: summary.netIncome >= 0 ? 'success.50' : 'error.50', borderRadius: 1 }}>
                  <Typography variant="h4" color={summary.netIncome >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                    {formatCurrency(summary.netIncome)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Net Income
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Profit Margin: {summary.profitMargin}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Income vs Expenses Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Breakdown Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="income" fill="#82ca9d" name="Income" />
                    <Bar dataKey="expenses" fill="#ff7300" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Breakdown */}
        <Grid container spacing={3}>
          {/* Income Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.main">
                  Income Breakdown
                </Typography>
                {income.classifications.map((classification, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      {classification._id.replace('_', ' ').toUpperCase()}
                      <Chip 
                        label={formatCurrency(classification.totalAmount)} 
                        size="small" 
                        color="success" 
                        sx={{ ml: 2 }} 
                      />
                    </Typography>
                    {classification.categories.map((category, catIndex) => (
                      <Box key={catIndex} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, pl: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category.category.replace('_', ' ')} ({category.count} transactions)
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(category.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Expense Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="warning.main">
                  Expense Breakdown
                </Typography>
                {expenses.classifications.map((classification, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      {classification._id.replace('_', ' ').toUpperCase()}
                      <Chip 
                        label={formatCurrency(classification.totalAmount)} 
                        size="small" 
                        color="warning" 
                        sx={{ ml: 2 }} 
                      />
                    </Typography>
                    {classification.categories.map((category, catIndex) => (
                      <Box key={catIndex} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, pl: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category.category.replace('_', ' ')} ({category.count} transactions)
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(category.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Period Comparison */}
        {comparison && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Period Comparison
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Income Change
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={comparison.changes.incomeChange >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {comparison.changes.incomeChange >= 0 ? '+' : ''}{formatCurrency(comparison.changes.incomeChange)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expense Change
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={comparison.changes.expenseChange >= 0 ? 'error.main' : 'success.main'}
                      fontWeight="bold"
                    >
                      {comparison.changes.expenseChange >= 0 ? '+' : ''}{formatCurrency(comparison.changes.expenseChange)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Net Income Change
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={comparison.changes.netIncomeChange >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {comparison.changes.netIncomeChange >= 0 ? '+' : ''}{formatCurrency(comparison.changes.netIncomeChange)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderCashFlowReport = () => {
    const { summary, dailyFlow } = reportData;

    // Prepare chart data for cash flow trend
    const chartData = dailyFlow.map(day => ({
      date: day._id,
      inflow: day.inflow,
      outflow: day.outflow,
      netFlow: day.netFlow,
      balance: day.runningBalance
    }));

    return (
      <Box>
        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cash Flow Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="h5" color="info.main" fontWeight="bold">
                    {formatCurrency(summary.openingBalance)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Opening Balance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {formatCurrency(summary.totalInflow)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Inflow
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                  <Typography variant="h5" color="error.main" fontWeight="bold">
                    {formatCurrency(summary.totalOutflow)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Outflow
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: summary.netCashFlow >= 0 ? 'success.50' : 'error.50', borderRadius: 1 }}>
                  <Typography variant="h5" color={summary.netCashFlow >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                    {formatCurrency(summary.netCashFlow)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Net Cash Flow
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    {formatCurrency(summary.closingBalance)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Closing Balance
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Cash Flow Chart */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Cash Flow Trend
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="inflow" stroke="#82ca9d" name="Inflow" strokeWidth={2} />
                <Line type="monotone" dataKey="outflow" stroke="#ff7300" name="Outflow" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Running Balance" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Flow Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Cash Flow Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell align="right"><strong>Inflow</strong></TableCell>
                    <TableCell align="right"><strong>Outflow</strong></TableCell>
                    <TableCell align="right"><strong>Net Flow</strong></TableCell>
                    <TableCell align="right"><strong>Running Balance</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyFlow.slice(-10).map((day, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(day._id)}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                        {formatCurrency(day.inflow)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'medium' }}>
                        {formatCurrency(day.outflow)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: day.netFlow >= 0 ? 'success.main' : 'error.main', fontWeight: 'medium' }}>
                        {formatCurrency(day.netFlow)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(day.runningBalance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderTransactionSummary = () => {
    const { summary, transactions } = reportData;

    return (
      <Box>
        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {summary.totalTransactions}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Transactions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {formatCurrency(summary.totalIncome)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Income
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatCurrency(summary.totalExpenses)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Expenses
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {formatCurrency(summary.totalAmount)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Amount
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Status Breakdown */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Status Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Chip
                    label={`Pending: ${summary.pendingCount}`}
                    color="warning"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    label={`Approved: ${summary.approvedCount}`}
                    color="success"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    label={`Paid: ${summary.paidCount}`}
                    color="primary"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.slice(0, 20).map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        {transaction.description.length > 30
                          ? `${transaction.description.substring(0, 30)}...`
                          : transaction.description
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          size="small"
                          color={transaction.type === 'income' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{transaction.category.replace('_', ' ')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={getStatusColor(transaction.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {transactions.length > 20 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Showing first 20 transactions. Export to CSV for complete data.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderBudgetVariance = () => {
    const { summary, variances, budgetYear } = reportData;

    return (
      <Box>
        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Budget Variance Summary - {budgetYear}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {formatCurrency(summary.totalBudgeted)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Budgeted
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatCurrency(summary.totalActual)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Actual
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: summary.totalVariance >= 0 ? 'success.50' : 'error.50', borderRadius: 1 }}>
                  <Typography variant="h4" color={summary.totalVariance >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                    {formatCurrency(summary.totalVariance)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Variance
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((summary.totalVariance / summary.totalBudgeted) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Variance Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Budget Variance Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Budgeted</strong></TableCell>
                    <TableCell align="right"><strong>Actual</strong></TableCell>
                    <TableCell align="right"><strong>Variance</strong></TableCell>
                    <TableCell align="right"><strong>Variance %</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variances.map((variance, index) => (
                    <TableRow key={index}>
                      <TableCell>{variance._id.category?.replace('_', ' ') || 'N/A'}</TableCell>
                      <TableCell align="right">{formatCurrency(variance.budgetedAmount || 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(variance.actualAmount)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: variance.variance >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {formatCurrency(variance.variance)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: variance.variance >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {variance.variancePercent}%
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={variance.status === 'under_budget' ? 'Under Budget' : 'Over Budget'}
                          size="small"
                          color={variance.status === 'under_budget' ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderOutstandingDues = () => {
    const { summary, transactions } = reportData;

    return (
      <Box>
        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Outstanding Dues Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {formatCurrency(summary.totalOutstanding)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Outstanding
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatCurrency(summary.pendingAmount)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Pending Amount
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {formatCurrency(summary.overdueAmount)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Overdue Amount
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {summary.pendingCount + summary.overdueCount}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Count
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Status Breakdown */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Status Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Chip
                    label={`Pending: ${summary.pendingCount} (${formatCurrency(summary.pendingAmount)})`}
                    color="warning"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={`Overdue: ${summary.overdueCount} (${formatCurrency(summary.overdueAmount)})`}
                    color="error"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Outstanding Transactions Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Outstanding Transactions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Resident</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        {transaction.description.length > 30
                          ? `${transaction.description.substring(0, 30)}...`
                          : transaction.description
                        }
                      </TableCell>
                      <TableCell>{transaction.category.replace('_', ' ')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {transaction.dueDate ? formatDate(transaction.dueDate) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={getStatusColor(transaction.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.resident ?
                          `${transaction.resident.firstName} ${transaction.resident.lastName} (${transaction.resident.unitNumber})` :
                          'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  // Main render function
  const renderReport = () => {
    switch (reportType) {
      case 'income_statement':
        return renderIncomeStatement();
      case 'cash_flow':
        return renderCashFlowReport();
      case 'transaction_summary':
        return renderTransactionSummary();
      case 'budget_variance':
        return renderBudgetVariance();
      case 'outstanding_dues':
        return renderOutstandingDues();
      default:
        return (
          <Alert severity="warning">
            Report type "{reportType}" is not supported yet.
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ '& .recharts-wrapper': { fontSize: '12px' } }}>
      {/* Report Header */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {reportData.reportType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generated on {formatDate(reportData.generatedAt)} |
          Period: {reportData.period ? `${formatDate(reportData.period.startDate)} - ${formatDate(reportData.period.endDate)}` : 'N/A'}
        </Typography>
        {filters.category && (
          <Chip label={`Category: ${filters.category}`} size="small" sx={{ mr: 1, mt: 1 }} />
        )}
        {filters.classification && (
          <Chip label={`Type: ${filters.classification}`} size="small" sx={{ mr: 1, mt: 1 }} />
        )}
        {filters.status && (
          <Chip label={`Status: ${filters.status}`} size="small" sx={{ mr: 1, mt: 1 }} />
        )}
      </Box>

      {/* Report Content */}
      {renderReport()}
    </Box>
  );
};

export default ReportPreview;
