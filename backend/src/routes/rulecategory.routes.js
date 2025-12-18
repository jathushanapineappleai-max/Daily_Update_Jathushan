// routes/rulecategory.routes.js
const express = require('express');
const router = express.Router();
const ruleCategoryController = require('../controllers/rulecategory.controller');

// Create a new rule category
// POST http://<host>:<port>/api/rule-category
router.post('/rule-category', ruleCategoryController.create);

// Delete a rule category by id
// DELETE http://<host>:<port>/api/rule-category/:id
router.delete('/rule-category/:id', ruleCategoryController.delete);

module.exports = router;
