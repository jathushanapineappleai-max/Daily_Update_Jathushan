// routes/rule.routes.js
const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/rule.controller');

// Get all rules (optional: ?category_id=)
router.get('/rules', ruleController.getAll);

// Get single rule by id
router.get('/rules/:id', ruleController.getOne);

// Create a rule
router.post('/rules', ruleController.create);

// Update a rule by id
router.put('/rules/:id', ruleController.update);

// Delete a rule by id
router.delete('/rules/:id', ruleController.delete);

module.exports = router;
