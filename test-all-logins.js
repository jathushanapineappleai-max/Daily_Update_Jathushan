const axios = require('axios');

async function testAllLogins() {
  console.log('🔐 Testing All Login Credentials\n');

  const testUsers = [
    {
      name: 'Administrator',
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!',
      expectedRole: 'administrator'
    },
    {
      name: 'President',
      email: 'president@spantower27.org',
      password: 'President123!',
      expectedRole: 'president'
    },
    {
      name: 'Secretary',
      email: 'secretary@spantower27.org',
      password: 'Secretary123!',
      expectedRole: 'secretary'
    },
    {
      name: 'Treasurer',
      email: 'treasurer@spantower27.org',
      password: 'Treasurer123!',
      expectedRole: 'treasurer'
    },
    {
      name: 'Council Member',
      email: 'council1@spantower27.org',
      password: 'Council123!',
      expectedRole: 'council'
    },
    {
      name: 'Resident',
      email: 'resident1@spantower27.org',
      password: 'Resident123!',
      expectedRole: 'resident'
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < testUsers.length; i++) {
    const testUser = testUsers[i];
    
    console.log(`👤 Testing ${testUser.name}:`);
    console.log(`   📧 Email: ${testUser.email}`);
    console.log(`   🔑 Password: ${testUser.password}`);
    
    try {
      const response = await axios.post('https://www.spantower27.org/api/auth/login', {
        email: testUser.email,
        password: testUser.password
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.success && response.data.token) {
        console.log('   ✅ LOGIN SUCCESSFUL');
        console.log(`   👤 User: ${response.data.user.firstName} ${response.data.user.lastName}`);
        console.log(`   🎭 Role: ${response.data.user.role}`);
        console.log(`   🟢 Active: ${response.data.user.isActive}`);
        console.log(`   🎫 Token: ${response.data.token.substring(0, 20)}...`);
        
        // Verify role matches expected
        if (response.data.user.role === testUser.expectedRole) {
          console.log('   ✅ Role matches expected');
        } else {
          console.log(`   ⚠️  Role mismatch: expected ${testUser.expectedRole}, got ${response.data.user.role}`);
        }
        
        successCount++;
      } else {
        console.log('   ❌ LOGIN FAILED - No token received');
        failCount++;
      }
      
    } catch (error) {
      console.log('   ❌ LOGIN FAILED');
      console.log(`   🚨 Status: ${error.response?.status || 'No response'}`);
      console.log(`   💬 Error: ${error.response?.data?.message || error.message}`);
      failCount++;
    }
    
    console.log(''); // Empty line for readability
    
    // Wait between requests to avoid rate limiting
    if (i < testUsers.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('📊 TEST SUMMARY:');
  console.log('=' .repeat(40));
  console.log(`✅ Successful logins: ${successCount}/${testUsers.length}`);
  console.log(`❌ Failed logins: ${failCount}/${testUsers.length}`);
  
  if (successCount === testUsers.length) {
    console.log('\n🎉 ALL LOGINS WORKING PERFECTLY!');
    console.log('🌐 You can now use any of these credentials at: https://www.spantower27.org');
  } else {
    console.log('\n⚠️  Some logins failed. Check the errors above.');
  }
  
  console.log('\n📋 WORKING CREDENTIALS:');
  console.log('👑 Administrator: admin@spantower27.org / AdminPassword123!');
  console.log('🏛️ President: president@spantower27.org / President123!');
  console.log('📝 Secretary: secretary@spantower27.org / Secretary123!');
  console.log('💰 Treasurer: treasurer@spantower27.org / Treasurer123!');
  console.log('🏛️ Council: council1@spantower27.org / Council123!');
  console.log('🏠 Resident: resident1@spantower27.org / Resident123!');
}

testAllLogins();
