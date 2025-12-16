const express = require('express');
const { 
  createEmployeePersonal,
  updateEmployeePersonal,
  addEmployeeEducation,
  addEmployeeProfessional,
  uploadEmployeeDocument,
  uploadEmployeeProfilePhoto,
  setEmployeeWorkInfo,
  getEmployeeOverview,
  getAllEmployees
} = require('../controllers/employee.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, uploadConfigs } = require('../utils/fileUpload');

const router = express.Router();

// Employee creation - Step 1: Personal Information
router.route('/personal')
  .post(protect, authorize('admin'), createEmployeePersonal);

// Employee update - Step 1: Personal Information
router.route('/:id/personal')
  .put(protect, authorize('admin'), updateEmployeePersonal);

// Employee education information
router.route('/:id/education')
  .post(protect, authorize('admin'), addEmployeeEducation);

// Employee professional information
router.route('/:id/professional')
  .post(protect, authorize('admin'), addEmployeeProfessional);

// Employee document upload
router.route('/:id/documents')
  .post(
    protect, 
    authorize('admin'), 
    upload.single('document'), 
    uploadEmployeeDocument
  );

// Employee profile photo upload
router.route('/:id/profile-photo')
  .post(
    protect, 
    authorize('admin'), 
    uploadConfigs.profilePhoto.single('image'), 
    uploadEmployeeProfilePhoto
  );

// Employee work information
router.route('/:id/work-info')
  .post(protect, authorize('admin'), setEmployeeWorkInfo);

// Employee overview
router.route('/:id')
  .get(protect, authorize('admin'), getEmployeeOverview);

// All employees
router.route('/')
  .get(protect, authorize('admin'), getAllEmployees);

module.exports = router;