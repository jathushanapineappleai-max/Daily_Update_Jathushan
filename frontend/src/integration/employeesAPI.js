// API layer for employees management
import apiClient from '../utils/apiClient';

// Utility function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const fetchEmployees = async (page = 1, limit = 10) => {
  try {
    return await apiRequest(`/employees?page=${page}&limit=${limit}`);
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    return await apiRequest(`/employees/${id}`);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    throw error;
  }
};

// Fetch total employee count
export const fetchEmployeeCount = async () => {
  try {
    // We'll fetch employees with a limit of 1 and get the total count from pagination
    const response = await apiRequest('/employees?page=1&limit=1');
    
    // If the API returns pagination info, use it; otherwise return a default count
    if (response.data?.pagination?.total !== undefined) {
      return { data: { count: response.data.pagination.total } };
    } else {
      // Fallback: return the count of returned records
      return { data: { count: response.data.employees?.length || 0 } };
    }
  } catch (error) {
    console.error('Error fetching employee count:', error);
    throw error;
  }
};