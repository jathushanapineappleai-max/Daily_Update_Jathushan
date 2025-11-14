import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  People,
  Event,
  Announcement,
  AccountBalance,
  Assessment,
  Build,
  Description,
  Business,
  Receipt,
  Logout,
  Settings,
  Notifications,
  Home,
} from "@mui/icons-material";

import { logout } from "../../store/slices/authSlice";

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate("/");
  };

  const getMenuItems = () => {
    const baseItems = [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { text: "Announcements", icon: <Announcement />, path: "/announcements" },
      { text: "Meetings", icon: <Event />, path: "/meetings" },
      { text: "Maintenance", icon: <Build />, path: "/maintenance" },
      { text: "Documents", icon: <Description />, path: "/documents" },
    ];

    const roleSpecificItems = {
      administrator: [
        { text: "User Management", icon: <People />, path: "/users" },
        {
          text: "Financial Management",
          icon: <AccountBalance />,
          path: "/finances",
        },
        {
          text: "Financial Reports",
          icon: <Assessment />,
          path: "/reports",
        },
        { text: "Vendor Management", icon: <Business />, path: "/vendors" },
      ],
      president: [
        {
          text: "Financial Overview",
          icon: <AccountBalance />,
          path: "/finances",
        },
        {
          text: "Financial Reports",
          icon: <Assessment />,
          path: "/reports",
        },
        { text: "Vendor Management", icon: <Business />, path: "/vendors" },
      ],
      secretary: [
        { text: "User Management", icon: <People />, path: "/users" },
      ],
      treasurer: [
        {
          text: "Financial Management",
          icon: <AccountBalance />,
          path: "/finances",
        },
        {
          text: "Financial Reports",
          icon: <Assessment />,
          path: "/reports",
        },
        { text: "Vendor Management", icon: <Business />, path: "/vendors" },
      ],
      council: [],
      resident: [
        {
          text: "Transaction Request",
          icon: <Receipt />,
          path: "/transaction-request",
        },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[user?.role] || [])];
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Span Tower 27
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Management System
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 1 }}>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => {
              navigate("/profile");
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname === "/profile"}
            sx={{
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Person />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Home />
            </ListItemIcon>
            <ListItemText
              primary="Back to Home"
              primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
            color="primary"
          >
            {location.pathname === "/dashboard"
              ? "Dashboard"
              : location.pathname === "/profile"
              ? "Profile"
              : location.pathname === "/users"
              ? "User Management"
              : location.pathname === "/meetings"
              ? "Meetings"
              : location.pathname === "/announcements"
              ? "Announcements"
              : location.pathname === "/finances"
              ? "Financial Management"
              : location.pathname === "/reports"
              ? "Financial Reports"
              : location.pathname === "/maintenance"
              ? "Maintenance"
              : location.pathname === "/documents"
              ? "Documents"
              : location.pathname === "/vendors"
              ? "Vendor Management"
              : "Span Tower 27"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton sx={{ color: "grey.500" }}>
                <Badge badgeContent={3} color="primary">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton sx={{ color: "grey.500" }}>
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.9rem",
                  }}
                >
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Typography>
          {user?.unitNumber && (
            <Typography variant="body2" color="text.secondary">
              Unit {user.unitNumber}
            </Typography>
          )}
        </Box>

        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f7fafc",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
