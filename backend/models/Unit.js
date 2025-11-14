const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitNumber: {
    type: String,
    required: [true, 'Unit number is required'],
    unique: true,
    trim: true,
    maxlength: [10, 'Unit number cannot exceed 10 characters'],
    match: [/^[A-Z0-9-]+$/, 'Unit number can only contain letters, numbers, and hyphens']
  },
  floor: {
    type: Number,
    required: [true, 'Floor is required'],
    min: [-2, 'Floor cannot be below -2 (basement)'],
    max: [20, 'Floor cannot exceed 20']
  },
  unitType: {
    type: String,
    enum: ['studio', '1br', '2br', '3br', '4br', 'penthouse'],
    required: [true, 'Unit type is required']
  },
  surfaceArea: {
    type: Number,
    required: [true, 'Surface area is required'],
    min: [200, 'Surface area must be at least 200 sq ft'],
    max: [5000, 'Surface area cannot exceed 5000 sq ft']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Unit owner is required']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  specialCategories: [{
    category: {
      type: String,
      enum: [
        'additional_parking', 
        'balcony_premium', 
        'pool_access', 
        'gym_access', 
        'storage_unit',
        'garden_access',
        'rooftop_access',
        'concierge_service'
      ],
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Quantity cannot exceed 10']
    },
    monthlyFee: {
      type: Number,
      required: [true, 'Monthly fee is required for special category'],
      min: [0, 'Monthly fee cannot be negative'],
      max: [50000, 'Monthly fee cannot exceed LKR 50,000']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    }
  }],
  maintenanceRate: {
    type: Number,
    required: [true, 'Maintenance rate is required'],
    default: 150, // LKR per sq ft per month
    min: [50, 'Maintenance rate cannot be less than LKR 50 per sq ft'],
    max: [500, 'Maintenance rate cannot exceed LKR 500 per sq ft']
  },
  status: {
    type: String,
    enum: ['occupied', 'vacant', 'under_renovation', 'for_sale', 'for_rent'],
    default: 'occupied',
    required: true
  },
  occupancyDetails: {
    moveInDate: {
      type: Date
    },
    leaseEndDate: {
      type: Date
    },
    securityDeposit: {
      type: Number,
      min: 0
    },
    monthlyRent: {
      type: Number,
      min: 0
    }
  },
  unitFeatures: {
    balcony: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Number,
      default: 1,
      min: 0,
      max: 5
    },
    airConditioning: {
      type: Boolean,
      default: false
    },
    furnished: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating monthly base maintenance fee
unitSchema.virtual('monthlyBaseFee').get(function() {
  return this.surfaceArea * this.maintenanceRate;
});

// Virtual for calculating total special category fees
unitSchema.virtual('monthlySpecialFees').get(function() {
  return this.specialCategories.reduce((total, category) => {
    return total + (category.quantity * category.monthlyFee);
  }, 0);
});

// Virtual for calculating total monthly maintenance
unitSchema.virtual('totalMonthlyMaintenance').get(function() {
  return this.monthlyBaseFee + this.monthlySpecialFees;
});

// Virtual for full unit display name
unitSchema.virtual('displayName').get(function() {
  return `Unit ${this.unitNumber} (Floor ${this.floor})`;
});

// Indexes for performance
unitSchema.index({ unitNumber: 1 });
unitSchema.index({ floor: 1 });
unitSchema.index({ owner: 1 });
unitSchema.index({ tenant: 1 });
unitSchema.index({ status: 1 });
unitSchema.index({ isActive: 1 });
unitSchema.index({ createdAt: -1 });

// Pre-save middleware to validate special categories
unitSchema.pre('save', function(next) {
  // Ensure no duplicate special categories
  const categories = this.specialCategories.map(cat => cat.category);
  const uniqueCategories = [...new Set(categories)];
  
  if (categories.length !== uniqueCategories.length) {
    return next(new Error('Duplicate special categories are not allowed'));
  }
  
  next();
});

// Method to calculate maintenance for specific month/year
unitSchema.methods.calculateMaintenanceForPeriod = function(month, year) {
  const baseFee = this.monthlyBaseFee;
  const specialFees = this.monthlySpecialFees;

  return {
    baseRate: this.maintenanceRate,
    baseFee: baseFee,
    surfaceArea: this.surfaceArea,
    specialCategories: this.specialCategories.map(cat => ({
      name: cat.category,
      quantity: cat.quantity,
      unitFee: cat.monthlyFee,
      fee: cat.quantity * cat.monthlyFee,
      description: cat.description
    })),
    totalFee: baseFee + specialFees,
    totalAmount: baseFee + specialFees,
    period: { month, year }
  };
};

// Method to add special category
unitSchema.methods.addSpecialCategory = function(category, quantity, monthlyFee, description) {
  // Check if category already exists
  const existingCategory = this.specialCategories.find(cat => cat.category === category);
  if (existingCategory) {
    throw new Error(`Special category '${category}' already exists for this unit`);
  }
  
  this.specialCategories.push({
    category,
    quantity,
    monthlyFee,
    description
  });
  
  return this.save();
};

// Method to remove special category
unitSchema.methods.removeSpecialCategory = function(category) {
  this.specialCategories = this.specialCategories.filter(cat => cat.category !== category);
  return this.save();
};

// Static method to get units by floor
unitSchema.statics.getUnitsByFloor = function(floor) {
  return this.find({ floor, isActive: true }).populate('owner tenant', 'firstName lastName email');
};

// Static method to get vacant units
unitSchema.statics.getVacantUnits = function() {
  return this.find({ status: 'vacant', isActive: true }).populate('owner', 'firstName lastName email');
};

// Static method to get units with outstanding maintenance
unitSchema.statics.getUnitsWithOutstandingMaintenance = function() {
  // This will be implemented when we integrate with UnitMaintenanceFee model
  return this.find({ isActive: true }).populate('owner tenant', 'firstName lastName email');
};

module.exports = mongoose.model('Unit', unitSchema);
