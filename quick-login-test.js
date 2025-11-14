const axios = require('axios');

async function quickLoginTest() {
  console.log('🔐 Quick Login Test\n');

  try {
    console.log('Testing admin login...');
    const response = await axios.post('https://www.spantower27.org/api/auth/login', {
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!'
    }, {
      timeout: 10000
    });

    if (response.data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log(`User: ${response.data.user.firstName} ${response.data.user.lastName}`);
      console.log(`Role: ${response.data.user.role}`);
      console.log('🎉 You can now login to the website!');
    } else {
      console.log('❌ Login failed - no success flag');
    }

  } catch (error) {
    console.log('❌ LOGIN FAILED');
    console.log(`Status: ${error.response?.status}`);
    console.log(`Message: ${error.response?.data?.message || error.message}`);
    
    if (error.response?.status === 429) {
      console.log('\n⏳ Rate limited. Please wait 2-3 minutes and try again.');
      console.log('💡 Tip: Clear your browser cache and try in incognito mode.');
    }
  }
}

quickLoginTest();
