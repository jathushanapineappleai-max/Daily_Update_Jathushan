# Postman Collection for Employee Management API

This directory contains a Postman collection for testing the Employee Management API endpoints.

## Setup Instructions

1. Import the collection into Postman:

   - Open Postman
   - Click "Import" button
   - Select the `Employee Management API.postman_collection.json` file

2. Set up environment variables:
   - Create a new environment in Postman
   - Add the following variables:
     - `base_url`: http://localhost:5000
     - `admin_token`: (will be populated after login)
     - `employee_id`: (will be populated after creating an employee)

## Using the Collection

1. First, run the "Admin Login" request to authenticate and get a token
2. Copy the token from the response and paste it into the `admin_token` environment variable
3. Run the employee creation requests in order:
   - "1. Create Employee - Personal Info"
   - Copy the employee ID from the response and paste it into the `employee_id` environment variable
   - "2. Add Education Info"
   - "3. Add Professional Experience"
   - "4. Upload Document" (requires a PDF file)
   - "5. Set Work Information"
4. Finally, test the retrieval endpoints:
   - "6. Get Employee Overview"
   - "7. Get All Employees"

## Script Alternative

Alternatively, you can run the `addSampleEmployee.js` script in the `scripts` directory to automatically create a sample employee with all information.

To run the script:

```bash
cd ../scripts
node addSampleEmployee.js
```

This script will:

1. Log in as admin
2. Create an employee with personal information
3. Add education and professional experience
4. Set work information
5. Retrieve and display the employee overview
6. Retrieve and display all employees
