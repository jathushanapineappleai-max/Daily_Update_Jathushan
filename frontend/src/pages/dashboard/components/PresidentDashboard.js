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
  Divider
} from '@mui/material';
import {
  Gavel,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  ArrowForward,
  Assessment,
  Business,
  Group
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PresidentDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    pendingApprovals: 12,
    activeProjects: 3,
    monthlyPerformance: 85,
    communityIssues: 5
  };

  const pendingApprovals = [
    {
      id: 1,
      title: 'Emergency Repair Budget Approval',
      amount: 150000,
      priority: 'urgent',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'New Vendor Registration - Security Services',
      priority: 'medium',
      date: '2024-01-14'
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Executive Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Gavel sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Pending Approvals</Typography>
            </Box>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {stats.pendingApprovals}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">Active Projects</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {stats.activeProjects}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Monitor
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6">Performance</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              {stats.monthlyPerformance}%
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Community Issues</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {stats.communityIssues}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Address
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Approvals */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Items Requiring Presidential Approval
            </Typography>
            <List>
              {pendingApprovals.map((approval, index) => (
                <React.Fragment key={approval.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Schedule color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {approval.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={approval.priority}
                            color={approval.priority === 'urgent' ? 'error' : 'warning'}
                          />
                        </Box>
                      }
                      secondary={`${approval.amount ? `LKR ${approval.amount.toLocaleString()} • ` : ''}${new Date(approval.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < pendingApprovals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Review All Approvals
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Executive Actions */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Executive Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                >
                  Strategic Reports
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Group />}
                >
                  Community Forum
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Business />}
                >
                  Project Oversight
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PresidentDashboard;
