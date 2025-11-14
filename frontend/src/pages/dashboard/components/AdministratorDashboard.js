import React from 'react';
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
  LinearProgress,
  Divider,
  Alert
} from '@mui/material';
import {
  People,
  Security,
  Storage,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Settings,
  ArrowForward,
  AdminPanelSettings,
  Analytics,
  Backup
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdministratorDashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const systemStats = {
    totalUsers: 88,
    activeUsers: 82,
    pendingApprovals: 5,
    systemHealth: 98,
    storageUsed: 65,
    lastBackup: '2024-01-15T02:00:00Z'
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      description: 'New user registered: John Doe (Unit 405)',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 2,
      type: 'system_update',
      description: 'System backup completed successfully',
      timestamp: '2024-01-15T02:00:00Z',
      status: 'success'
    },
    {
      id: 3,
      type: 'security_alert',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-01-14T18:45:00Z',
      status: 'warning'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'vendor_registration',
      title: 'ABC Cleaning Services - Vendor Registration',
      priority: 'medium',
      date: '2024-01-14'
    },
    {
      id: 2,
      type: 'user_role_change',
      title: 'Role change request: Jane Smith to Council Member',
      priority: 'high',
      date: '2024-01-13'
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      user_registration: <People color="primary" />,
      system_update: <Settings color="success" />,
      security_alert: <Security color="warning" />,
      error: <Error color="error" />
    };
    return icons[type] || <CheckCircle color="info" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      success: 'success',
      warning: 'warning',
      error: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Grid container spacing={3}>
      {/* System Health Alert */}
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 2 }}>
          System is running smoothly. Last backup: {new Date(systemStats.lastBackup).toLocaleString()}
        </Alert>
      </Grid>

      {/* System Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Total Users</Typography>
            </Box>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {systemStats.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {systemStats.activeUsers} active users
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/users')}
              endIcon={<ArrowForward />}
              sx={{ mt: 1 }}
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AdminPanelSettings sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Pending Approvals</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {systemStats.pendingApprovals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Require your attention
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              sx={{ mt: 1 }}
            >
              Review All
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">System Health</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {systemStats.systemHealth}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={systemStats.systemHealth}
              color="success"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Storage sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6">Storage Used</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              {systemStats.storageUsed}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={systemStats.storageUsed}
              color="info"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Recent System Activities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent System Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {activity.description}
                          </Typography>
                          <Chip
                            size="small"
                            label={activity.status}
                            color={getStatusColor(activity.status)}
                          />
                        </Box>
                      }
                      secondary={new Date(activity.timestamp).toLocaleString()}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            >
              View Activity Log
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Approvals */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>
            <List>
              {pendingApprovals.map((approval, index) => (
                <React.Fragment key={approval.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={approval.title}
                      secondary={`Priority: ${approval.priority} • ${new Date(approval.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < pendingApprovals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              sx={{ mt: 2 }}
            >
              Review All Approvals
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Admin Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Administrator Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => navigate('/users')}
                >
                  User Management
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Settings />}
                >
                  System Settings
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Analytics />}
                >
                  Analytics & Reports
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Backup />}
                >
                  Backup & Restore
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdministratorDashboard;
