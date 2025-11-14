import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  Stop as StopIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/apiService';

const RecurringTransactions = ({ onEdit }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stopDialog, setStopDialog] = useState({ open: false, transaction: null });

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching recurring transactions...");
      const response = await api.get('/finances/recurring');

      console.log("📊 Recurring transactions response:", response.data);

      if (response.data.success) {
        console.log("✅ Found recurring transactions:", response.data.recurringTransactions.length);
        setRecurringTransactions(response.data.recurringTransactions);
      } else {
        console.log("⚠️ API returned unsuccessful response");
        setError('Failed to fetch recurring transactions');
      }
    } catch (error) {
      console.error('❌ Fetch recurring transactions error:', error);
      console.log("🔍 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });

      if (error.response?.status === 404) {
        console.log("📋 Using demo data due to 404");
        // API not implemented yet, show demo data
        setRecurringTransactions(getDemoRecurringTransactions());
      } else {
        setError('Failed to fetch recurring transactions');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDemoRecurringTransactions = () => [
    {
      _id: '1',
      description: 'Monthly Maintenance Fee Collection - All Units',
      amount: 1320000, // 88 units × 15,000
      type: 'income',
      transactionClassification: 'recurring_income',
      category: 'dues',
      recurringTransaction: {
        frequency: 'monthly',
        nextDueDate: new Date(2025, 0, 1), // January 1, 2025
        autoGenerate: true,
        generatedCount: 12,
        maxGenerations: null,
        isActive: true
      },
      createdBy: { firstName: 'System', lastName: 'Admin' }
    },
    {
      _id: '2',
      description: 'Security Service Monthly Payment',
      amount: 180000,
      type: 'expense',
      transactionClassification: 'recurring_expense',
      category: 'security',
      recurringTransaction: {
        frequency: 'monthly',
        nextDueDate: new Date(2025, 0, 5), // January 5, 2025
        autoGenerate: true,
        generatedCount: 8,
        maxGenerations: null,
        isActive: true
      },
      createdBy: { firstName: 'Treasurer', lastName: 'User' }
    },
    {
      _id: '3',
      description: 'Cleaning Service Contract',
      amount: 120000,
      type: 'expense',
      transactionClassification: 'recurring_expense',
      category: 'cleaning',
      recurringTransaction: {
        frequency: 'monthly',
        nextDueDate: new Date(2025, 0, 10), // January 10, 2025
        autoGenerate: true,
        generatedCount: 6,
        maxGenerations: 24,
        isActive: true
      },
      createdBy: { firstName: 'Treasurer', lastName: 'User' }
    }
  ];

  const handleStopRecurring = async (transaction) => {
    try {
      const response = await api.put(`/finances/recurring/${transaction._id}/stop`);
      
      if (response.data.success) {
        setRecurringTransactions(prev => 
          prev.map(t => 
            t._id === transaction._id 
              ? { ...t, recurringTransaction: { ...t.recurringTransaction, isActive: false } }
              : t
          )
        );
        setStopDialog({ open: false, transaction: null });
      } else {
        setError('Failed to stop recurring transaction');
      }
    } catch (error) {
      console.error('Stop recurring transaction error:', error);
      setError('Failed to stop recurring transaction');
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      semi_annual: 'Semi-Annual',
      annual: 'Annual'
    };
    return labels[frequency] || frequency;
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'recurring_income':
        return 'success';
      case 'recurring_expense':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="Recurring Transactions" />
        <CardContent>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading recurring transactions...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader 
          title="Recurring Transactions"
          action={
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchRecurringTransactions}
              size="small"
            >
              Refresh
            </Button>
          }
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {recurringTransactions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Recurring Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create recurring transactions to automate regular income and expenses.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Next Due</TableCell>
                    <TableCell>Generated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recurringTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {transaction.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created by {transaction.createdBy?.firstName} {transaction.createdBy?.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {transaction.type === 'income' ? (
                            <IncomeIcon color="success" fontSize="small" />
                          ) : (
                            <ExpenseIcon color="error" fontSize="small" />
                          )}
                          <Chip
                            label={transaction.transactionClassification.replace('_', ' ').toUpperCase()}
                            color={getClassificationColor(transaction.transactionClassification)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getFrequencyLabel(transaction.recurringTransaction.frequency)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(transaction.recurringTransaction.nextDueDate), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.recurringTransaction.generatedCount}
                          {transaction.recurringTransaction.maxGenerations && 
                            ` / ${transaction.recurringTransaction.maxGenerations}`
                          }
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={transaction.recurringTransaction.isActive ? 'Active' : 'Stopped'}
                          color={transaction.recurringTransaction.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => onEdit && onEdit(transaction)}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          
                          {transaction.recurringTransaction.isActive && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setStopDialog({ open: true, transaction })}
                              title="Stop Recurring"
                            >
                              <StopIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Stop Confirmation Dialog */}
      <Dialog
        open={stopDialog.open}
        onClose={() => setStopDialog({ open: false, transaction: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Stop Recurring Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to stop the recurring transaction "{stopDialog.transaction?.description}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will prevent future automatic generation of this transaction. 
            You can still create similar transactions manually.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialog({ open: false, transaction: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleStopRecurring(stopDialog.transaction)}
            color="error"
            variant="contained"
          >
            Stop Recurring
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecurringTransactions;
