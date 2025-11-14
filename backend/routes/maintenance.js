// const express = require('express');
// const router = express.Router();
// const { auth } = require('../middleware/auth');

// // Placeholder routes for maintenance
// router.get('/', auth, (req, res) => {
//   res.json({ message: 'Maintenance endpoint - Coming soon' });
// });

// router.post('/', auth, (req, res) => {
//   res.json({ message: 'Create maintenance request endpoint - Coming soon' });
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', auth, maintenanceController.getMaintenanceRequests);
router.post('/', auth, maintenanceController.createMaintenanceRequest);

module.exports = router;
