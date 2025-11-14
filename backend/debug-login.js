const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugLogin() {
  try {
    console.log('🔍 Debugging Login Issue\n');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spantower27');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Get admin user
    const admin = await User.findOne({ email: 'admin@spantower27.org' }).select('+password');
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('📋 Admin user details:');
    console.log('   Name:', admin.firstName, admin.lastName);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Password hash:', admin.password ? 'EXISTS' : 'MISSING');
    console.log('   Password length:', admin.password?.length || 0);
    
    // Test password manually
    const testPassword = 'AdminPassword123!';
    console.log('\n🔑 Testing password manually:');
    console.log('   Test password:', testPassword);
    
    // Direct bcrypt comparison
    if (admin.password) {
      const directCompare = await bcrypt.compare(testPassword, admin.password);
      console.log('   Direct bcrypt compare:', directCompare ? '✅ MATCH' : '❌ NO MATCH');
    }
    
    // Using model method
    try {
      const modelCompare = await admin.comparePassword(testPassword);
      console.log('   Model comparePassword:', modelCompare ? '✅ MATCH' : '❌ NO MATCH');
    } catch (error) {
      console.log('   Model comparePassword ERROR:', error.message);
    }
    
    // Check if password is already hashed
    const isHashed = admin.password && admin.password.startsWith('$2');
    console.log('   Password appears hashed:', isHashed ? 'YES' : 'NO');
    
    if (!isHashed) {
      console.log('\n🔧 Password is not hashed! Fixing...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      admin.password = hashedPassword;
      await admin.save();
      console.log('✅ Password hashed and saved');
      
      // Test again
      const retestAdmin = await User.findOne({ email: 'admin@spantower27.org' }).select('+password');
      const retestCompare = await retestAdmin.comparePassword(testPassword);
      console.log('   Retest result:', retestCompare ? '✅ MATCH' : '❌ NO MATCH');
    }
    
    console.log('\n🎯 Login should now work with:');
    console.log('   Email: admin@spantower27.org');
    console.log('   Password: AdminPassword123!');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debugLogin();
