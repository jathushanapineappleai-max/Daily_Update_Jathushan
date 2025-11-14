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
    console.log('MongoDB Connected for maintenance testing...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const testMaintenanceFees = async () => {
  try {
    await connectDB();
    
    console.log('Testing maintenance fee functionality...');
    
    // Get a test user (treasurer)
    const treasurer = await User.findOne({ role: 'treasurer' });
    if (!treasurer) {
      console.log('No treasurer found. Cannot test fee generation.');
      return;
    }
    
    console.log(`Using treasurer: ${treasurer.firstName} ${treasurer.lastName}`);
    
    // Check if fees already exist for November 2024
    const existingFees = await UnitMaintenanceFee.countDocuments({
      'billingPeriod.month': 11,
      'billingPeriod.year': 2024
    });
    
    console.log(`Existing fees for Nov 2024: ${existingFees}`);
    
    if (existingFees === 0) {
      console.log('Generating maintenance fees for November 2024...');
      
      // Get all active units
      const units = await Unit.find({ isActive: true });
      console.log(`Found ${units.length} active units`);
      
      let generatedCount = 0;
      
      // Generate fees for first 5 units as a test
      for (let i = 0; i < Math.min(5, units.length); i++) {
        const unit = units[i];
        
        try {
          const calculation = unit.calculateMaintenanceForPeriod(11, 2024);
          
          // Calculate due date (5th of the month)
          const dueDate = new Date(2024, 10, 5); // November 5, 2024
          
          const maintenanceFee = new UnitMaintenanceFee({
            unit: unit._id,
            billingPeriod: { month: 11, year: 2024 },
            feeBreakdown: calculation,
            totalAmount: calculation.totalAmount,
            dueDate,
            generatedBy: treasurer._id
          });

          await maintenanceFee.save();
          generatedCount++;
          
          console.log(`✅ Generated fee for Unit ${unit.unitNumber}: LKR ${calculation.totalAmount}`);
          
        } catch (error) {
          console.error(`❌ Error generating fee for unit ${unit.unitNumber}:`, error.message);
        }
      }
      
      console.log(`\nGenerated ${generatedCount} maintenance fees`);
    }
    
    // Test fee retrieval
    const fees = await UnitMaintenanceFee.find({
      'billingPeriod.month': 11,
      'billingPeriod.year': 2024
    }).populate('unit', 'unitNumber floor surfaceArea').limit(5);
    
    console.log('\nSample maintenance fees:');
    fees.forEach(fee => {
      console.log(`- Unit ${fee.unit.unitNumber}: LKR ${fee.totalAmount} (${fee.status})`);
      console.log(`  Due: ${fee.dueDate.toDateString()}`);
      console.log(`  Base fee: LKR ${fee.feeBreakdown.baseFee.amount}`);
      console.log(`  Special categories: ${fee.feeBreakdown.specialCategories.length}`);
    });
    
    // Test payment recording
    if (fees.length > 0) {
      const testFee = fees[0];
      console.log(`\nTesting payment for Unit ${testFee.unit.unitNumber}...`);
      
      if (testFee.status === 'pending') {
        const paymentData = {
          amount: testFee.totalAmount,
          paidDate: new Date(),
          paymentMethod: 'bank_transfer',
          referenceNumber: 'TEST-PAY-001',
          paidBy: treasurer._id,
          receivedBy: treasurer._id,
          notes: 'Test payment'
        };

        await testFee.addPayment(paymentData);
        console.log(`✅ Payment recorded: LKR ${paymentData.amount}`);
        console.log(`   Status: ${testFee.status}`);
        console.log(`   Remaining: LKR ${testFee.paymentDetails.remainingAmount}`);
      } else {
        console.log(`Fee already paid or processed`);
      }
    }
    
    // Test overdue fees
    const overdueFees = await UnitMaintenanceFee.find({
      dueDate: { $lt: new Date() },
      status: { $in: ['pending', 'partially_paid'] }
    }).populate('unit', 'unitNumber');
    
    console.log(`\nOverdue fees: ${overdueFees.length}`);
    
    // Test dashboard stats
    const stats = await UnitMaintenanceFee.aggregate([
      {
        $match: {
          'billingPeriod.month': 11,
          'billingPeriod.year': 2024
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paymentDetails.paidAmount' }
        }
      }
    ]);
    
    console.log('\nDashboard stats for Nov 2024:');
    stats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} fees, Total: LKR ${stat.totalAmount}, Paid: LKR ${stat.paidAmount}`);
    });
    
    console.log('\n✅ Maintenance fee testing completed successfully!');
    
  } catch (error) {
    console.error('Error testing maintenance fees:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

testMaintenanceFees();
