const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Server configuration
const BASE_URL = 'http://localhost:5000';
const ADMIN_IDENTIFIER = 'admin@pai-erp.com';
const ADMIN_PASSWORD = 'Admin@123';

async function addSampleEmployee() {
  try {
    console.log('🚀 Starting sample employee creation process...\n');

    // Step 1: Admin Login
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      identifier: ADMIN_IDENTIFIER,
      password: ADMIN_PASSWORD
    });

    const adminToken = loginResponse.data.token;
    console.log('✅ Admin logged in successfully\n');

    // Step 2: Create Employee - Personal Information
    console.log('2️⃣ Creating employee personal information...');
    const personalData = {
      first_name: "Robert",
      last_name: "Wilson",
      email: "robert.wilson@example.com",
      emp_id: "EMP009",
      gender: "male",
      dob: "1987-09-30",
      phone: "+1222333444",
      address: "987 Cedar St, Big City, Country",
      password: "securePassword222"
    };

    const personalResponse = await axios.post(
      `${BASE_URL}/api/employees/personal`,
      personalData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const userId = personalResponse.data.data.user_id;
    console.log(`✅ Employee personal info created with ID: ${userId}\n`);

    // Step 3: Add Education Information
    console.log('3️⃣ Adding education information...');
    const educationData = {
      qualification: "PhD in Physics",
      institution: "Science University",
      year_of_completion: 2014
    };

    await axios.post(
      `${BASE_URL}/api/employees/${userId}/education`,
      educationData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Education information added\n');

    // Step 4: Add Professional Experience
    console.log('4️⃣ Adding professional experience...');
    const professionalData = {
      position: "Research Scientist",
      company_name: "Research Labs Inc.",
      years_of_experience: 9.5
    };

    await axios.post(
      `${BASE_URL}/api/employees/${userId}/professional`,
      professionalData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Professional experience added\n');

    // Step 5: Set Work Information
    console.log('5️⃣ Setting work information...');
    const workData = {
      joined_date: "2023-11-25",
      designation: "Senior Research Scientist",
      department_id: null, // Skip department for now
      management_role: "Research Lead",
      report_to: null
    };

    await axios.post(
      `${BASE_URL}/api/employees/${userId}/work-info`,
      workData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Work information set\n');

    // Step 6: Get Employee Overview
    console.log('6️⃣ Retrieving employee overview...');
    const overviewResponse = await axios.get(
      `${BASE_URL}/api/employees/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );

    console.log('✅ Employee overview retrieved successfully\n');
    console.log('📋 EMPLOYEE OVERVIEW:');
    console.log(JSON.stringify(overviewResponse.data, null, 2));

    // Step 7: Get All Employees
    console.log('\n7️⃣ Retrieving all employees...');
    const allEmployeesResponse = await axios.get(
      `${BASE_URL}/api/employees`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );

    console.log('✅ All employees retrieved successfully\n');
    console.log('📋 ALL EMPLOYEES:');
    console.log(JSON.stringify(allEmployeesResponse.data, null, 2));

    console.log('\n🎉 Sample employee creation process completed successfully!');
  } catch (error) {
    console.error('❌ Error during employee creation:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Run the script
addSampleEmployee();