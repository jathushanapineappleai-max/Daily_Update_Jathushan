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
  Divider
} from '@mui/material';
import {
  Announcement,
  Build,
  AccountBalance,
  Event,
  Warning,
  CheckCircle,
  Schedule,
  ArrowForward,
  Home,
  Receipt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResidentDashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const stats = {
    outstandingDues: 15000,
    maintenanceRequests: 2,
    upcomingMeetings: 1,
    unreadAnnouncements: 3
  };

  const recentAnnouncements = [
    {
      id: 1,
      title: 'Monthly Maintenance Fee Payment Reminder',
      priority: 'medium',
      date: '2024-01-15',
      read: false
    },
    {
      id: 2,
      title: 'Elevator Maintenance Schedule',
      priority: 'high',
      date: '2024-01-14',
      read: true
    },
    {
      id: 3,
      title: 'Community Hall Booking Procedure',
      priority: 'low',
      date: '2024-01-13',
      read: false
    }
  ];

  const maintenanceRequests = [
    {
      id: 1,
      title: 'Kitchen Faucet Leak',
      status: 'in_progress',
      priority: 'medium',
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'Air Conditioning Issue',
      status: 'pending',
      priority: 'high',
      date: '2024-01-12'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colors[priority] || 'default';
  };

  return (
    <Grid container spacing={3}>
      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Outstanding Dues</Typography>
            </Box>
            <Typography variant="h4" color="error.main" gutterBottom>
              LKR {stats.outstandingDues.toLocaleString()}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/finances')}
              endIcon={<ArrowForward />}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Build sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Maintenance</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {stats.maintenanceRequests}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/maintenance')}
              endIcon={<ArrowForward />}
            >
              View Requests
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Event sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6">Meetings</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              {stats.upcomingMeetings}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/meetings')}
              endIcon={<ArrowForward />}
            >
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Announcement sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">Announcements</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {stats.unreadAnnouncements}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/announcements')}
              endIcon={<ArrowForward />}
            >
              View All
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Announcements */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Announcements
            </Typography>
            <List>
              {recentAnnouncements.map((announcement, index) => (
                <React.Fragment key={announcement.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Announcement color={getPriorityColor(announcement.priority)} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: announcement.read ? 'normal' : 'bold',
                              flex: 1
                            }}
                          >
                            {announcement.title}
                          </Typography>
                          {!announcement.read && (
                            <Chip size="small" label="New" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={new Date(announcement.date).toLocaleDateString()}
                    />
                  </ListItem>
                  {index < recentAnnouncements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/announcements')}
              sx={{ mt: 2 }}
            >
              View All Announcements
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Maintenance Requests */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Maintenance Requests
            </Typography>
            <List>
              {maintenanceRequests.map((request, index) => (
                <React.Fragment key={request.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {request.status === 'completed' ? (
                        <CheckCircle color="success" />
                      ) : request.status === 'in_progress' ? (
                        <Schedule color="info" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {request.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={request.status.replace('_', ' ')}
                            color={getStatusColor(request.status)}
                          />
                        </Box>
                      }
                      secondary={`Priority: ${request.priority} • ${new Date(request.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < maintenanceRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/maintenance')}
              sx={{ mt: 2 }}
            >
              Submit New Request
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Build />}
                  onClick={() => navigate('/maintenance')}
                >
                  Submit Maintenance Request
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Receipt />}
                  onClick={() => navigate('/finances')}
                >
                  View Payment History
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Event />}
                  onClick={() => navigate('/meetings')}
                >
                  View Meeting Minutes
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/documents')}
                >
                  Building Documents
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ResidentDashboard;
