import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import MaintenanceDashboard from "./MaintenanceDashboard";
import MaintenanceFeePage from "./MaintenanceFeePage";
import UnitsManagementPage from "./UnitsManagementPage";

const MaintenancePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  const canManageFees = ["treasurer", "president", "administrator"].includes(user?.role);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <MaintenanceDashboard />;
      case 1:
        return <MaintenanceFeePage />;
      case 2:
        return <UnitsManagementPage />;
      default:
        return <MaintenanceDashboard />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Maintenance Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage unit maintenance fees, payments, and unit information
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            icon={<DashboardIcon />}
            label="Dashboard"
            iconPosition="start"
          />
          <Tab
            icon={<PaymentIcon />}
            label="Maintenance Fees"
            iconPosition="start"
          />
          {canManageFees && (
            <Tab
              icon={<HomeIcon />}
              label="Units Management"
              iconPosition="start"
            />
          )}
        </Tabs>
      </Paper>

      <Box>
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default MaintenancePage;
