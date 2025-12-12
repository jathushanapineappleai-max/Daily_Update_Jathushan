# Employee Management API Testing Guide

This guide explains how to test the employee management API endpoints using either Postman or the provided script.

## Prerequisites

1. The PAI ERP backend server must be running on `http://localhost:5000`
2. An admin user must exist with the following credentials:
   - Email: admin@example.com
   - Password: admin123

## Method 1: Using Postman

### Setup

1. Import the Postman collection:
   - File: `postman/Employee Management API.postman_collection.json`
2. Import the Postman environment:
   - File: `postman/PAI ERP Local Environment.postman_environment.json`

### Testing Process

1. Execute the "Admin Login" request to authenticate
2. Copy the JWT token from the response
3. Update the `admin_token` variable in your environment with this token
4. Execute the employee creation requests in numerical order:
   - "1. Create Employee - Personal Info"
   - Copy the employee ID from the response
   - Update the `employee_id` variable in your environment
   - Continue with requests 2-5
5. Test the retrieval endpoints (6-7) to verify the employee data

## Method 2: Using the Automated Script

### Setup

1. Ensure dependencies are installed:
   ```bash
   npm install axios form-data
   ```

### Running the Script

1. Navigate to the scripts directory:

   ```bash
   cd scripts
   ```

2. Run the script:
   ```bash
   node addSampleEmployee.js
   ```

### What the Script Does

1. Logs in as admin
2. Creates an employee with personal information
3. Adds education and professional experience
4. Sets work information
5. Retrieves and displays the complete employee overview
6. Retrieves and displays all employees

## Expected Results

After successfully running either method, you should see:

1. A new employee record in the database
2. Associated education and professional experience records
3. Work information linked to the employee
4. Proper JSON responses showing the created data

## Troubleshooting

If you encounter issues:

1. Verify the server is running on port 5000
2. Confirm admin credentials are correct
3. Check that all required migrations have been applied
4. Ensure the database is accessible
