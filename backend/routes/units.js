const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const unitController = require('../controllers/unitController');

// Validation middleware for unit data
const validateUnitData = (req, res, next) => {
  const { unitNumber, floor, unitType, surfaceArea, owner } = req.body;
  
  if (!unitNumber || !floor || !unitType || !surfaceArea || !owner) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: unitNumber, floor, unitType, surfaceArea, owner'
    });
  }
  
  if (typeof floor !== 'number' || floor < -2 || floor > 20) {
    return res.status(400).json({
      success: false,
      message: 'Floor must be a number between -2 and 20'
    });
  }
  
  if (typeof surfaceArea !== 'number' || surfaceArea < 200 || surfaceArea > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Surface area must be a number between 200 and 5000 sq ft'
    });
  }
  
  const validUnitTypes = ['studio', '1br', '2br', '3br', '4br', 'penthouse'];
  if (!validUnitTypes.includes(unitType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid unit type. Must be one of: ' + validUnitTypes.join(', ')
    });
  }
  
  next();
};

// Validation middleware for special category
const validateSpecialCategory = (req, res, next) => {
  const { category, quantity, monthlyFee } = req.body;
  
  if (!category || !quantity || monthlyFee === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: category, quantity, monthlyFee'
    });
  }
  
  const validCategories = [
    'additional_parking', 'balcony_premium', 'pool_access', 
    'gym_access', 'storage_unit', 'garden_access', 
    'rooftop_access', 'concierge_service'
  ];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
    });
  }
  
  if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a number between 1 and 10'
    });
  }
  
  if (typeof monthlyFee !== 'number' || monthlyFee < 0 || monthlyFee > 50000) {
    return res.status(400).json({
      success: false,
      message: 'Monthly fee must be a number between 0 and 50,000'
    });
  }
  
  next();
};

// GET /api/units - Get all units with pagination and filtering
router.get('/', auth, unitController.getUnits);

// GET /api/units/vacant - Get vacant units
router.get('/vacant', auth, unitController.getVacantUnits);

// GET /api/units/floor/:floor - Get units by floor
router.get('/floor/:floor', auth, unitController.getUnitsByFloor);

// GET /api/units/:id - Get single unit by ID
router.get('/:id', auth, unitController.getUnitById);

// POST /api/units - Create new unit (Admin/President only)
router.post('/', 
  auth, 
  authorizeHierarchy('president'), 
  validateUnitData, 
  unitController.createUnit
);

// PUT /api/units/:id - Update unit (Admin/President/Treasurer only)
router.put('/:id', 
  auth, 
  authorizeHierarchy('treasurer'), 
  unitController.updateUnit
);

// DELETE /api/units/:id - Delete/Archive unit (Admin only)
router.delete('/:id', 
  auth, 
  authorizeHierarchy('administrator'), 
  unitController.deleteUnit
);

// POST /api/units/:id/special-categories - Add special category to unit
router.post('/:id/special-categories', 
  auth, 
  authorizeHierarchy('treasurer'), 
  validateSpecialCategory, 
  unitController.addSpecialCategory
);

// DELETE /api/units/:id/special-categories/:category - Remove special category from unit
router.delete('/:id/special-categories/:category', 
  auth, 
  authorizeHierarchy('treasurer'), 
  unitController.removeSpecialCategory
);

// GET /api/units/:id/maintenance-calculation - Get maintenance calculation preview
router.get('/:id/maintenance-calculation', 
  auth, 
  unitController.getMaintenanceCalculation
);

module.exports = router;
