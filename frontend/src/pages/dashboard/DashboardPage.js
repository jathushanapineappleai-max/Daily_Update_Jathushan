import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton
} from '@mui/material';
import {
  Notifications,
  Settings
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

// Role-specific dashboard components
import AdministratorDashboard from './components/AdministratorDashboard';
import PresidentDashboard from './components/PresidentDashboard';
import SecretaryDashboard from './components/SecretaryDashboard';
import TreasurerDashboard from './components/TreasurerDashboard';
import CouncilDashboard from './components/CouncilDashboard';
import ResidentDashboard from './components/ResidentDashboard';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const getDashboardTitle = (role) => {
    const titles = {
      administrator: 'System Administration Dashboard',
      president: 'President Dashboard',
      secretary: 'Secretary Dashboard',
      treasurer: 'Treasurer Dashboard',
      council: 'Council Member Dashboard',
      resident: 'Resident Dashboard'
    };
    return titles[role] || 'Dashboard';
  };

  const getDashboardDescription = (role) => {
    const descriptions = {
      administrator: 'Manage system settings, users, and overall operations',
      president: 'Oversee community operations and strategic decisions',
      secretary: 'Manage meetings, communications, and documentation',
      treasurer: 'Monitor finances, transactions, and budget management',
      council: 'Review community matters and assist in decision making',
      resident: 'Access community information and submit requests'
    };
    return descriptions[role] || 'Welcome to your dashboard';
  };

  const renderRoleSpecificDashboard = () => {
    switch (user?.role) {
      case 'administrator':
        return <AdministratorDashboard />;
      case 'president':
        return <PresidentDashboard />;
      case 'secretary':
        return <SecretaryDashboard />;
      case 'treasurer':
        return <TreasurerDashboard />;
      case 'council':
        return <CouncilDashboard />;
      case 'resident':
        return <ResidentDashboard />;
      default:
        return <ResidentDashboard />;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getDashboardTitle(user.role)} - Span Tower 27</title>
        <meta name="description" content={getDashboardDescription(user.role)} />
      </Helmet>

      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Welcome Header */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #0c96f2 0%, #1f1c53 100%)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '2rem'
                  }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Welcome back, {user.firstName}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  {getDashboardTitle(user.role)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {getDashboardDescription(user.role)}
                </Typography>
                {user.unitNumber && (
                  <Chip
                    label={`Unit ${user.unitNumber}`}
                    sx={{
                      mt: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                )}
              </Grid>
              <Grid item>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton sx={{ color: 'white' }}>
                    <Notifications />
                  </IconButton>
                  <IconButton sx={{ color: 'white' }}>
                    <Settings />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Role-specific Dashboard Content */}
          {renderRoleSpecificDashboard()}
        </Box>
      </Container>
    </>
  );
};

export default DashboardPage;
