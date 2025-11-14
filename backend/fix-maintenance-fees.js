const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const UnitMaintenanceFee = require('./models/UnitMaintenanceFee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('MongoDB Connected for fixing maintenance fees...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const fixMaintenanceFees = async () => {
  try {
    await connectDB();
    
    console.log('Fixing maintenance fees...');
    
    // Get all maintenance fees
    const fees = await UnitMaintenanceFee.find({});
    console.log(`Found ${fees.length} maintenance fees to fix`);
    
    let fixedCount = 0;
    
    for (const fee of fees) {
      let needsUpdate = false;
      
      // Fix paymentDetails if missing or incomplete
      if (!fee.paymentDetails) {
        fee.paymentDetails = {
          paidAmount: 0,
          remainingAmount: fee.totalAmount,
          payments: []
        };
        needsUpdate = true;
      } else {
        if (!fee.paymentDetails.payments) {
          fee.paymentDetails.payments = [];
          needsUpdate = true;
        }
        if (fee.paymentDetails.paidAmount === undefined) {
          fee.paymentDetails.paidAmount = 0;
          needsUpdate = true;
        }
        if (fee.paymentDetails.remainingAmount === undefined) {
          fee.paymentDetails.remainingAmount = fee.totalAmount;
          needsUpdate = true;
        }
      }
      
      // Fix feeBreakdown if missing adjustments
      if (!fee.feeBreakdown.adjustments) {
        fee.feeBreakdown.adjustments = [];
        needsUpdate = true;
      }
      
      // Fix specialCategories if missing
      if (!fee.feeBreakdown.specialCategories) {
        fee.feeBreakdown.specialCategories = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        // Save without triggering pre-save middleware to avoid the reduce error
        await UnitMaintenanceFee.updateOne(
          { _id: fee._id },
          {
            $set: {
              paymentDetails: fee.paymentDetails,
              'feeBreakdown.adjustments': fee.feeBreakdown.adjustments,
              'feeBreakdown.specialCategories': fee.feeBreakdown.specialCategories
            }
          }
        );
        fixedCount++;
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} maintenance fees`);
    
    // Test a simple query to see if it works now
    console.log('\nTesting query after fix...');
    const testFees = await UnitMaintenanceFee.find({}).limit(3);
    console.log(`Successfully queried ${testFees.length} fees`);
    
    testFees.forEach((fee, index) => {
      console.log(`Fee ${index + 1}:`, {
        id: fee._id,
        totalAmount: fee.totalAmount,
        paymentDetails: fee.paymentDetails,
        adjustments: fee.feeBreakdown.adjustments?.length || 0,
        specialCategories: fee.feeBreakdown.specialCategories?.length || 0
      });
    });
    
  } catch (error) {
    console.error('Error fixing maintenance fees:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

fixMaintenanceFees();
