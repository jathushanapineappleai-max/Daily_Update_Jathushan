import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  Box
} from '@mui/material';
// Removed date picker imports due to compatibility issues

const TransactionForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  editingTransaction = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    transactionClassification: 'adhoc_expense',
    category: 'maintenance',
    subcategory: '',
    date: new Date(),
    dueDate: null,
    vendor: '',
    unitNumber: '',
    paymentMethod: 'bank_transfer',
    reference: '',
    notes: '',
    // Recurring fields
    isRecurring: false,
    frequency: 'monthly',
    nextDueDate: null,
    endDate: null,
    autoGenerate: false,
    maxGenerations: ''
  });

  const [errors, setErrors] = useState({});

  // Classification options
  const classificationOptions = [
    { value: 'recurring_income', label: 'Recurring Income', type: 'income' },
    { value: 'adhoc_income', label: 'Ad-hoc Income', type: 'income' },
    { value: 'recurring_expense', label: 'Recurring Expense', type: 'expense' },
    { value: 'adhoc_expense', label: 'Ad-hoc Expense', type: 'expense' }
  ];

  // Category options based on type
  const incomeCategories = [
    'dues', 'parking', 'facility_rental', 'penalties', 'interest', 'other'
  ];

  const expenseCategories = [
    'maintenance', 'utilities', 'security', 'cleaning', 'insurance', 
    'vendor_payment', 'emergency', 'landscaping', 'repairs', 'other'
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi_annual', label: 'Semi-Annual' },
    { value: 'annual', label: 'Annual' }
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'expense',
        transactionClassification: editingTransaction.transactionClassification || 'adhoc_expense',
        category: editingTransaction.category || 'maintenance',
        subcategory: editingTransaction.subcategory || '',
        date: editingTransaction.date ? new Date(editingTransaction.date) : new Date(),
        dueDate: editingTransaction.dueDate ? new Date(editingTransaction.dueDate) : null,
        vendor: editingTransaction.vendor?._id || '',
        unitNumber: editingTransaction.unitNumber || '',
        paymentMethod: editingTransaction.paymentMethod || 'bank_transfer',
        reference: editingTransaction.referenceNumber || '',
        notes: editingTransaction.notes || '',
        // Recurring fields
        isRecurring: editingTransaction.recurringTransaction?.isRecurring || false,
        frequency: editingTransaction.recurringTransaction?.frequency || 'monthly',
        nextDueDate: editingTransaction.recurringTransaction?.nextDueDate ? 
          new Date(editingTransaction.recurringTransaction.nextDueDate) : null,
        endDate: editingTransaction.recurringTransaction?.endDate ? 
          new Date(editingTransaction.recurringTransaction.endDate) : null,
        autoGenerate: editingTransaction.recurringTransaction?.autoGenerate || false,
        maxGenerations: editingTransaction.recurringTransaction?.maxGenerations || ''
      });
    } else {
      // Reset form for new transaction
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        transactionClassification: 'adhoc_expense',
        category: 'maintenance',
        subcategory: '',
        date: new Date(),
        dueDate: null,
        vendor: '',
        unitNumber: '',
        paymentMethod: 'bank_transfer',
        reference: '',
        notes: '',
        isRecurring: false,
        frequency: 'monthly',
        nextDueDate: null,
        endDate: null,
        autoGenerate: false,
        maxGenerations: ''
      });
    }
    setErrors({});
  }, [editingTransaction, open]);

  // Handle classification change
  const handleClassificationChange = (classification) => {
    const classificationData = classificationOptions.find(opt => opt.value === classification);
    const newType = classificationData?.type || 'expense';
    
    setFormData(prev => ({
      ...prev,
      transactionClassification: classification,
      type: newType,
      category: newType === 'income' ? 'dues' : 'maintenance',
      isRecurring: classification.includes('recurring')
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (formData.isRecurring) {
      if (!formData.frequency) {
        newErrors.frequency = 'Frequency is required for recurring transactions';
      }
      
      if (formData.maxGenerations && parseInt(formData.maxGenerations) <= 0) {
        newErrors.maxGenerations = 'Max generations must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      maxGenerations: formData.maxGenerations ? parseInt(formData.maxGenerations) : null,
      recurringTransaction: formData.isRecurring ? {
        isRecurring: true,
        frequency: formData.frequency,
        nextDueDate: formData.nextDueDate,
        endDate: formData.endDate,
        autoGenerate: formData.autoGenerate,
        maxGenerations: formData.maxGenerations ? parseInt(formData.maxGenerations) : null
      } : undefined
    };

    onSubmit(submitData);
  };

  const isRecurringClassification = formData.transactionClassification.includes('recurring');
  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Transaction Classification */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.transactionClassification}>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formData.transactionClassification}
                    onChange={(e) => handleClassificationChange(e.target.value)}
                    label="Transaction Type"
                  >
                    {classificationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                  >
                    {currentCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>

              {/* Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transaction Date"
                  type="date"
                  value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              {/* Recurring Transaction Options */}
              {isRecurringClassification && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Recurring Transaction Settings
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.frequency}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                        label="Frequency"
                      >
                        {frequencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Generations (Optional)"
                      type="number"
                      value={formData.maxGenerations}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxGenerations: e.target.value }))}
                      error={!!errors.maxGenerations}
                      helperText={errors.maxGenerations || "Leave empty for unlimited"}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date (Optional)"
                      type="date"
                      value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value) : null }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.autoGenerate}
                          onChange={(e) => setFormData(prev => ({ ...prev, autoGenerate: e.target.checked }))}
                        />
                      }
                      label="Auto-generate future transactions"
                    />
                  </Grid>
                </>
              )}

              {/* Additional Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Number (Optional)"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subcategory (Optional)"
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>
            </Grid>

            {isRecurringClassification && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Recurring Transaction:</strong> This will create a template for automatic generation 
                  of future transactions based on the specified frequency.
                </Typography>
              </Alert>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingTransaction ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  );
};

export default TransactionForm;
