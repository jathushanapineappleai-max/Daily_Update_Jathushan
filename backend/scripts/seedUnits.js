const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Unit = require('../models/Unit');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('MongoDB Connected for unit seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Generate unit data for SpanTower27 (88 units across 20 floors)
const generateUnits = async () => {
  try {
    // Check if units already exist
    const existingUnits = await Unit.countDocuments();
    if (existingUnits > 0) {
      console.log('Units already exist, skipping unit seeding...');
      return;
    }

    // Get existing users to assign as owners
    const users = await User.find({ role: { $in: ['resident', 'council', 'treasurer', 'secretary', 'president'] } });
    if (users.length === 0) {
      console.log('No users found. Please run user seeding first.');
      return;
    }

    console.log(`Found ${users.length} users to assign as unit owners`);

    const units = [];
    let unitCounter = 0;

    // Floor configuration for SpanTower27
    const floorConfig = {
      // Basement levels (-2 to -1): Parking and storage
      '-2': { unitsPerFloor: 0, unitTypes: [] },
      '-1': { unitsPerFloor: 0, unitTypes: [] },
      // Ground floor (0): Commercial/lobby
      '0': { unitsPerFloor: 0, unitTypes: [] },
      // Floors 1-20: Residential units
      '1-5': { unitsPerFloor: 4, unitTypes: ['2br', '3br'] }, // Lower floors: 4 units each
      '6-15': { unitsPerFloor: 5, unitTypes: ['1br', '2br', '3br'] }, // Mid floors: 5 units each
      '16-19': { unitsPerFloor: 4, unitTypes: ['3br', '4br'] }, // Upper floors: 4 units each
      '20': { unitsPerFloor: 4, unitTypes: ['penthouse'] } // Top floor: Penthouses
    };

    // Special categories with their fees
    const specialCategories = [
      { category: 'additional_parking', fee: 5000 },
      { category: 'balcony_premium', fee: 3000 },
      { category: 'pool_access', fee: 2500 },
      { category: 'gym_access', fee: 2000 },
      { category: 'storage_unit', fee: 1500 },
      { category: 'garden_access', fee: 2000 },
      { category: 'rooftop_access', fee: 4000 },
      { category: 'concierge_service', fee: 3500 }
    ];

    // Surface area ranges by unit type
    const surfaceAreaRanges = {
      'studio': { min: 400, max: 600 },
      '1br': { min: 600, max: 800 },
      '2br': { min: 800, max: 1200 },
      '3br': { min: 1200, max: 1600 },
      '4br': { min: 1600, max: 2200 },
      'penthouse': { min: 2200, max: 3500 }
    };

    // Generate units for floors 1-20
    for (let floor = 1; floor <= 20; floor++) {
      let unitsPerFloor, unitTypes;

      if (floor <= 5) {
        unitsPerFloor = 4;
        unitTypes = ['2br', '3br'];
      } else if (floor <= 15) {
        unitsPerFloor = 5;
        unitTypes = ['1br', '2br', '3br'];
      } else if (floor <= 19) {
        unitsPerFloor = 4;
        unitTypes = ['3br', '4br'];
      } else {
        unitsPerFloor = 4;
        unitTypes = ['penthouse'];
      }

      for (let unitOnFloor = 1; unitOnFloor <= unitsPerFloor; unitOnFloor++) {
        if (unitCounter >= 88) break; // Limit to 88 units

        const unitNumber = `${floor}${unitOnFloor.toString().padStart(2, '0')}`;
        const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
        const surfaceRange = surfaceAreaRanges[unitType];
        const surfaceArea = Math.floor(Math.random() * (surfaceRange.max - surfaceRange.min + 1)) + surfaceRange.min;
        
        // Assign random owner from available users
        const owner = users[unitCounter % users.length];
        
        // Randomly assign tenant (30% chance)
        const tenant = Math.random() < 0.3 ? users[Math.floor(Math.random() * users.length)] : null;
        
        // Maintenance rate varies by floor and unit type
        let maintenanceRate = 150; // Base rate
        if (floor >= 16) maintenanceRate = 200; // Premium floors
        if (unitType === 'penthouse') maintenanceRate = 250; // Penthouse premium
        if (floor <= 5) maintenanceRate = 120; // Lower floors discount

        // Randomly assign special categories (20% chance for each)
        const unitSpecialCategories = [];
        specialCategories.forEach(special => {
          if (Math.random() < 0.2) { // 20% chance
            unitSpecialCategories.push({
              category: special.category,
              quantity: 1,
              monthlyFee: special.fee,
              description: `${special.category.replace('_', ' ')} for unit ${unitNumber}`
            });
          }
        });

        // Unit status distribution
        const statusOptions = ['occupied', 'vacant', 'under_renovation'];
        const statusWeights = [0.85, 0.10, 0.05]; // 85% occupied, 10% vacant, 5% renovation
        const randomValue = Math.random();
        let status = 'occupied';
        if (randomValue < statusWeights[2]) status = 'under_renovation';
        else if (randomValue < statusWeights[1] + statusWeights[2]) status = 'vacant';

        const unit = {
          unitNumber,
          floor,
          unitType,
          surfaceArea,
          owner: owner._id,
          tenant: tenant ? tenant._id : null,
          specialCategories: unitSpecialCategories,
          maintenanceRate,
          status,
          occupancyDetails: {
            moveInDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            securityDeposit: surfaceArea * 100, // LKR 100 per sq ft
            monthlyRent: status === 'occupied' && tenant ? surfaceArea * 80 : null
          },
          unitFeatures: {
            balcony: Math.random() < 0.7, // 70% have balcony
            parking: Math.floor(Math.random() * 3) + 1, // 1-3 parking spots
            airConditioning: Math.random() < 0.8, // 80% have AC
            furnished: Math.random() < 0.4 // 40% furnished
          },
          notes: `Unit ${unitNumber} - ${unitType} on floor ${floor}`
        };

        units.push(unit);
        unitCounter++;
      }

      if (unitCounter >= 88) break;
    }

    console.log(`Generated ${units.length} units`);

    // Insert units into database
    console.log('Creating units...');
    for (const unitData of units) {
      const unit = new Unit(unitData);
      await unit.save();
      console.log(`Created unit: ${unit.unitNumber} (${unit.unitType}) - Floor ${unit.floor} - ${unit.surfaceArea} sq ft`);
    }

    console.log('Units seeded successfully!');

    // Display summary
    const summary = await Unit.aggregate([
      {
        $group: {
          _id: '$unitType',
          count: { $sum: 1 },
          avgSurfaceArea: { $avg: '$surfaceArea' },
          totalSurfaceArea: { $sum: '$surfaceArea' }
        }
      }
    ]);

    console.log('\n=== UNIT SUMMARY ===');
    summary.forEach(item => {
      console.log(`${item._id}: ${item.count} units, Avg: ${Math.round(item.avgSurfaceArea)} sq ft, Total: ${item.totalSurfaceArea} sq ft`);
    });

    const totalUnits = await Unit.countDocuments();
    const totalSurfaceArea = await Unit.aggregate([
      { $group: { _id: null, total: { $sum: '$surfaceArea' } } }
    ]);

    console.log(`\nTotal Units: ${totalUnits}`);
    console.log(`Total Surface Area: ${totalSurfaceArea[0]?.total || 0} sq ft`);
    console.log(`Average Monthly Maintenance: LKR ${Math.round((totalSurfaceArea[0]?.total || 0) * 150)}`);

  } catch (error) {
    console.error('Error seeding units:', error);
  }
};

const seedUnits = async () => {
  try {
    await connectDB();
    
    console.log('Starting unit seeding...');
    
    await generateUnits();
    
    console.log('Unit seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding units:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedUnits();
}

module.exports = { seedUnits };
