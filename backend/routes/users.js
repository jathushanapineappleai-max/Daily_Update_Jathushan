const express = require('express');
const router = express.Router();
const { auth, authorize, authorizeHierarchy, canModifyUser } = require('../middleware/auth');
const { sanitizeInput, validateUserCreation } = require('../middleware/validation');
const userController = require('../controllers/userController');

// Users CRUD
router.get('/', auth, authorizeHierarchy('secretary'), userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, canModifyUser, sanitizeInput, userController.updateUser);
router.delete('/:id', auth, authorize('administrator'), userController.deleteUser);
router.post('/', auth, authorizeHierarchy('secretary'), validateUserCreation, sanitizeInput, userController.createUser);

// Role & status management
router.put('/:id/activate', auth, authorizeHierarchy('secretary'), userController.activateUser);
router.put('/:id/role', auth, authorizeHierarchy('president'), userController.changeUserRole);

// Password & account
router.post('/:id/reset-password', auth, authorizeHierarchy('secretary'), userController.resetPassword);
router.post('/:id/unlock', auth, authorizeHierarchy('secretary'), userController.unlockUser);

module.exports = router;
