const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminPassword() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spantower27');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    const admin = await User.findOne({ email: 'admin@spantower27.org' }).select('+password');
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('📋 Admin user found:');
    console.log('   Name:', admin.firstName, admin.lastName);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Password hash exists:', !!admin.password);
    
    // Test current password
    const testPassword = 'AdminPassword123!';
    console.log('\n🔑 Testing password:', testPassword);
    
    let isValid = false;
    try {
      isValid = await admin.comparePassword(testPassword);
      console.log('   Current password test:', isValid ? '✅ Valid' : '❌ Invalid');
    } catch (error) {
      console.log('   Error testing password:', error.message);
    }
    
    if (!isValid) {
      console.log('\n🔧 Fixing admin password...');
      admin.password = testPassword;
      await admin.save();
      console.log('✅ Password updated');
      
      // Test the fixed password
      const updatedAdmin = await User.findOne({ email: 'admin@spantower27.org' }).select('+password');
      const isValidNow = await updatedAdmin.comparePassword(testPassword);
      console.log('   New password test:', isValidNow ? '✅ Valid' : '❌ Still invalid');
      
      if (isValidNow) {
        console.log('\n🎉 Admin password fixed successfully!');
        console.log('📧 Email: admin@spantower27.org');
        console.log('🔑 Password: AdminPassword123!');
      }
    } else {
      console.log('\n✅ Admin password is already correct!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixAdminPassword();
