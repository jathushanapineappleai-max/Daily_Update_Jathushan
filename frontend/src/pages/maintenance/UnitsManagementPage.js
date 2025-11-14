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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Calculate as CalculateIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import api from "../../services/apiService";

const UnitsManagementPage = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Unit details dialog
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [calculation, setCalculation] = useState(null);

  // Edit unit dialog
  const [editDialog, setEditDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    unitNumber: "",
    floor: "",
    unitType: "",
    surfaceArea: "",
    maintenanceRate: "",
    status: "",
    specialCategories: [],
    unitFeatures: {
      balcony: false,
      parking: 1,
      airConditioning: false,
      furnished: false
    },
    notes: ""
  });

  // Special category dialog
  const [specialCategoryDialog, setSpecialCategoryDialog] = useState(false);
  const [newSpecialCategory, setNewSpecialCategory] = useState({
    category: "",
    quantity: 1,
    monthlyFee: "",
    description: ""
  });

  const canManageUnits = ["treasurer", "president", "administrator"].includes(user?.role);

  useEffect(() => {
    fetchUnits();
  }, [page, filterFloor, filterType, searchTerm]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (filterFloor !== "all") params.append("floor", filterFloor);
      if (filterType !== "all") params.append("unitType", filterType);
      if (searchTerm) params.append("search", searchTerm);

      const response = await api.get(`/units?${params}`);
      
      if (response.data && response.data.success) {
        setUnits(response.data.units);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch units");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUnitTypeColor = (type) => {
    switch (type) {
      case "studio": return "default";
      case "1br": return "primary";
      case "2br": return "secondary";
      case "3br": return "success";
      case "4br": return "warning";
      case "penthouse": return "error";
      default: return "default";
    }
  };

  const formatCurrency = (amount) => 
    `LKR ${Number(amount).toLocaleString()}`;

  const viewUnitDetails = async (unit) => {
    try {
      setSelectedUnit(unit);

      // Fetch maintenance calculation
      const response = await api.get(`/units/${unit._id}/maintenance-calculation`);
      if (response.data && response.data.success) {
        console.log("📊 Maintenance Calculation Data:", response.data.calculation);
        setCalculation(response.data.calculation);
      }

      setDetailsDialog(true);
    } catch (err) {
      console.error("Failed to fetch unit calculation:", err);
      setSelectedUnit(unit);
      setCalculation(null);
      setDetailsDialog(true);
    }
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setEditFormData({
      unitNumber: unit.unitNumber,
      floor: unit.floor,
      unitType: unit.unitType,
      surfaceArea: unit.surfaceArea,
      maintenanceRate: unit.maintenanceRate,
      status: unit.status,
      specialCategories: unit.specialCategories || [],
      unitFeatures: {
        balcony: unit.unitFeatures?.balcony || false,
        parking: unit.unitFeatures?.parking || 1,
        airConditioning: unit.unitFeatures?.airConditioning || false,
        furnished: unit.unitFeatures?.furnished || false
      },
      notes: unit.notes || ""
    });
    setEditDialog(true);
  };

  const handleSaveUnit = async () => {
    try {
      const response = await api.put(`/units/${editingUnit._id}`, editFormData);

      if (response.data && response.data.success) {
        setSuccess("Unit updated successfully");
        setEditDialog(false);
        setEditingUnit(null);
        fetchUnits();
      }
    } catch (err) {
      setError("Failed to update unit");
      console.error(err);
    }
  };

  const handleAddSpecialCategory = async () => {
    try {
      const response = await api.post(
        `/units/${editingUnit._id}/special-categories`,
        newSpecialCategory
      );

      if (response.data && response.data.success) {
        setSuccess("Special category added successfully");
        setSpecialCategoryDialog(false);
        setNewSpecialCategory({
          category: "",
          quantity: 1,
          monthlyFee: "",
          description: ""
        });

        // Refresh the unit data
        const updatedUnit = response.data.unit;
        setEditFormData(prev => ({
          ...prev,
          specialCategories: updatedUnit.specialCategories
        }));

        // Refresh the units list to show updated totals
        fetchUnits();
      }
    } catch (err) {
      setError("Failed to add special category");
      console.error(err);
    }
  };

  const handleRemoveSpecialCategory = async (category) => {
    try {
      const response = await api.delete(
        `/units/${editingUnit._id}/special-categories/${category}`
      );

      if (response.data && response.data.success) {
        setSuccess("Special category removed successfully");

        // Update the form data
        setEditFormData(prev => ({
          ...prev,
          specialCategories: prev.specialCategories.filter(cat => cat.category !== category)
        }));

        // Refresh the units list to show updated totals
        fetchUnits();
      }
    } catch (err) {
      setError("Failed to remove special category");
      console.error(err);
    }
  };

  const floors = Array.from({ length: 20 }, (_, i) => i + 1);
  const unitTypes = ["studio", "1br", "2br", "3br", "4br", "penthouse"];
  const unitStatuses = ["occupied", "vacant", "under_renovation", "for_sale", "for_rent"];
  const specialCategoryOptions = [
    { value: "additional_parking", label: "Additional Parking", defaultFee: 15000 },
    { value: "balcony_premium", label: "Balcony Premium", defaultFee: 8000 },
    { value: "pool_access", label: "Pool Access", defaultFee: 12000 },
    { value: "gym_access", label: "Gym Access", defaultFee: 10000 },
    { value: "storage_unit", label: "Storage Unit", defaultFee: 5000 },
    { value: "garden_access", label: "Garden Access", defaultFee: 7000 },
    { value: "rooftop_access", label: "Rooftop Access", defaultFee: 15000 },
    { value: "concierge_service", label: "Concierge Service", defaultFee: 20000 }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Units Management
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <HomeIcon color="primary" />
          <Typography variant="h6" color="text.secondary">
            {units.length > 0 && `${units.length} units`}
          </Typography>
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

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Units"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Unit number, owner name..."
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Floor</InputLabel>
                <Select
                  value={filterFloor}
                  onChange={(e) => {
                    setFilterFloor(e.target.value);
                    setPage(1);
                  }}
                  label="Filter by Floor"
                >
                  <MenuItem value="all">All Floors</MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      Floor {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {unitTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterFloor("all");
                  setFilterType("all");
                  setSearchTerm("");
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Units Table */}
      {loading ? (
        <Typography>Loading units...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unit</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Surface Area</TableCell>
                <TableCell>Maintenance Rate</TableCell>
                <TableCell>Monthly Base Fee</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {unit.unitNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Floor {unit.floor}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {unit.owner ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2">
                            {unit.owner.firstName} {unit.owner.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {unit.owner.email}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No owner assigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={unit.unitType.toUpperCase()}
                      color={getUnitTypeColor(unit.unitType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {unit.surfaceArea} sq ft
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      LKR {unit.maintenanceRate}/sq ft
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(unit.totalMonthlyMaintenance || unit.monthlyBaseFee)}
                    </Typography>
                    {unit.monthlySpecialFees > 0 && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Base: {formatCurrency(unit.monthlyBaseFee)} + Special: {formatCurrency(unit.monthlySpecialFees)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => viewUnitDetails(unit)}
                        color="primary"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {canManageUnits && (
                      <Tooltip title="Edit Unit">
                        <IconButton
                          onClick={() => handleEditUnit(unit)}
                          color="default"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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

      {/* Unit Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Unit Details - {selectedUnit?.unitNumber}
        </DialogTitle>
        <DialogContent>
          {selectedUnit && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Unit Number</Typography>
                    <Typography variant="body1">{selectedUnit.unitNumber}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Floor</Typography>
                    <Typography variant="body1">{selectedUnit.floor}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Unit Type</Typography>
                    <Chip label={selectedUnit.unitType.toUpperCase()} color={getUnitTypeColor(selectedUnit.unitType)} size="small" />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Surface Area</Typography>
                    <Typography variant="body1">{selectedUnit.surfaceArea} sq ft</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Maintenance Calculation
                  </Typography>
                  {calculation ? (
                    <Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Base Rate</Typography>
                        <Typography variant="body1">LKR {calculation.baseRate}/sq ft</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Base Fee</Typography>
                        <Typography variant="body1">{formatCurrency(calculation.baseFee)}</Typography>
                      </Box>
                      {calculation.specialCategories && calculation.specialCategories.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Special Categories</Typography>
                          {calculation.specialCategories.map((cat, index) => (
                            <Typography key={index} variant="body2">
                              {cat.name}: {formatCurrency(cat.fee)}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Monthly Fee</Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(calculation.totalFee)}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Calculation not available
                    </Typography>
                  )}
                </Grid>
                
                {selectedUnit.owner && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Owner Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">
                        {selectedUnit.owner.firstName} {selectedUnit.owner.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedUnit.owner.email}</Typography>
                    </Box>
                    {selectedUnit.owner.phone && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{selectedUnit.owner.phone}</Typography>
                      </Box>
                    )}
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          {canManageUnits && (
            <Button
              variant="contained"
              onClick={() => {
                setDetailsDialog(false);
                handleEditUnit(selectedUnit);
              }}
            >
              Edit Unit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Unit - {editingUnit?.unitNumber}
        </DialogTitle>
        <DialogContent>
          {editingUnit && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Unit Number"
                    value={editFormData.unitNumber}
                    onChange={(e) => setEditFormData({...editFormData, unitNumber: e.target.value})}
                    disabled // Usually shouldn't change unit number
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Floor"
                    type="number"
                    value={editFormData.floor}
                    onChange={(e) => setEditFormData({...editFormData, floor: parseInt(e.target.value)})}
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Unit Type</InputLabel>
                    <Select
                      value={editFormData.unitType}
                      onChange={(e) => setEditFormData({...editFormData, unitType: e.target.value})}
                      label="Unit Type"
                    >
                      {unitTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      label="Status"
                    >
                      {unitStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.replace('_', ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Surface Area and Maintenance */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Surface Area & Maintenance
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Surface Area (sq ft)"
                    type="number"
                    value={editFormData.surfaceArea}
                    onChange={(e) => setEditFormData({...editFormData, surfaceArea: parseInt(e.target.value)})}
                    inputProps={{ min: 200, max: 5000 }}
                    helperText="Between 200 and 5000 sq ft"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maintenance Rate (LKR per sq ft)"
                    type="number"
                    value={editFormData.maintenanceRate}
                    onChange={(e) => setEditFormData({...editFormData, maintenanceRate: parseInt(e.target.value)})}
                    inputProps={{ min: 50, max: 500 }}
                    helperText="Between LKR 50 and 500 per sq ft"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Base Fee: {formatCurrency(editFormData.surfaceArea * editFormData.maintenanceRate)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Special Categories */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="h6">
                      Special Categories & Extra Privileges
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setSpecialCategoryDialog(true)}
                      variant="outlined"
                      size="small"
                    >
                      Add Category
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {editFormData.specialCategories.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Monthly Fee</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editFormData.specialCategories.map((category, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="body2">
                                  {specialCategoryOptions.find(opt => opt.value === category.category)?.label || category.category}
                                </Typography>
                                {category.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {category.description}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>{category.quantity}</TableCell>
                              <TableCell>{formatCurrency(category.monthlyFee)}</TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {formatCurrency(category.quantity * category.monthlyFee)}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => handleRemoveSpecialCategory(category.category)}
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        No special categories assigned. Click "Add Category" to add extra privileges like additional parking.
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      Total Monthly Maintenance: {formatCurrency(
                        (editFormData.surfaceArea * editFormData.maintenanceRate) +
                        editFormData.specialCategories.reduce((total, cat) => total + (cat.quantity * cat.monthlyFee), 0)
                      )}
                    </Typography>
                  </Box>
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                    placeholder="Any additional notes about this unit..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUnit} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Special Category Dialog */}
      <Dialog open={specialCategoryDialog} onClose={() => setSpecialCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Special Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add extra privileges like additional parking, gym access, or premium services to this unit.
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={newSpecialCategory.category}
                onChange={(e) => {
                  const selectedOption = specialCategoryOptions.find(opt => opt.value === e.target.value);
                  setNewSpecialCategory({
                    ...newSpecialCategory,
                    category: e.target.value,
                    monthlyFee: selectedOption?.defaultFee || ""
                  });
                }}
                label="Category"
              >
                {specialCategoryOptions
                  .filter(option => !editFormData.specialCategories.some(cat => cat.category === option.value))
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newSpecialCategory.quantity}
              onChange={(e) => setNewSpecialCategory({...newSpecialCategory, quantity: parseInt(e.target.value)})}
              margin="normal"
              inputProps={{ min: 1, max: 10 }}
              helperText="For parking: number of additional spaces"
            />

            <TextField
              fullWidth
              label="Monthly Fee (LKR)"
              type="number"
              value={newSpecialCategory.monthlyFee}
              onChange={(e) => setNewSpecialCategory({...newSpecialCategory, monthlyFee: parseInt(e.target.value)})}
              margin="normal"
              inputProps={{ min: 0, max: 50000 }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              value={newSpecialCategory.description}
              onChange={(e) => setNewSpecialCategory({...newSpecialCategory, description: e.target.value})}
              margin="normal"
              placeholder="e.g., Parking space #15, Premium balcony view"
            />

            {newSpecialCategory.category && newSpecialCategory.quantity && newSpecialCategory.monthlyFee && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="body2" color="info.main">
                  Total monthly cost: {formatCurrency(newSpecialCategory.quantity * newSpecialCategory.monthlyFee)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSpecialCategoryDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddSpecialCategory}
            variant="contained"
            disabled={!newSpecialCategory.category || !newSpecialCategory.monthlyFee}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UnitsManagementPage;
