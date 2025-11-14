const Unit = require('../models/Unit');
const User = require('../models/User');
const UnitMaintenanceFee = require('../models/UnitMaintenanceFee');

// Get all units with pagination and filtering
exports.getUnits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.floor) {
      filter.floor = parseInt(req.query.floor);
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.unitType) {
      filter.unitType = req.query.unitType;
    }
    
    if (req.query.search) {
      filter.$or = [
        { unitNumber: { $regex: req.query.search, $options: 'i' } },
        { notes: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get units with population
    const units = await Unit.find(filter)
      .populate('owner', 'firstName lastName email phone')
      .populate('tenant', 'firstName lastName email phone')
      .sort({ floor: 1, unitNumber: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUnits = await Unit.countDocuments(filter);
    const totalPages = Math.ceil(totalUnits / limit);

    // Calculate summary statistics
    const summary = await Unit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: 1 },
          totalSurfaceArea: { $sum: '$surfaceArea' },
          averageSurfaceArea: { $avg: '$surfaceArea' },
          totalMonthlyMaintenance: { $sum: { $multiply: ['$surfaceArea', '$maintenanceRate'] } },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);

    res.json({
      success: true,
      units,
      pagination: {
        currentPage: page,
        totalPages,
        totalUnits,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: summary.length > 0 ? summary[0] : null
    });

  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch units',
      error: error.message
    });
  }
};

// Get single unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await Unit.findById(id)
      .populate('owner', 'firstName lastName email phone unitNumber')
      .populate('tenant', 'firstName lastName email phone');

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    // Get recent maintenance fees for this unit
    const recentFees = await UnitMaintenanceFee.find({ unit: id })
      .sort({ 'billingPeriod.year': -1, 'billingPeriod.month': -1 })
      .limit(6)
      .populate('generatedBy', 'firstName lastName');

    res.json({
      success: true,
      unit,
      recentMaintenanceFees: recentFees
    });

  } catch (error) {
    console.error('Get unit by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unit',
      error: error.message
    });
  }
};

// Create new unit
exports.createUnit = async (req, res) => {
  try {
    const {
      unitNumber,
      floor,
      unitType,
      surfaceArea,
      owner,
      tenant,
      specialCategories,
      maintenanceRate,
      status,
      occupancyDetails,
      unitFeatures,
      notes
    } = req.body;

    // Check if unit number already exists
    const existingUnit = await Unit.findOne({ unitNumber });
    if (existingUnit) {
      return res.status(400).json({
        success: false,
        message: 'Unit number already exists'
      });
    }

    // Verify owner exists
    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(400).json({
        success: false,
        message: 'Owner user not found'
      });
    }

    // Verify tenant exists if provided
    if (tenant) {
      const tenantUser = await User.findById(tenant);
      if (!tenantUser) {
        return res.status(400).json({
          success: false,
          message: 'Tenant user not found'
        });
      }
    }

    const unit = new Unit({
      unitNumber,
      floor,
      unitType,
      surfaceArea,
      owner,
      tenant,
      specialCategories: specialCategories || [],
      maintenanceRate: maintenanceRate || 150,
      status: status || 'occupied',
      occupancyDetails: occupancyDetails || {},
      unitFeatures: unitFeatures || {},
      notes
    });

    await unit.save();
    await unit.populate('owner', 'firstName lastName email');
    if (unit.tenant) {
      await unit.populate('tenant', 'firstName lastName email');
    }

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      unit
    });

  } catch (error) {
    console.error('Create unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create unit',
      error: error.message
    });
  }
};

// Update unit
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // If updating owner, verify user exists
    if (updateData.owner) {
      const ownerUser = await User.findById(updateData.owner);
      if (!ownerUser) {
        return res.status(400).json({
          success: false,
          message: 'Owner user not found'
        });
      }
    }

    // If updating tenant, verify user exists
    if (updateData.tenant) {
      const tenantUser = await User.findById(updateData.tenant);
      if (!tenantUser) {
        return res.status(400).json({
          success: false,
          message: 'Tenant user not found'
        });
      }
    }

    const unit = await Unit.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email')
     .populate('tenant', 'firstName lastName email');

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.json({
      success: true,
      message: 'Unit updated successfully',
      unit
    });

  } catch (error) {
    console.error('Update unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update unit',
      error: error.message
    });
  }
};

// Delete unit (soft delete)
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if unit has any maintenance fees
    const hasMaintenanceFees = await UnitMaintenanceFee.countDocuments({ unit: id });
    if (hasMaintenanceFees > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete unit with existing maintenance fee records. Please archive instead.'
      });
    }

    const unit = await Unit.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.json({
      success: true,
      message: 'Unit archived successfully',
      unit
    });

  } catch (error) {
    console.error('Delete unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete unit',
      error: error.message
    });
  }
};

// Get units by floor
exports.getUnitsByFloor = async (req, res) => {
  try {
    const { floor } = req.params;
    
    const units = await Unit.getUnitsByFloor(parseInt(floor));
    
    res.json({
      success: true,
      floor: parseInt(floor),
      units
    });

  } catch (error) {
    console.error('Get units by floor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch units by floor',
      error: error.message
    });
  }
};

// Get vacant units
exports.getVacantUnits = async (req, res) => {
  try {
    const units = await Unit.getVacantUnits();

    res.json({
      success: true,
      units
    });

  } catch (error) {
    console.error('Get vacant units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vacant units',
      error: error.message
    });
  }
};

// Add special category to unit
exports.addSpecialCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, quantity, monthlyFee, description } = req.body;

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    await unit.addSpecialCategory(category, quantity, monthlyFee, description);

    res.json({
      success: true,
      message: 'Special category added successfully',
      unit
    });

  } catch (error) {
    console.error('Add special category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add special category',
      error: error.message
    });
  }
};

// Remove special category from unit
exports.removeSpecialCategory = async (req, res) => {
  try {
    const { id, category } = req.params;

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    await unit.removeSpecialCategory(category);

    res.json({
      success: true,
      message: 'Special category removed successfully',
      unit
    });

  } catch (error) {
    console.error('Remove special category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove special category',
      error: error.message
    });
  }
};

// Get unit maintenance calculation preview
exports.getMaintenanceCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    const calculation = unit.calculateMaintenanceForPeriod(
      parseInt(month) || new Date().getMonth() + 1,
      parseInt(year) || new Date().getFullYear()
    );

    res.json({
      success: true,
      calculation
    });

  } catch (error) {
    console.error('Get maintenance calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate maintenance',
      error: error.message
    });
  }
};
