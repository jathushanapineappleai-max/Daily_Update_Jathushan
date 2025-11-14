import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  Pagination,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Security as SecurityIcon,
  VpnKey as ResetPasswordIcon,
  Block as DeactivateIcon,
  CheckCircle as ActivateIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../services/apiService';

const UsersPage = () => {
  const { user } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    unitNumber: '',
    phone: '',
    role: 'resident',
    sendWelcomeEmail: true
  });

  const canManageUsers = ['secretary', 'president', 'administrator'].includes(user?.role);
  const canChangeRoles = ['president', 'administrator'].includes(user?.role);
  const canDeleteUsers = user?.role === 'administrator';

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
    }
  }, [page, searchTerm, roleFilter, canManageUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);

      const response = await api.get(`/users?${params}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', formData);
      setSuccess(`User created successfully. ${formData.sendWelcomeEmail ? 'Welcome email sent.' : `Temporary password: ${response.data.tempPassword}`}`);
      setOpenCreateDialog(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser._id}`, formData);
      setSuccess('User updated successfully');
      setOpenEditDialog(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleActivateUser = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}/activate`, { isActive: !isActive });
      setSuccess(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user status');
    }
    setAnchorEl(null);
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setSuccess(`User role changed to ${newRole} successfully`);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change user role');
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s password?')) {
      try {
        const response = await api.post(`/users/${userId}/reset-password`);
        setSuccess(`Password reset successfully. New password: ${response.data.tempPassword}`);
        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to reset password');
      }
    }
    setAnchorEl(null);
  };

  const handleUnlockUser = async (userId) => {
    try {
      await api.post(`/users/${userId}/unlock`);
      setSuccess('User account unlocked successfully');
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to unlock user');
    }
    setAnchorEl(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
    setAnchorEl(null);
  };

  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      unitNumber: user.unitNumber || '',
      phone: user.phone || '',
      role: user.role,
      sendWelcomeEmail: false
    });
    setOpenEditDialog(true);
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      unitNumber: '',
      phone: '',
      role: 'resident',
      sendWelcomeEmail: true
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      'administrator': 'error',
      'president': 'secondary',
      'secretary': 'primary',
      'treasurer': 'primary',
      'council': 'info',
      'resident': 'default'
    };
    return colors[role] || 'default';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'administrator': return <SecurityIcon />;
      case 'president': return <PersonAddIcon />;
      default: return null;
    }
  };

  if (!canManageUsers) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have permission to access user management.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Filter by Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="resident">Resident</MenuItem>
                  <MenuItem value="council">Council</MenuItem>
                  <MenuItem value="treasurer">Treasurer</MenuItem>
                  <MenuItem value="secretary">Secretary</MenuItem>
                  <MenuItem value="president">President</MenuItem>
                  <MenuItem value="administrator">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((userItem) => (
                <TableRow key={userItem._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>
                        {userItem.firstName[0]}{userItem.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {userItem.firstName} {userItem.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userItem.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      {userItem.phone && (
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{userItem.phone}</Typography>
                        </Box>
                      )}
                      {userItem.unitNumber && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <HomeIcon fontSize="small" color="action" />
                          <Typography variant="body2">Unit {userItem.unitNumber}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={getRoleIcon(userItem.role)}
                      label={userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                      color={getRoleColor(userItem.role)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Chip
                        label={userItem.isActive ? 'Active' : 'Inactive'}
                        color={userItem.isActive ? 'success' : 'default'}
                        size="small"
                      />
                      {userItem.isLocked && (
                        <Chip
                          label="Locked"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {userItem.lastActivity
                        ? format(new Date(userItem.lastActivity), 'MMM dd, yyyy HH:mm')
                        : 'Never'
                      }
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedUser(userItem);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
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
            onChange={(e, value) => setPage(value)}
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
        <MenuItem onClick={() => openEditUserDialog(selectedUser)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleActivateUser(selectedUser?._id, selectedUser?.isActive)}>
          <ListItemIcon>
            {selectedUser?.isActive ? <DeactivateIcon /> : <ActivateIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleResetPassword(selectedUser?._id)}>
          <ListItemIcon><ResetPasswordIcon /></ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>

        {selectedUser?.isLocked && (
          <MenuItem onClick={() => handleUnlockUser(selectedUser?._id)}>
            <ListItemIcon><UnlockIcon /></ListItemIcon>
            <ListItemText>Unlock Account</ListItemText>
          </MenuItem>
        )}

        {canDeleteUsers && selectedUser?._id !== user?._id && (
          <MenuItem onClick={() => handleDeleteUser(selectedUser?._id)}>
            <ListItemIcon><DeleteIcon /></ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleCreateUser}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Number"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="resident">Resident</MenuItem>
                    <MenuItem value="council">Council</MenuItem>
                    <MenuItem value="treasurer">Treasurer</MenuItem>
                    <MenuItem value="secretary">Secretary</MenuItem>
                    {canChangeRoles && <MenuItem value="president">President</MenuItem>}
                    {user?.role === 'administrator' && <MenuItem value="administrator">Administrator</MenuItem>}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.sendWelcomeEmail}
                      onChange={(e) => setFormData({ ...formData, sendWelcomeEmail: e.target.checked })}
                    />
                  }
                  label="Send welcome email with login credentials"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenCreateDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleEditUser}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Number"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              {canChangeRoles && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) => handleChangeRole(selectedUser?._id, e.target.value)}
                      label="Role"
                    >
                      <MenuItem value="resident">Resident</MenuItem>
                      <MenuItem value="council">Council</MenuItem>
                      <MenuItem value="treasurer">Treasurer</MenuItem>
                      <MenuItem value="secretary">Secretary</MenuItem>
                      <MenuItem value="president">President</MenuItem>
                      {user?.role === 'administrator' && <MenuItem value="administrator">Administrator</MenuItem>}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenEditDialog(false);
              setSelectedUser(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UsersPage;
