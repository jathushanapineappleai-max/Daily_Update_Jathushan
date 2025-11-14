const axios = require('axios');

async function testAPILogin() {
  console.log('🔐 Testing API Login Directly\n');

  const testCredentials = {
    email: 'secretary@spantower27.org',
    password: 'SecretaryPass123!'
  };

  try {
    console.log('📤 Sending login request...');
    console.log(`   Email: ${testCredentials.email}`);
    console.log(`   Password: ${testCredentials.password}`);
    
    const response = await axios.post('https://www.spantower27.org/api/auth/login', testCredentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('\n✅ Login successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${response.data.success}`);
    console.log(`   User: ${response.data.user?.firstName} ${response.data.user?.lastName}`);
    console.log(`   Role: ${response.data.user?.role}`);
    console.log(`   Token: ${response.data.token?.substring(0, 20)}...`);

  } catch (error) {
    console.log('\n❌ Login failed!');
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Message: ${error.response?.data?.message || error.message}`);
    console.log(`   Full response:`, JSON.stringify(error.response?.data, null, 2));
  }

  // Also test admin login
  console.log('\n🔐 Testing Admin Login...');
  try {
    const adminResponse = await axios.post('https://www.spantower27.org/api/auth/login', {
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!'
    });

    console.log('✅ Admin login successful!');
    console.log(`   User: ${adminResponse.data.user?.firstName} ${adminResponse.data.user?.lastName}`);
    console.log(`   Role: ${adminResponse.data.user?.role}`);

  } catch (error) {
    console.log('❌ Admin login failed!');
    console.log(`   Message: ${error.response?.data?.message || error.message}`);
  }
}

testAPILogin();
