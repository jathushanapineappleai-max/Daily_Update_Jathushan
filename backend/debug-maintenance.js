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
    console.log('MongoDB Connected for debugging...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const debugMaintenanceFees = async () => {
  try {
    await connectDB();
    
    console.log('Debugging maintenance fees...');
    
    // Get a sample maintenance fee
    const sampleFee = await UnitMaintenanceFee.findOne();
    
    if (!sampleFee) {
      console.log('No maintenance fees found');
      return;
    }
    
    console.log('Sample fee structure:');
    console.log('ID:', sampleFee._id);
    console.log('Total amount:', sampleFee.totalAmount);
    console.log('Payment details:', sampleFee.paymentDetails);
    console.log('Fee breakdown:', sampleFee.feeBreakdown);
    
    // Test the aggregation that's failing
    console.log('\nTesting aggregation...');
    
    const filter = {};
    const summary = await UnitMaintenanceFee.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalFees: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: { $ifNull: ['$paymentDetails.paidAmount', 0] } },
          totalOutstanding: { $sum: { $ifNull: ['$paymentDetails.remainingAmount', '$totalAmount'] } },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);
    
    console.log('Aggregation result:', summary);
    
    // Test getting fees with population
    console.log('\nTesting fee retrieval with population...');
    
    const fees = await UnitMaintenanceFee.find()
      .populate({
        path: 'unit',
        select: 'unitNumber floor surfaceArea owner',
        populate: {
          path: 'owner',
          select: 'firstName lastName email phone'
        }
      })
      .populate('generatedBy', 'firstName lastName')
      .limit(3);
    
    console.log(`Found ${fees.length} fees`);
    fees.forEach((fee, index) => {
      console.log(`Fee ${index + 1}:`, {
        id: fee._id,
        unit: fee.unit?.unitNumber,
        amount: fee.totalAmount,
        status: fee.status,
        paymentDetails: fee.paymentDetails
      });
    });
    
    console.log('\n✅ Debugging completed successfully!');
    
  } catch (error) {
    console.error('Error debugging maintenance fees:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

debugMaintenanceFees();
