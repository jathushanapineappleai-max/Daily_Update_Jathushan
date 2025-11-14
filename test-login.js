const axios = require('axios');

// Configure axios defaults
axios.defaults.baseURL = 'https://www.spantower27.org/api';
axios.defaults.timeout = 10000;

async function testLogin() {
  console.log('🔐 Testing Login Functionality\n');

  const testUsers = [
    {
      name: 'Administrator',
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!',
      expectedRole: 'administrator'
    },
    {
      name: 'Secretary',
      email: 'secretary@spantower27.org',
      password: 'SecretaryPass123!',
      expectedRole: 'secretary'
    },
    {
      name: 'Resident',
      email: 'resident@spantower27.org',
      password: 'ResidentPass123!',
      expectedRole: 'resident'
    }
  ];

  for (const testUser of testUsers) {
    try {
      console.log(`👤 Testing login for ${testUser.name}:`);
      console.log(`   Email: ${testUser.email}`);
      
      const response = await axios.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
      });

      if (response.data.success && response.data.token) {
        console.log('✅ Login successful');
        console.log(`   User: ${response.data.user.firstName} ${response.data.user.lastName}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Active: ${response.data.user.isActive}`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
        
        // Test API access with token
        try {
          const profileResponse = await axios.get('/auth/profile', {
            headers: { Authorization: `Bearer ${response.data.token}` }
          });
          console.log('✅ API access with token working');
          console.log(`   Profile retrieved: ${profileResponse.data.firstName} ${profileResponse.data.lastName}`);
        } catch (apiError) {
          console.log('❌ API access failed:', apiError.response?.data?.message || apiError.message);
        }
        
      } else {
        console.log('❌ Login failed - no token received');
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        console.log('   This might be due to incorrect credentials or account issues');
      }
    }
    
    console.log(''); // Empty line for readability
  }

  // Test invalid login
  console.log('🚫 Testing invalid login:');
  try {
    await axios.post('/auth/login', {
      email: 'invalid@spantower27.org',
      password: 'wrongpassword'
    });
    console.log('❌ Invalid login should have failed');
  } catch (error) {
    console.log('✅ Invalid login properly rejected:', error.response?.data?.message || error.message);
  }

  console.log('\n🎯 Login Test Summary:');
  console.log('If all tests passed, you can now login to the system at:');
  console.log('🌐 https://www.spantower27.org');
  console.log('\n📋 Available Login Credentials:');
  console.log('👑 Administrator: admin@spantower27.org / AdminPassword123!');
  console.log('📝 Secretary: secretary@spantower27.org / SecretaryPass123!');
  console.log('🏠 Resident: resident@spantower27.org / ResidentPass123!');
}

testLogin();
