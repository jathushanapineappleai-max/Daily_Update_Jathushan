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
  Avatar,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText as MuiListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Assignment as ContractIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import api from "../../services/apiService";

const VendorsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]); // Store all vendors for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "maintenance",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    contractStart: "",
    contractEnd: "",
    paymentTerms: "30",
    rating: 0,
    isActive: true,
  });

  const canManageVendors = ["treasurer", "president", "administrator"].includes(
    user?.role
  );

  useEffect(() => {
    fetchVendors();
  }, []); // Remove dependencies to avoid infinite loop

  // Separate effect for filtering
  useEffect(() => {
    applyFilters();
  }, [filterCategory, filterStatus, allVendors, page]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vendors?limit=100"); // Fetch more records for better filtering

      // Handle response safely
      if (response.data && response.data.vendors) {
        setAllVendors(response.data.vendors);
      } else {
        // Fallback to demo data if API structure is different
        setAllVendors(getDemoVendors());
      }
      setError("");
    } catch (error) {
      // If API doesn't exist yet, show demo data
      if (error.response?.status === 401 || error.response?.status === 404) {
        setAllVendors(getDemoVendors());
        setError("");
      } else {
        setError("Failed to fetch vendors");
        console.error("Fetch vendors error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allVendors];

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (vendor) => vendor.category === filterCategory
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      const isActive = filterStatus === "active";
      filtered = filtered.filter((vendor) => vendor.isActive === isActive);
    }

    // Calculate pagination
    const itemsPerPage = 12;
    const totalItems = filtered.length;
    const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(calculatedTotalPages);

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVendors = filtered.slice(startIndex, endIndex);

    setVendors(paginatedVendors);

    // Reset page if current page exceeds total pages
    if (page > calculatedTotalPages && calculatedTotalPages > 0) {
      setPage(1);
    }
  };

  // Demo data for when API is not available
  const getDemoVendors = () => [
    {
      _id: "1",
      name: "ABC Maintenance Services",
      category: "maintenance",
      contactPerson: "John Silva",
      email: "john@abcmaintenance.lk",
      phone: "+94 11 234 5678",
      address: "123 Galle Road, Colombo 03",
      description: "Professional building maintenance and repair services",
      contractStart: "2024-01-01",
      contractEnd: "2024-12-31",
      paymentTerms: "30",
      rating: 4.5,
      isActive: true,
      totalContracts: 12,
      totalPayments: 450000,
      lastPayment: "2024-01-15T00:00:00Z",
    },
    {
      _id: "2",
      name: "SecureTech Solutions",
      category: "security",
      contactPerson: "Priya Fernando",
      email: "priya@securetech.lk",
      phone: "+94 11 345 6789",
      address: "456 Kandy Road, Colombo 07",
      description: "Security systems installation and monitoring",
      contractStart: "2023-06-01",
      contractEnd: "2025-05-31",
      paymentTerms: "15",
      rating: 4.8,
      isActive: true,
      totalContracts: 8,
      totalPayments: 850000,
      lastPayment: "2024-01-10T00:00:00Z",
    },
    {
      _id: "3",
      name: "Green Clean Lanka",
      category: "cleaning",
      contactPerson: "Ravi Perera",
      email: "ravi@greenclean.lk",
      phone: "+94 11 456 7890",
      address: "789 Negombo Road, Colombo 15",
      description: "Eco-friendly cleaning services for residential complexes",
      contractStart: "2024-02-01",
      contractEnd: "2025-01-31",
      paymentTerms: "30",
      rating: 4.2,
      isActive: true,
      totalContracts: 24,
      totalPayments: 180000,
      lastPayment: "2024-01-05T00:00:00Z",
    },
    {
      _id: "4",
      name: "Elite Landscaping",
      category: "landscaping",
      contactPerson: "Saman Jayawardena",
      email: "saman@elitelandscape.lk",
      phone: "+94 11 567 8901",
      address: "321 Baseline Road, Colombo 09",
      description: "Garden maintenance and landscaping services",
      contractStart: "2023-03-01",
      contractEnd: "2024-02-29",
      paymentTerms: "45",
      rating: 3.8,
      isActive: false,
      totalContracts: 6,
      totalPayments: 120000,
      lastPayment: "2023-12-20T00:00:00Z",
    },
    {
      _id: "5",
      name: "PowerFix Electrical",
      category: "electrical",
      contactPerson: "Nimal Rodrigo",
      email: "nimal@powerfix.lk",
      phone: "+94 11 678 9012",
      address: "654 High Level Road, Colombo 06",
      description: "Electrical repairs and installations",
      contractStart: "2024-01-15",
      contractEnd: "2024-12-31",
      paymentTerms: "30",
      rating: 4.6,
      isActive: true,
      totalContracts: 15,
      totalPayments: 320000,
      lastPayment: "2024-01-12T00:00:00Z",
    },
    {
      _id: "6",
      name: "AquaFlow Plumbing",
      category: "plumbing",
      contactPerson: "Chaminda Wickrama",
      email: "chaminda@aquaflow.lk",
      phone: "+94 11 789 0123",
      address: "987 Duplication Road, Colombo 04",
      description: "Plumbing repairs and water system maintenance",
      contractStart: "2023-09-01",
      contractEnd: "2024-08-31",
      paymentTerms: "30",
      rating: 4.3,
      isActive: true,
      totalContracts: 18,
      totalPayments: 275000,
      lastPayment: "2024-01-08T00:00:00Z",
    },
    {
      _id: "7",
      name: "ProClean Services",
      category: "cleaning",
      contactPerson: "Malini Perera",
      email: "malini@proclean.lk",
      phone: "+94 11 890 1234",
      address: "147 Galle Road, Colombo 06",
      description: "Professional cleaning and sanitization services",
      contractStart: "2023-12-01",
      contractEnd: "2024-11-30",
      paymentTerms: "30",
      rating: 4.4,
      isActive: true,
      totalContracts: 20,
      totalPayments: 240000,
      lastPayment: "2024-01-01T00:00:00Z",
    },
    {
      _id: "8",
      name: "Guardian Security",
      category: "security",
      contactPerson: "Kamal Silva",
      email: "kamal@guardian.lk",
      phone: "+94 11 901 2345",
      address: "258 Union Place, Colombo 02",
      description: "Comprehensive security solutions and monitoring",
      contractStart: "2023-08-01",
      contractEnd: "2024-07-31",
      paymentTerms: "15",
      rating: 3.9,
      isActive: false,
      totalContracts: 10,
      totalPayments: 650000,
      lastPayment: "2023-11-15T00:00:00Z",
    },
  ];

  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") {
      setFilterCategory(value);
    } else if (filterType === "status") {
      setFilterStatus(value);
    }
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setFilterCategory("all");
    setFilterStatus("all");
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await api.put(`/vendors/${editingVendor._id}`, formData);
        setSuccess("Vendor updated successfully");
      } else {
        await api.post("/vendors", formData);
        setSuccess("Vendor added successfully");
      }

      setOpenDialog(false);
      setEditingVendor(null);
      resetForm();
      fetchVendors();
    } catch (error) {
      // If API doesn't exist yet, show demo success
      if (error.response?.status === 401 || error.response?.status === 404) {
        setSuccess("Demo: Vendor would be saved when API is implemented");
        setOpenDialog(false);
        setEditingVendor(null);
        resetForm();
      } else {
        setError(error.response?.data?.message || "Failed to save vendor");
      }
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      description: vendor.description,
      contractStart: vendor.contractStart
        ? vendor.contractStart.split("T")[0]
        : "",
      contractEnd: vendor.contractEnd ? vendor.contractEnd.split("T")[0] : "",
      paymentTerms: vendor.paymentTerms.toString(),
      rating: vendor.rating,
      isActive: vendor.isActive,
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await api.delete(`/vendors/${vendorId}`);
        setSuccess("Vendor deleted successfully");
        fetchVendors();
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          setSuccess("Demo: Vendor would be deleted when API is implemented");
        } else {
          setError(error.response?.data?.message || "Failed to delete vendor");
        }
      }
    }
    setAnchorEl(null);
  };

  const handleStatusToggle = async (vendorId, currentStatus) => {
    try {
      await api.put(`/vendors/${vendorId}/status`, {
        isActive: !currentStatus,
      });
      setSuccess(
        `Vendor ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchVendors();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        setSuccess(
          "Demo: Vendor status would be updated when API is implemented"
        );
      } else {
        setError(
          error.response?.data?.message || "Failed to update vendor status"
        );
      }
    }
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "maintenance",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      contractStart: "",
      contractEnd: "",
      paymentTerms: "30",
      rating: 0,
      isActive: true,
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      maintenance: "primary",
      security: "error",
      cleaning: "success",
      landscaping: "info",
      electrical: "warning",
      plumbing: "secondary",
    };
    return colors[category] || "default";
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "LKR 0";
    }
    return `LKR ${Number(amount).toLocaleString()}`;
  };

  if (!canManageVendors) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have permission to access vendor management.
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
          Vendor Management
        </Typography>
        <Fab
          color="primary"
          aria-label="add vendor"
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

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  label="Filter by Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="landscaping">Landscaping</MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                  <MenuItem value="plumbing">Plumbing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="all">All Vendors</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="inactive">Inactive Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      {loading ? (
        <Typography>Loading vendors...</Typography>
      ) : vendors.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {filterCategory === "all" && filterStatus === "all"
              ? "No vendors found"
              : `No vendors found matching current filters`}
          </Typography>
          {(filterCategory !== "all" || filterStatus !== "all") && (
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {vendors.map((vendor) => (
              <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            component="h2"
                            fontWeight="bold"
                          >
                            {vendor.name}
                          </Typography>
                          <Chip
                            label={vendor.category.toUpperCase()}
                            color={getCategoryColor(vendor.category)}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedVendor(vendor);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip
                        icon={
                          vendor.isActive ? <ActiveIcon /> : <InactiveIcon />
                        }
                        label={vendor.isActive ? "Active" : "Inactive"}
                        color={vendor.isActive ? "success" : "default"}
                        size="small"
                      />
                      <Rating value={vendor.rating} readOnly size="small" />
                      <Typography variant="caption">
                        ({vendor.rating})
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {vendor.description.length > 100
                        ? `${vendor.description.substring(0, 100)}...`
                        : vendor.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <List dense sx={{ py: 0 }}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <PhoneIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <MuiListItemText
                          primary={vendor.contactPerson}
                          secondary={vendor.phone}
                          primaryTypographyProps={{ variant: "body2" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <EmailIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <MuiListItemText
                          primary={vendor.email}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total Contracts
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {vendor.totalContracts}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total Payments
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(vendor.totalPayments)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <CardActions>
                    <Button size="small" startIcon={<ContractIcon />}>
                      View Contract
                    </Button>
                    <Button size="small" startIcon={<PaymentIcon />}>
                      Payments
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEdit(selectedVendor)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit Vendor</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleStatusToggle(selectedVendor?._id, selectedVendor?.isActive)
          }
        >
          <ListItemIcon>
            {selectedVendor?.isActive ? <InactiveIcon /> : <ActiveIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedVendor?.isActive ? "Deactivate" : "Activate"}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleDelete(selectedVendor?._id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete Vendor</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingVendor ? "Edit Vendor" : "Add New Vendor"}
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vendor Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    label="Category"
                    required
                  >
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="landscaping">Landscaping</MenuItem>
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="plumbing">Plumbing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract Start Date"
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) =>
                    setFormData({ ...formData, contractStart: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract End Date"
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, contractEnd: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Terms (Days)"
                  type="number"
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentTerms: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    value={formData.rating}
                    onChange={(e, newValue) =>
                      setFormData({ ...formData, rating: newValue || 0 })
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingVendor(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingVendor ? "Update" : "Add"} Vendor
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default VendorsPage;
