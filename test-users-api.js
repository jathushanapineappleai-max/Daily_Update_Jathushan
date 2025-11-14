const axios = require('axios');

async function testUsersAPI() {
  console.log('🧪 Testing Users API\n');

  try {
    // First login to get token
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('https://www.spantower27.org/api/auth/login', {
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Test users API
    console.log('\n2. Testing /api/users endpoint...');
    const usersResponse = await axios.get('https://www.spantower27.org/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Users API successful');
    console.log('📊 Response structure:');
    console.log('   - users array length:', usersResponse.data.users?.length || 0);
    console.log('   - totalPages:', usersResponse.data.totalPages);
    console.log('   - currentPage:', usersResponse.data.currentPage);
    console.log('   - total:', usersResponse.data.total);

    if (usersResponse.data.users && usersResponse.data.users.length > 0) {
      console.log('\n👥 Sample user data:');
      const sampleUser = usersResponse.data.users[0];
      console.log('   - Name:', sampleUser.firstName, sampleUser.lastName);
      console.log('   - Email:', sampleUser.email);
      console.log('   - Role:', sampleUser.role);
      console.log('   - Active:', sampleUser.isActive);
    }

    console.log('\n🎉 API is working correctly!');
    console.log('The issue might be in the frontend axios configuration or CORS.');

  } catch (error) {
    console.log('❌ API Test Failed');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data);
  }
}

testUsersAPI();
