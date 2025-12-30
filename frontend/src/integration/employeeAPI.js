// Employee API Service
import apiClient from "../utils/apiClient";

class EmployeeAPI {
  // Step 1: Create employee personal information
  async createEmployeePersonal(data) {
    try {
      const { data: response } = await apiClient.post(
        "/employees/personal",
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Step 1: Update employee personal information
  async updateEmployeePersonal(employeeId, data) {
    try {
      const { data: response } = await apiClient.put(
        `/employees/${employeeId}/personal`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Step 2: Add employee education information
  async addEmployeeEducation(employeeId, data) {
    try {
      const { data: response } = await apiClient.post(
        `/employees/${employeeId}/education`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Step 2: Add employee professional information
  async addEmployeeProfessional(employeeId, data) {
    try {
      const { data: response } = await apiClient.post(
        `/employees/${employeeId}/professional`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Step 3: Upload employee document
  async uploadEmployeeDocument(employeeId, formData) {
    try {
      const url = `${apiClient.baseURL}/employees/${employeeId}/documents`;

      // Get token for authorization
      const token = apiClient.getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload document");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Step 3: Set employee work information
  async setEmployeeWorkInfo(employeeId, data) {
    try {
      const { data: response } = await apiClient.post(
        `/employees/${employeeId}/work-info`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(employeeId) {
    try {
      const { data: response } = await apiClient.get(
        `/employees/${employeeId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all employees with optional status filter
  async getAllEmployees(page = 1, limit = 10, status = null) {
    try {
      let url = `/employees?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const { data: response } = await apiClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const employeeAPI = new EmployeeAPI();

export default employeeAPI;
