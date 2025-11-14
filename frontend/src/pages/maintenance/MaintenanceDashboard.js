import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import api from "../../services/apiService";

const MaintenanceDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generateDialog, setGenerateDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardMonth, setDashboardMonth] = useState(11); // November 2025 to show recent data
  const [dashboardYear, setDashboardYear] = useState(2025);

  const canManageFees = ["treasurer", "president", "administrator"].includes(user?.role);

  useEffect(() => {
    fetchDashboardStats();
  }, [dashboardMonth, dashboardYear]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/unit-maintenance/dashboard-stats?month=${dashboardMonth}&year=${dashboardYear}`);

      console.log("📊 Dashboard stats for", `${dashboardMonth}/${dashboardYear}:`, response.data);

      if (response.data && response.data.success) {
        setStats(response.data.stats);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyFees = async () => {
    try {
      setGenerating(true);
      const response = await api.post(
        `/unit-maintenance/generate/${selectedMonth}/${selectedYear}`
      );
      
      if (response.data && response.data.success) {
        setSuccess(`Generated maintenance fees for ${response.data.generatedCount} units`);
        setGenerateDialog(false);
        fetchDashboardStats();
      }
    } catch (err) {
      setError("Failed to generate maintenance fees");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amount) => 
    `LKR ${Number(amount).toLocaleString()}`;

  const getCollectionRateColor = (rate) => {
    if (rate >= 80) return "success";
    if (rate >= 60) return "warning";
    return "error";
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Maintenance Fee Dashboard
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={dashboardMonth}
              onChange={(e) => setDashboardMonth(e.target.value)}
              label="Month"
            >
              {months.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={dashboardYear}
              onChange={(e) => setDashboardYear(e.target.value)}
              label="Year"
            >
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2026}>2026</MenuItem>
            </Select>
          </FormControl>
          {canManageFees && (
            <Button
              variant="contained"
              onClick={() => setGenerateDialog(true)}
              startIcon={<PaymentIcon />}
            >
              Generate Monthly Fees
            </Button>
          )}
        </Box>
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

      {stats && (
        <>
          {/* Current Month Overview */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Month Overview - {months[stats.currentMonth.month - 1]} {stats.currentMonth.year}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <HomeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {stats.currentMonth.totalUnits}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Units
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <AccountBalanceIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(stats.currentMonth.totalAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Fees Generated
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {formatCurrency(stats.currentMonth.paidAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Amount Collected
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                      {stats.currentMonth.collectionRate >= 80 ? (
                        <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                      )}
                    </Box>
                    <Typography variant="h4" fontWeight="bold" 
                      color={getCollectionRateColor(stats.currentMonth.collectionRate)}>
                      {stats.currentMonth.collectionRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Collection Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Collection Progress Bar */}
              <Box mt={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Collection Progress</Typography>
                  <Typography variant="body2">
                    {formatCurrency(stats.currentMonth.paidAmount)} / {formatCurrency(stats.currentMonth.totalAmount)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.currentMonth.collectionRate}
                  color={getCollectionRateColor(stats.currentMonth.collectionRate)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Status Breakdown
                  </Typography>
                  <List>
                    {stats.currentMonth.statusBreakdown.map((status, index) => (
                      <React.Fragment key={status._id}>
                        <ListItem>
                          <ListItemIcon>
                            {status._id === 'paid' && <CheckCircleIcon color="success" />}
                            {status._id === 'partially_paid' && <PaymentIcon color="info" />}
                            {status._id === 'overdue' && <WarningIcon color="error" />}
                            {status._id === 'pending' && <ScheduleIcon color="warning" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                  {status._id.replace('_', ' ')}
                                </Typography>
                                <Chip 
                                  label={`${status.count} units`}
                                  size="small"
                                  color={
                                    status._id === 'paid' ? 'success' :
                                    status._id === 'partially_paid' ? 'info' :
                                    status._id === 'overdue' ? 'error' : 'warning'
                                  }
                                />
                              </Box>
                            }
                            secondary={`${formatCurrency(status.totalAmount)} total`}
                          />
                        </ListItem>
                        {index < stats.currentMonth.statusBreakdown.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error">
                    Overdue Fees
                  </Typography>
                  <Box textAlign="center" py={2}>
                    <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {stats.overdue.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Units with overdue payments
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {formatCurrency(stats.overdue.totalAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total overdue amount
                    </Typography>
                  </Box>
                  {canManageFees && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2 }}
                    >
                      View Overdue Fees
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Generate Fees Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Monthly Maintenance Fees</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generate maintenance fees for all units for the selected month and year.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="Month"
                  >
                    {months.map((month, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Year"
                  >
                    {[2024, 2025, 2026].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(false)} disabled={generating}>
            Cancel
          </Button>
          <Button 
            onClick={generateMonthlyFees} 
            variant="contained" 
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {generating ? "Generating..." : "Generate Fees"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaintenanceDashboard;
