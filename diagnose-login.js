const axios = require('axios');

async function diagnoseLogin() {
  console.log('🔍 Diagnosing Login Issues\n');

  // Test all three users with a delay between requests
  const testUsers = [
    { name: 'Secretary', email: 'secretary@spantower27.org', password: 'SecretaryPass123!' },
    { name: 'Admin', email: 'admin@spantower27.org', password: 'AdminPassword123!' },
    { name: 'Resident', email: 'resident@spantower27.org', password: 'ResidentPass123!' }
  ];

  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    
    console.log(`🧪 Testing ${user.name} login:`);
    console.log(`   Email: ${user.email}`);
    
    try {
      const response = await axios.post('https://www.spantower27.org/api/auth/login', {
        email: user.email,
        password: user.password
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log('✅ SUCCESS');
      console.log(`   Status: ${response.status}`);
      console.log(`   User: ${response.data.user?.firstName} ${response.data.user?.lastName}`);
      console.log(`   Role: ${response.data.user?.role}`);
      console.log(`   Token received: ${!!response.data.token}`);

    } catch (error) {
      console.log('❌ FAILED');
      console.log(`   Status: ${error.response?.status || 'No response'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      
      if (error.response?.status === 429) {
        console.log('   ⚠️  Rate limited - waiting longer...');
      }
    }
    
    // Wait between requests to avoid rate limiting
    if (i < testUsers.length - 1) {
      console.log('   ⏳ Waiting 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('');
    }
  }

  console.log('📋 Diagnosis Summary:');
  console.log('If you see "SUCCESS" for any user, the API is working.');
  console.log('If you see "Rate limited", wait a few minutes and try again.');
  console.log('');
  console.log('🌐 To test in browser:');
  console.log('1. Go to https://www.spantower27.org');
  console.log('2. Open Developer Tools (F12)');
  console.log('3. Clear browser cache (Ctrl+F5)');
  console.log('4. Try logging in with:');
  console.log('   Email: secretary@spantower27.org');
  console.log('   Password: SecretaryPass123!');
  console.log('');
  console.log('If it still fails, check the Console tab for JavaScript errors.');
}

diagnoseLogin();
