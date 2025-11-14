import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import UsersPage from './pages/users/UsersPage';
import MeetingsPage from './pages/meetings/MeetingsPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import FinancesPage from './pages/finances/FinancesPage';
import ReportsPage from './pages/reports/ReportsPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import DocumentsPage from './pages/documents/DocumentsPage';
import VendorsPage from './pages/vendors/VendorsPage';
import TransactionRequestPage from './pages/resident/TransactionRequestPage';
import NotFoundPage from './pages/NotFoundPage';

// Create theme
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#0c96f2',
      light: '#4db3f5',
      dark: '#0a7bc7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ed1b23',
      light: '#f04951',
      dark: '#c41419',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f7fafc' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1f1c53' : '#ffffff',
      secondary: mode === 'light' ? '#4a417e' : '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function AppContent() {
  const dispatch = useDispatch();
  const { user, isLoading, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui || { theme: 'light' });

  const muiTheme = createAppTheme(theme);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <HelmetProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
              />
              <Route 
                path="/register/:token" 
                element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
              />
              <Route 
                path="/forgot-password" 
                element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} 
              />
              <Route 
                path="/reset-password/:token" 
                element={user ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />} 
              />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/users" element={
                <ProtectedRoute requiredRole="secretary">
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/meetings" element={
                <ProtectedRoute>
                  <Layout>
                    <MeetingsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/announcements" element={
                <ProtectedRoute>
                  <Layout>
                    <AnnouncementsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/finances" element={
                <ProtectedRoute>
                  <Layout>
                    <FinancesPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Layout>
                    <MaintenancePage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/documents" element={
                <ProtectedRoute>
                  <Layout>
                    <DocumentsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/vendors" element={
                <ProtectedRoute requiredRole="treasurer">
                  <Layout>
                    <VendorsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/transaction-request" element={
                <ProtectedRoute>
                  <Layout>
                    <TransactionRequestPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Router>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </HelmetProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
