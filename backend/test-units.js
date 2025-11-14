const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Unit = require('./models/Unit');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('MongoDB Connected for testing...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const testUnits = async () => {
  try {
    await connectDB();
    
    console.log('Testing unit functionality...');
    
    // Count total units
    const totalUnits = await Unit.countDocuments();
    console.log(`Total units in database: ${totalUnits}`);
    
    if (totalUnits === 0) {
      console.log('No units found. Please run the seed script first.');
      return;
    }
    
    // Get first 5 units
    const sampleUnits = await Unit.find().limit(5).populate('owner', 'firstName lastName email');
    console.log('\nSample units:');
    sampleUnits.forEach(unit => {
      console.log(`- Unit ${unit.unitNumber}: ${unit.unitType}, ${unit.surfaceArea} sq ft, Floor ${unit.floor}`);
      console.log(`  Owner: ${unit.owner?.firstName} ${unit.owner?.lastName}`);
      console.log(`  Monthly maintenance: LKR ${unit.totalMonthlyMaintenance}`);
    });
    
    // Test unit calculation
    const testUnit = sampleUnits[0];
    if (testUnit) {
      const calculation = testUnit.calculateMaintenanceForPeriod(11, 2024);
      console.log(`\nMaintenance calculation for Unit ${testUnit.unitNumber} (Nov 2024):`);
      console.log(`- Base fee: LKR ${calculation.baseFee.amount}`);
      console.log(`- Special categories: ${calculation.specialCategories.length}`);
      console.log(`- Total amount: LKR ${calculation.totalAmount}`);
    }
    
    // Get units by floor
    const floor1Units = await Unit.find({ floor: 1 });
    console.log(`\nUnits on floor 1: ${floor1Units.length}`);
    
    // Get units by type
    const penthouseUnits = await Unit.find({ unitType: 'penthouse' });
    console.log(`Penthouse units: ${penthouseUnits.length}`);
    
    console.log('\n✅ Unit testing completed successfully!');
    
  } catch (error) {
    console.error('Error testing units:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

testUnits();
