import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import api from "../../services/apiService";

const MaintenanceFeePage = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [summary, setSummary] = useState(null);
  
  // Payment dialog
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    referenceNumber: "",
    notes: ""
  });

  const canManageFees = ["treasurer", "president", "administrator"].includes(user?.role);

  useEffect(() => {
    fetchFees();
  }, [page, filterStatus, filterMonth, filterYear]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterMonth) params.append("month", filterMonth);
      if (filterYear) params.append("year", filterYear);

      const response = await api.get(`/unit-maintenance/fees?${params}`);

      console.log("🔍 Maintenance Fees API Response:", response.data);
      console.log("📊 Fees received:", response.data?.fees?.length);
      console.log("💰 Summary:", response.data?.summary);

      if (response.data && response.data.success) {
        setFees(response.data.fees);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setSummary(response.data.summary || {});
        setError("");

        // Debug: Log fees with payments
        const feesWithPayments = response.data.fees.filter(fee => fee.paymentDetails?.paidAmount > 0);
        console.log("💳 Fees with payments:", feesWithPayments.length);
        feesWithPayments.forEach(fee => {
          console.log(`   Unit ${fee.unit?.unitNumber}: LKR ${fee.paymentDetails.paidAmount} / LKR ${fee.totalAmount} - Status: ${fee.status}`);
        });

        // Debug: Log summary data
        console.log("📊 Summary data:", response.data.summary);
        console.log("💰 Total Amount:", response.data.summary?.totalAmount);
        console.log("💳 Total Paid:", response.data.summary?.totalPaid);
      }
    } catch (err) {
      setError("Failed to fetch maintenance fees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "overdue": return "error";
      case "partially_paid": return "info";
      case "paid": return "success";
      case "waived": return "default";
      default: return "default";
    }
  };

  const formatCurrency = (amount) => 
    `LKR ${Number(amount).toLocaleString()}`;

  const handlePayment = (fee) => {
    setSelectedFee(fee);
    setPaymentData({
      amount: fee.paymentDetails?.remainingAmount || fee.totalAmount,
      paymentMethod: "bank_transfer",
      referenceNumber: "",
      notes: ""
    });
    setPaymentDialog(true);
  };

  const submitPayment = async () => {
    try {
      console.log("💳 Submitting payment:", paymentData);
      console.log("🎯 For fee:", selectedFee._id);

      // Ensure amount is a number
      const paymentPayload = {
        ...paymentData,
        amount: parseFloat(paymentData.amount)
      };

      console.log("📤 Payment payload:", paymentPayload);

      const response = await api.post(
        `/unit-maintenance/fees/${selectedFee._id}/payment`,
        paymentPayload
      );

      console.log("✅ Payment response:", response.data);

      if (response.data && response.data.success) {
        setSuccess("Payment recorded successfully");
        setPaymentDialog(false);
        setSelectedFee(null);
        console.log("🔄 Refreshing fees list...");
        fetchFees();
      }
    } catch (err) {
      setError("Failed to record payment");
      console.error("❌ Payment error:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Unit Maintenance Fees
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchFees} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {canManageFees && (
            <Tooltip title="Generate Monthly Fees">
              <Fab color="primary" size="medium">
                <AddIcon />
              </Fab>
            </Tooltip>
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

      {/* Summary Card */}
      {summary && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Summary Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Fees
                </Typography>
                <Typography variant="h6">
                  {summary?.totalFees || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(summary?.totalAmount || 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Paid Amount
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(summary?.totalPaid || 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Outstanding
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(summary?.totalOutstanding || 0)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                  label="Filter by Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="partially_paid">Partially Paid</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="waived">Waived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={filterMonth}
                  onChange={(e) => {
                    setFilterMonth(e.target.value);
                    setPage(1);
                  }}
                  label="Month"
                >
                  <MenuItem value="">All Months</MenuItem>
                  <MenuItem value="1">January</MenuItem>
                  <MenuItem value="2">February</MenuItem>
                  <MenuItem value="3">March</MenuItem>
                  <MenuItem value="4">April</MenuItem>
                  <MenuItem value="5">May</MenuItem>
                  <MenuItem value="6">June</MenuItem>
                  <MenuItem value="7">July</MenuItem>
                  <MenuItem value="8">August</MenuItem>
                  <MenuItem value="9">September</MenuItem>
                  <MenuItem value="10">October</MenuItem>
                  <MenuItem value="11">November</MenuItem>
                  <MenuItem value="12">December</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(e.target.value);
                    setPage(1);
                  }}
                  label="Year"
                >
                  <MenuItem value="">All Years</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterStatus("all");
                  setFilterMonth("");
                  setFilterYear("");
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setFilterMonth("11");
                  setFilterYear("2025");
                  setPage(1);
                }}
              >
                Show November 2025
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Fees Table */}
      {loading ? (
        <Typography>Loading maintenance fees...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unit</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {fee.unit?.unitNumber || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fee.unit?.surfaceArea} sq ft
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {fee.billingPeriodDisplay}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(fee.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main">
                      {formatCurrency(fee.paymentDetails?.paidAmount || 0)}
                    </Typography>
                    {fee.paymentDetails?.remainingAmount > 0 && (
                      <Typography variant="caption" color="error.main">
                        Remaining: {formatCurrency(fee.paymentDetails.remainingAmount)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fee.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(fee.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell align="center">
                    {canManageFees && fee.status !== 'paid' && (
                      <Tooltip title="Record Payment">
                        <IconButton
                          onClick={() => handlePayment(fee)}
                          color="primary"
                          size="small"
                        >
                          <PaymentIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Receipt">
                      <IconButton color="default" size="small">
                        <ReceiptIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          {selectedFee && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Unit: {selectedFee.unit?.unitNumber} | 
                Period: {selectedFee.billingPeriodDisplay} |
                Total: {formatCurrency(selectedFee.totalAmount)}
              </Typography>
              
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  label="Payment Method"
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="online">Online Payment</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Reference Number"
                value={paymentData.referenceNumber}
                onChange={(e) => setPaymentData({...paymentData, referenceNumber: e.target.value})}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={paymentData.notes}
                onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={submitPayment} variant="contained">
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaintenanceFeePage;
