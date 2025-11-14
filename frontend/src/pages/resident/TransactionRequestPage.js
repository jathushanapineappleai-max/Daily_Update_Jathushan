import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Receipt,
  Send,
  History,
  CheckCircle,
  Schedule,
  Cancel,
  Error
} from '@mui/icons-material';
import api from '../../services/apiService';

const TransactionRequestPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    unitNumber: '',
    notes: '',
    requestReason: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Category options
  const categoryOptions = {
    income: [
      { value: 'maintenance_fee', label: 'Maintenance Fee' },
      { value: 'parking_fee', label: 'Parking Fee' },
      { value: 'facility_rental', label: 'Facility Rental' },
      { value: 'penalty', label: 'Penalty/Fine' },
      { value: 'other_income', label: 'Other Income' }
    ],
    expense: [
      { value: 'utilities', label: 'Utilities' },
      { value: 'maintenance', label: 'Maintenance & Repairs' },
      { value: 'security', label: 'Security' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'emergency', label: 'Emergency Repairs' },
      { value: 'equipment', label: 'Equipment' },
      { value: 'other_expense', label: 'Other Expense' }
    ]
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await api.get('/finances/my-requests?limit=10');
      if (response.data.success) {
        setMyRequests(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear category when type changes
    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category || !formData.requestReason) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await api.post('/finances/request', formData);
      
      if (response.data.success) {
        setSuccess('Transaction request submitted successfully! It will be reviewed by the treasurer.');
        
        // Reset form
        setFormData({
          description: '',
          amount: '',
          type: 'expense',
          category: '',
          subcategory: '',
          date: new Date().toISOString().split('T')[0],
          unitNumber: '',
          notes: '',
          requestReason: ''
        });

        // Refresh requests list
        fetchMyRequests();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit transaction request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Schedule color="warning" />;
      case 'approved': return <CheckCircle color="success" />;
      case 'rejected': return <Cancel color="error" />;
      case 'paid': return <CheckCircle color="success" />;
      default: return <Error color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'rejected': return 'error';
      case 'paid': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Request Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Receipt sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">
                Submit Transaction Request
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description *"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="e.g., Plumbing repair for Unit 301"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount (LKR) *"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      label="Transaction Type"
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      label="Category"
                      disabled={!formData.type}
                    >
                      {categoryOptions[formData.type]?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Request *"
                    value={formData.requestReason}
                    onChange={(e) => handleInputChange('requestReason', e.target.value)}
                    placeholder="Please explain why this transaction is needed"
                    multiline
                    rows={2}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information..."
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* My Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <History sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">
                My Requests
              </Typography>
            </Box>

            {requestsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : myRequests.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
                No transaction requests yet
              </Typography>
            ) : (
              <List>
                {myRequests.map((request, index) => (
                  <React.Fragment key={request._id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getStatusIcon(request.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ flex: 1 }}>
                              {request.description}
                            </Typography>
                            <Chip
                              size="small"
                              label={request.status}
                              color={getStatusColor(request.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(request.amount)} • {new Date(request.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.type} - {request.category}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < myRequests.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionRequestPage;
