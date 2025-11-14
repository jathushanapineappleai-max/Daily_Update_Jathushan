import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Receipt,
  Warning,
  CheckCircle,
  Schedule,
  ArrowForward,
  MonetizationOn,
  Assessment,
  Business
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/apiService';

const TreasurerDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [financialStats, setFinancialStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    outstandingDues: 0,
    budgetUtilization: 0,
    pendingApprovals: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bulk approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [approvalComments, setApprovalComments] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch financial stats, recent transactions, and pending approvals in parallel
      const [statsResponse, transactionsResponse, pendingResponse] = await Promise.all([
        api.get('/finances/stats'),
        api.get('/finances?limit=5'),
        api.get('/finances/pending?limit=10').catch(err => {
          console.warn('Failed to fetch pending transactions:', err.response?.status);
          return { data: { success: false, transactions: [] } };
        })
      ]);

      if (statsResponse.data.success) {
        const stats = statsResponse.data.stats;
        console.log('📊 Dashboard stats received:', stats);

        setFinancialStats({
          totalBalance: stats.totalBalance || 0,
          monthlyIncome: stats.monthlyIncome || 0,
          monthlyExpenses: stats.monthlyExpenses || 0,
          outstandingDues: stats.outstandingDues || 0,
          budgetUtilization: stats.budgetUtilization || 0,
          pendingApprovals: pendingResponse.data.success ? pendingResponse.data.transactions.length : 0
        });
      }

      if (transactionsResponse.data.success) {
        setRecentTransactions(transactionsResponse.data.transactions.slice(0, 3));
      }

      if (pendingResponse.data.success) {
        setPendingApprovals(pendingResponse.data.transactions);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Bulk approval functions
  const handleOpenApprovalDialog = () => {
    setApprovalDialogOpen(true);
    setSelectedTransactions([]);
    setApprovalComments('');
    setApprovalSuccess('');
  };

  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    setSelectedTransactions([]);
    setApprovalComments('');
    setApprovalSuccess('');
  };

  const handleTransactionSelect = (transactionId, checked) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, transactionId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(pendingApprovals.map(t => t._id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleBulkApproval = async () => {
    if (selectedTransactions.length === 0) {
      return;
    }

    try {
      setApprovalLoading(true);

      const response = await api.post('/finances/bulk-approve', {
        transactionIds: selectedTransactions,
        comments: approvalComments || 'Bulk approval from dashboard'
      });

      if (response.data.success) {
        setApprovalSuccess(`Successfully approved ${response.data.results.approved.length} transactions`);

        // Refresh data
        await fetchDashboardData();

        // Close dialog after 2 seconds
        setTimeout(() => {
          handleCloseApprovalDialog();
        }, 2000);
      }

    } catch (error) {
      console.error('Bulk approval error:', error);
      setError(error.response?.data?.message || 'Failed to approve transactions');
    } finally {
      setApprovalLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      approved: 'info',
      rejected: 'error',
      paid: 'success'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colors[priority] || 'default';
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  return (
    <Grid container spacing={3}>
      {/* Financial Overview */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Total Balance</Typography>
            </Box>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {formatCurrency(financialStats.totalBalance)}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/finances')}
              endIcon={<ArrowForward />}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">Monthly Income</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {formatCurrency(financialStats.monthlyIncome)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +12% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h6">Monthly Expenses</Typography>
            </Box>
            <Typography variant="h4" color="error.main" gutterBottom>
              {formatCurrency(financialStats.monthlyExpenses)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              -5% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Outstanding Dues</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {formatCurrency(financialStats.outstandingDues)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From 12 units
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Budget Utilization */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Budget Utilization
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Budget Used</Typography>
                <Typography variant="body2">{financialStats.budgetUtilization}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={financialStats.budgetUtilization}
                color={financialStats.budgetUtilization > 90 ? 'error' : 'primary'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              LKR {(financialStats.monthlyExpenses / 1000).toFixed(0)}K of LKR {((financialStats.monthlyExpenses / financialStats.budgetUtilization) * 100 / 1000).toFixed(0)}K budget used
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/finances')}
              sx={{ mt: 2 }}
            >
              View Budget Report
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Approvals */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Approvals ({financialStats.pendingApprovals})
            </Typography>
            <List>
              {pendingApprovals.slice(0, 3).map((approval, index) => (
                <React.Fragment key={approval._id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Schedule color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {approval.description}
                          </Typography>
                          <Chip
                            size="small"
                            label={approval.type}
                            color={approval.type === 'income' ? 'success' : 'error'}
                          />
                        </Box>
                      }
                      secondary={`${formatCurrency(approval.amount)} • ${new Date(approval.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < Math.min(pendingApprovals.length, 3) - 1 && <Divider />}
                </React.Fragment>
              ))}
              {pendingApprovals.length === 0 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="No pending approvals"
                    secondary="All transactions are up to date"
                  />
                </ListItem>
              )}
            </List>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              sx={{ mt: 2 }}
              onClick={handleOpenApprovalDialog}
              disabled={pendingApprovals.length === 0}
            >
              Review All Approvals ({pendingApprovals.length})
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {recentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction._id || transaction.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getTransactionIcon(transaction.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {transaction.description}
                          </Typography>
                          <Typography
                            variant="body1"
                            color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold', mr: 1 }}
                          >
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </Typography>
                          <Chip
                            size="small"
                            label={transaction.status}
                            color={getStatusColor(transaction.status)}
                          />
                        </Box>
                      }
                      secondary={new Date(transaction.date).toLocaleDateString()}
                    />
                  </ListItem>
                  {index < recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/finances')}
              sx={{ mt: 2 }}
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Treasurer Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treasurer Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Receipt />}
                  onClick={() => navigate('/finances')}
                >
                  Record Transaction
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                >
                  Generate Report
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Business />}
                  onClick={() => navigate('/vendors')}
                >
                  Manage Vendors
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MonetizationOn />}
                >
                  Budget Planning
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Bulk Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={handleCloseApprovalDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Bulk Approve Transactions
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {approvalSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {approvalSuccess}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTransactions.length === pendingApprovals.length && pendingApprovals.length > 0}
                  indeterminate={selectedTransactions.length > 0 && selectedTransactions.length < pendingApprovals.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              }
              label="Select All"
            />
          </Box>

          <List>
            {pendingApprovals.map((transaction) => (
              <ListItem key={transaction._id} sx={{ px: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTransactions.includes(transaction._id)}
                      onChange={(e) => handleTransactionSelect(transaction._id, e.target.checked)}
                    />
                  }
                  label=""
                  sx={{ mr: 1 }}
                />
                <ListItemIcon>
                  {getTransactionIcon(transaction.type)}
                </ListItemIcon>
                <ListItemText
                  primary={transaction.description}
                  secondary={`${formatCurrency(transaction.amount)} • ${new Date(transaction.date).toLocaleDateString()}`}
                />
                <Chip
                  size="small"
                  label={transaction.status}
                  color={getStatusColor(transaction.status)}
                />
              </ListItem>
            ))}
          </List>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Comments (Optional)"
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Add any comments for this bulk approval..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBulkApproval}
            disabled={selectedTransactions.length === 0 || approvalLoading}
            startIcon={approvalLoading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            Approve {selectedTransactions.length} Transaction{selectedTransactions.length !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TreasurerDashboard;
