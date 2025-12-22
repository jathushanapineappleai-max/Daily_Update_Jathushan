// API Client Utility for PAI ERP
// Handles HTTP requests with automatic token management

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.8:5001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Initialize token property
    this.token = null;
  }

  // Get token from localStorage
  getToken() {
    // First check if we have it in memory
    if (this.token) {
      return this.token;
    }
    // Otherwise get from localStorage
    return localStorage.getItem('token');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
    // Also store in memory for faster access
    this.token = token;
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('token');
    // Also clear the token from memory
    this.token = null;
  }

  // Create headers for requests
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        
        // Add user details to headers if available
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          headers['X-User-ID'] = user.id;
          headers['X-User-Role'] = user.role;
          headers['X-Employee-ID'] = user.emp_id;
        }
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      return { data, response };
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }

  // PUT request
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }

  // DELETE request
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;