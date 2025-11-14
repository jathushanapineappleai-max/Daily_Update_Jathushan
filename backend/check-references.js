const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Unit = require('./models/Unit');
const User = require('./models/User');
const UnitMaintenanceFee = require('./models/UnitMaintenanceFee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('MongoDB Connected for checking references...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const checkReferences = async () => {
  try {
    await connectDB();
    
    console.log('Checking maintenance fee references...');
    
    // Get all maintenance fees
    const fees = await UnitMaintenanceFee.find({});
    console.log(`Found ${fees.length} maintenance fees to check`);
    
    // Get all units and users for reference checking
    const units = await Unit.find({});
    const users = await User.find({});
    
    console.log(`Found ${units.length} units and ${users.length} users`);
    
    const unitIds = new Set(units.map(u => u._id.toString()));
    const userIds = new Set(users.map(u => u._id.toString()));
    
    let invalidUnitRefs = 0;
    let invalidUserRefs = 0;
    let nullUnitRefs = 0;
    let nullUserRefs = 0;
    
    for (const fee of fees) {
      // Check unit reference
      if (!fee.unit) {
        nullUnitRefs++;
        console.log(`Fee ${fee._id} has null unit reference`);
      } else if (!unitIds.has(fee.unit.toString())) {
        invalidUnitRefs++;
        console.log(`Fee ${fee._id} has invalid unit reference: ${fee.unit}`);
      }
      
      // Check generatedBy reference
      if (!fee.generatedBy) {
        nullUserRefs++;
        console.log(`Fee ${fee._id} has null generatedBy reference`);
      } else if (!userIds.has(fee.generatedBy.toString())) {
        invalidUserRefs++;
        console.log(`Fee ${fee._id} has invalid generatedBy reference: ${fee.generatedBy}`);
      }
    }
    
    console.log('\n=== REFERENCE CHECK SUMMARY ===');
    console.log(`Total fees: ${fees.length}`);
    console.log(`Null unit references: ${nullUnitRefs}`);
    console.log(`Invalid unit references: ${invalidUnitRefs}`);
    console.log(`Null generatedBy references: ${nullUserRefs}`);
    console.log(`Invalid generatedBy references: ${invalidUserRefs}`);
    
    // Test population with a single fee
    console.log('\n=== TESTING POPULATION ===');
    
    try {
      const testFee = await UnitMaintenanceFee.findOne()
        .populate('unit', 'unitNumber floor')
        .populate('generatedBy', 'firstName lastName');
      
      console.log('✅ Basic population test successful');
      console.log('Test fee unit:', testFee.unit?.unitNumber || 'NULL');
      console.log('Test fee generatedBy:', testFee.generatedBy?.firstName || 'NULL');
      
    } catch (popError) {
      console.log('❌ Basic population test failed:', popError.message);
    }
    
    // Test nested population
    try {
      const testFeeNested = await UnitMaintenanceFee.findOne()
        .populate({
          path: 'unit',
          select: 'unitNumber floor surfaceArea owner',
          populate: {
            path: 'owner',
            select: 'firstName lastName email'
          }
        });
      
      console.log('✅ Nested population test successful');
      console.log('Test fee unit:', testFeeNested.unit?.unitNumber || 'NULL');
      console.log('Test fee owner:', testFeeNested.unit?.owner?.firstName || 'NULL');
      
    } catch (nestedError) {
      console.log('❌ Nested population test failed:', nestedError.message);
      console.log('Error stack:', nestedError.stack);
    }
    
  } catch (error) {
    console.error('Error checking references:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

checkReferences();
