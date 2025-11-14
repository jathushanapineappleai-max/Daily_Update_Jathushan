import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Pagination,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Assessment as ReportIcon,
  MonetizationOn as MoneyIcon,
  Business as VendorIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import api from "../../services/apiService";
import TransactionForm from "../../components/finances/TransactionForm";
import RecurringTransactions from "../../components/finances/RecurringTransactions";

const FinancesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); // Store all transactions for client-side filtering
  const [financialStats, setFinancialStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    outstandingDues: 0,
    budgetUtilization: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");

  // Tab state for 4-type classification
  const [activeTab, setActiveTab] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "expense",
    transactionClassification: "adhoc_expense",
    category: "maintenance",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    unitNumber: "",
    paymentMethod: "bank_transfer",
    reference: "",
    notes: "",
    // Recurring fields
    isRecurring: false,
    frequency: "monthly",
    autoGenerate: false,
    maxGenerations: "",
  });

  const canManageFinances = [
    "treasurer",
    "president",
    "administrator",
  ].includes(user?.role);
  const canApproveTransactions = ["president", "administrator"].includes(
    user?.role
  );

  // Tab options for 4-type classification
  const transactionTabs = [
    { value: 'all', label: 'All Transactions', icon: '📊' },
    { value: 'recurring_income', label: 'Recurring Income', icon: '💰' },
    { value: 'adhoc_income', label: 'Ad-hoc Income', icon: '💵' },
    { value: 'recurring_expense', label: 'Recurring Expenses', icon: '🔄' },
    { value: 'adhoc_expense', label: 'Ad-hoc Expenses', icon: '💸' }
  ];

  useEffect(() => {
    console.log("🔐 Current user:", user);
    console.log("🎫 Auth token:", localStorage.getItem('token') ? 'Present' : 'Missing');
    console.log("🏠 User role:", user?.role);
    console.log("✅ Can manage finances:", canManageFinances);

    fetchTransactions();
    fetchFinancialStats();
  }, []); // Remove dependencies to avoid infinite loop

  // Separate effect for filtering
  useEffect(() => {
    applyFilters();
  }, [filterType, classificationFilter, activeTab, allTransactions, page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching transactions from API...");
      const response = await api.get("/finances?limit=100"); // Fetch more records for better filtering

      console.log("📊 API Response:", response.data);

      // Handle response safely
      if (response.data && response.data.transactions) {
        console.log("✅ Found transactions:", response.data.transactions.length);

        // Debug: Check for maintenance fee transactions
        const maintenanceFeeTransactions = response.data.transactions.filter(t => t.category === 'maintenance_fee');
        console.log("🏠 Maintenance fee transactions:", maintenanceFeeTransactions.length);
        maintenanceFeeTransactions.forEach(t => {
          console.log(`   • ${t.description} - LKR ${t.amount} - Status: ${t.status}`);
          console.log(`     isPartialPayment: ${t.unitMaintenanceDetails?.isPartialPayment}`);
          console.log(`     feeStatus: ${t.unitMaintenanceDetails?.feeStatus}`);
        });

        setAllTransactions(response.data.transactions);
      } else {
        console.log("⚠️ No transactions in response, using empty array");
        // Fallback to empty data if API structure is different
        setAllTransactions([]);
      }
      setError("");
    } catch (error) {
      console.error("❌ Fetch transactions error:", error);
      console.log("🔍 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });

      // If API doesn't exist yet, show demo data
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log("📋 Using demo data due to API error");
        setAllTransactions(getDemoTransactions());
        setError("");
      } else {
        setError("Failed to fetch transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTransactions];

    // Apply classification filter (tab-based)
    if (activeTab !== 'all') {
      filtered = filtered.filter((transaction) =>
        transaction.transactionClassification === activeTab
      );
    }

    // Apply legacy type filter (for backward compatibility)
    if (filterType !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === filterType
      );
    }

    // Calculate pagination
    const itemsPerPage = 10;
    const totalItems = filtered.length;
    const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(calculatedTotalPages);

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filtered.slice(startIndex, endIndex);

    setTransactions(paginatedTransactions);

    // Reset page if current page exceeds total pages
    if (page > calculatedTotalPages && calculatedTotalPages > 0) {
      setPage(1);
    }
  };

  const fetchFinancialStats = async () => {
    try {
      const response = await api.get("/finances/stats");
      console.log("📊 Financial stats response:", response.data);
      if (response.data && response.data.stats) {
        setFinancialStats(response.data.stats);
        console.log("✅ Financial stats updated:", response.data.stats);
      }
    } catch (error) {
      // If API doesn't exist yet, use demo data
      if (error.response?.status === 401 || error.response?.status === 404) {
        setFinancialStats(getDemoFinancialStats());
      } else {
        console.error("Fetch financial stats error:", error);
      }
    }
  };

  // Demo data for when API is not available
  const getDemoFinancialStats = () => ({
    totalBalance: 2500000,
    monthlyIncome: 450000,
    monthlyExpenses: 380000,
    outstandingDues: 125000,
    budgetUtilization: 76,
  });

  const getDemoTransactions = () => [
    {
      _id: "1",
      type: "income",
      transactionClassification: "recurring_income",
      category: "dues",
      amount: 15000,
      description: "Maintenance Fee Collection - Unit 301",
      date: "2024-01-15T00:00:00Z",
      vendor: "",
      unitNumber: "301",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "2",
      type: "expense",
      transactionClassification: "recurring_expense",
      category: "maintenance",
      amount: 25000,
      description: "Elevator Maintenance - ABC Services",
      date: "2024-01-14T00:00:00Z",
      vendor: "ABC Services",
      unitNumber: "",
      status: "pending",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "3",
      type: "expense",
      transactionClassification: "adhoc_expense",
      category: "security",
      amount: 85000,
      description: "Security System Upgrade",
      date: "2024-01-13T00:00:00Z",
      vendor: "SecureTech Ltd",
      unitNumber: "",
      status: "approved",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "4",
      type: "income",
      transactionClassification: "adhoc_income",
      category: "penalties",
      amount: 2500,
      description: "Late Fee - Unit 205",
      date: "2024-01-12T00:00:00Z",
      vendor: "",
      unitNumber: "205",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "5",
      type: "expense",
      transactionClassification: "recurring_expense",
      category: "utilities",
      amount: 45000,
      description: "Electricity Bill - December 2023",
      date: "2024-01-10T00:00:00Z",
      vendor: "Ceylon Electricity Board",
      unitNumber: "",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "6",
      type: "income",
      transactionClassification: "recurring_income",
      category: "dues",
      amount: 15000,
      description: "Maintenance Fee Collection - Unit 102",
      date: "2024-01-09T00:00:00Z",
      vendor: "",
      unitNumber: "102",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "7",
      type: "expense",
      transactionClassification: "recurring_expense",
      category: "cleaning",
      amount: 35000,
      description: "Monthly Cleaning Service",
      date: "2024-01-08T00:00:00Z",
      vendor: "CleanCorp Services",
      unitNumber: "",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
    {
      _id: "8",
      type: "income",
      transactionClassification: "adhoc_income",
      category: "penalties",
      amount: 1500,
      description: "Late Fee - Unit 407",
      date: "2024-01-07T00:00:00Z",
      vendor: "",
      unitNumber: "407",
      status: "completed",
      createdBy: {
        _id: user?._id || "1",
        firstName: "System",
        lastName: "Admin",
      },
    },
  ];

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    setPage(1); // Reset to first page when filter changes
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reset to first page when tab changes
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSubmit = async (transactionData) => {
    try {
      console.log("💾 Submitting transaction:", transactionData);

      if (editingTransaction) {
        console.log("✏️ Updating existing transaction:", editingTransaction._id);
        await api.put(
          `/finances/${editingTransaction._id}`,
          transactionData
        );
        setSuccess("Transaction updated successfully");
      } else {
        // Use the appropriate endpoint based on whether it's recurring
        const endpoint = transactionData.recurringTransaction?.isRecurring
          ? "/finances/recurring"
          : "/finances";

        console.log("➕ Creating new transaction via:", endpoint);
        const response = await api.post(endpoint, transactionData);
        console.log("✅ Transaction created:", response.data);
        setSuccess("Transaction recorded successfully");
      }

      setOpenDialog(false);
      setEditingTransaction(null);
      resetForm();

      console.log("🔄 Refreshing transaction list...");
      fetchTransactions();
      fetchFinancialStats();
    } catch (error) {
      console.error("❌ Submit transaction error:", error);
      console.log("🔍 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url,
        data: error.config?.data
      });

      // If API doesn't exist yet, show demo success
      if (error.response?.status === 401 || error.response?.status === 404) {
        setSuccess(
          "Demo: Transaction would be recorded when API is implemented"
        );
        setOpenDialog(false);
        setEditingTransaction(null);
        resetForm();
      } else {
        setError(error.response?.data?.message || "Failed to save transaction");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date ? transaction.date.split("T")[0] : "",
      vendor: transaction.vendor || "",
      unitNumber: transaction.unitNumber || "",
      paymentMethod: transaction.paymentMethod || "bank_transfer",
      reference: transaction.reference || "",
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/finances/${transactionId}`);
        setSuccess("Transaction deleted successfully");
        fetchTransactions();
        fetchFinancialStats();
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to delete transaction"
        );
      }
    }
    setAnchorEl(null);
  };

  const handleApprove = async (transactionId) => {
    try {
      await api.put(`/finances/${transactionId}/approve`);
      setSuccess("Transaction approved successfully");
      fetchTransactions();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to approve transaction"
      );
    }
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "maintenance",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      vendor: "",
      unitNumber: "",
      paymentMethod: "bank_transfer",
      reference: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "approved":
        return "info";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    return type === "income" ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getTypeColor = (type) => {
    return type === "income" ? "success" : "error";
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "LKR 0";
    }
    return `LKR ${Number(amount).toLocaleString()}`;
  };

  const canEditTransaction = (transaction) => {
    return transaction.createdBy._id === user?._id || canApproveTransactions;
  };

  if (!canManageFinances) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have permission to access financial management.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
        >
          Financial Management
        </Typography>
        <Fab
          color="primary"
          aria-label="add transaction"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h4" color="primary.main" gutterBottom>
                {formatCurrency(financialStats.totalBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current account balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Income</Typography>
              </Box>
              <Typography variant="h4" color="success.main" gutterBottom>
                {formatCurrency(financialStats.monthlyIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month's income
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Expenses</Typography>
              </Box>
              <Typography variant="h4" color="error.main" gutterBottom>
                {formatCurrency(financialStats.monthlyExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month's expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Outstanding Dues</Typography>
              </Box>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {formatCurrency(financialStats.outstandingDues)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending collections
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget Utilization */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Budget Utilization
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Budget Used</Typography>
              <Typography variant="body2">
                {financialStats.budgetUtilization}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={financialStats.budgetUtilization || 0}
              color={
                (financialStats.budgetUtilization || 0) > 90 ? "error" : "primary"
              }
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(financialStats.monthlyExpenses)} of monthly budget
            used
          </Typography>
        </CardContent>
      </Card>

      {/* Transaction Classification Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {transactionTabs.map((tab) => (
              <Tab
                key={tab.value}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </Box>
                }
                value={tab.value}
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recurring Transactions Management */}
      {activeTab === 'all' && (
        <Box sx={{ mb: 3 }}>
          <RecurringTransactions onEdit={handleEdit} />
        </Box>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="income">Income Only</MenuItem>
                  <MenuItem value="expense">Expenses Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" startIcon={<ReportIcon />} fullWidth>
                Generate Report
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" startIcon={<VendorIcon />} fullWidth>
                Manage Vendors
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Classification</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {activeTab === "all"
                    ? "No transactions found"
                    : `No ${activeTab.replace('_', ' ')} transactions found`}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={getTypeIcon(transaction.type)}
                      label={transaction.type.toUpperCase()}
                      color={getTypeColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={transaction.transactionClassification?.replace('_', ' ').toUpperCase() || 'ADHOC'}
                      color={transaction.transactionClassification?.includes('recurring') ? 'primary' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {transaction.description}
                    </Typography>
                    {transaction.vendor && (
                      <Typography variant="caption" color="text.secondary">
                        Vendor: {transaction.vendor}
                      </Typography>
                    )}
                    {transaction.unitNumber && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Unit: {transaction.unitNumber}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={transaction.category}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={
                        transaction.type === "income"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        label={transaction.status.toUpperCase()}
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                      {transaction.category === 'maintenance_fee' &&
                       transaction.unitMaintenanceDetails?.isPartialPayment && (
                        <Chip
                          label="PARTIAL"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    {canEditTransaction(transaction) && (
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedTransaction(transaction);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEdit(selectedTransaction)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {selectedTransaction?.status === "pending" &&
          canApproveTransactions && (
            <MenuItem onClick={() => handleApprove(selectedTransaction._id)}>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText>Approve</ListItemText>
            </MenuItem>
          )}

        <MenuItem onClick={() => handleDelete(selectedTransaction._id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Transaction Form */}
      <TransactionForm
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingTransaction(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        editingTransaction={editingTransaction}
        loading={loading}
      />
    </Container>
  );
};

export default FinancesPage;
