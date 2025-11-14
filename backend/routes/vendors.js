// const express = require('express');
// const router = express.Router();
// const { auth, authorizeHierarchy } = require('../middleware/auth');

// // Placeholder routes for vendors
// router.get('/', auth, authorizeHierarchy('treasurer'), (req, res) => {
//   res.json({ message: 'Vendors endpoint - Coming soon' });
// });

// router.post('/', auth, authorizeHierarchy('treasurer'), (req, res) => {
//   res.json({ message: 'Create vendor endpoint - Coming soon' });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { auth, authorizeHierarchy } = require("../middleware/auth");
const vendorController = require("../controllers/vendorController");

// Get all vendors (treasurer+)
router.get(
  "/",
  auth,
  authorizeHierarchy("treasurer"),
  vendorController.getVendors
);

// Create new vendor (treasurer+)
router.post(
  "/",
  auth,
  authorizeHierarchy("treasurer"),
  vendorController.createVendor
);

module.exports = router;
