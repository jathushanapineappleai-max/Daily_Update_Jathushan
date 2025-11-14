const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spantower27');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Test users with their expected passwords
    const testUsers = [
      { email: 'admin@spantower27.org', password: 'AdminPassword123!', role: 'administrator' },
      { email: 'secretary@spantower27.org', password: 'SecretaryPass123!', role: 'secretary' },
      { email: 'resident@spantower27.org', password: 'ResidentPass123!', role: 'resident' }
    ];
    
    for (const testUser of testUsers) {
      console.log(`\n🔍 Checking user: ${testUser.email}`);
      
      const user = await User.findOne({ email: testUser.email }).select('+password');
      if (!user) {
        console.log(`❌ User not found: ${testUser.email}`);
        continue;
      }
      
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      
      // Test current password
      let isValid = false;
      try {
        isValid = await user.comparePassword(testUser.password);
        console.log(`   Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      } catch (error) {
        console.log(`   Password test error: ${error.message}`);
      }
      
      if (!isValid) {
        console.log('   🔧 Fixing password...');
        user.password = testUser.password;
        await user.save();
        console.log('   ✅ Password updated');
        
        // Verify the fix
        const updatedUser = await User.findOne({ email: testUser.email }).select('+password');
        const isValidNow = await updatedUser.comparePassword(testUser.password);
        console.log(`   Verification: ${isValidNow ? '✅ Fixed' : '❌ Still broken'}`);
      }
    }
    
    console.log('\n🎉 Password fix completed!');
    console.log('\n📋 Login Credentials:');
    console.log('👑 Administrator: admin@spantower27.org / AdminPassword123!');
    console.log('📝 Secretary: secretary@spantower27.org / SecretaryPass123!');
    console.log('🏠 Resident: resident@spantower27.org / ResidentPass123!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixPasswords();
