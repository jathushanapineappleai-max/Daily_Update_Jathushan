import axios from 'axios';

const API_URL = '/api/auth/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  const response = await api.post('register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('login', userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Load user
const loadUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get('/api/auth/me', config);
  
  // Update user in localStorage
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    await api.post('logout');
  } catch (error) {
    // Even if logout fails on server, clear local storage
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await api.post('forgot-password', { email });
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await api.post(`reset-password/${token}`, { password });
  return response.data;
};

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put('/api/auth/profile', userData, config);
  
  // Update user in localStorage
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

// Change password
const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put('/api/auth/change-password', passwordData, config);
  return response.data;
};

// Verify email
const verifyEmail = async (token) => {
  const response = await api.post(`verify-email/${token}`);
  return response.data;
};

// Resend verification email
const resendVerification = async (email) => {
  const response = await api.post('resend-verification', { email });
  return response.data;
};

// Enable 2FA
const enable2FA = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post('/api/auth/2fa/enable', {}, config);
  return response.data;
};

// Verify 2FA setup
const verify2FASetup = async (code, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post('/api/auth/2fa/verify-setup', { code }, config);
  return response.data;
};

// Disable 2FA
const disable2FA = async (code, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post('/api/auth/2fa/disable', { code }, config);
  return response.data;
};

// Verify 2FA login
const verify2FALogin = async (code, tempToken) => {
  const response = await api.post('2fa/verify-login', { 
    code, 
    tempToken 
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Get backup codes
const getBackupCodes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get('/api/auth/2fa/backup-codes', config);
  return response.data;
};

// Regenerate backup codes
const regenerateBackupCodes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post('/api/auth/2fa/regenerate-backup-codes', {}, config);
  return response.data;
};

const authService = {
  register,
  login,
  loadUser,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerification,
  enable2FA,
  verify2FASetup,
  disable2FA,
  verify2FALogin,
  getBackupCodes,
  regenerateBackupCodes,
};

export default authService;
