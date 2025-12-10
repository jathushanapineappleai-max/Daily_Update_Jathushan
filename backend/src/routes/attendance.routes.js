const express = require('express');
const { 
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getTodayAttendance,
  getAttendanceSummary,
  getAllAttendanceRecords,
  getEmployeeAttendanceRecords,
  getAllEmployeesAttendanceRecords,
  getAttendanceTrends,
  getAttendanceByDepartment
} = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Employee routes
router.route('/employee/clock-in')
  .post(protect, clockIn);

router.route('/employee/clock-out')
  .post(protect, clockOut);

router.route('/employee/start-break')
  .post(protect, startBreak);

router.route('/employee/end-break')
  .post(protect, endBreak);

router.route('/employee/today')
  .get(protect, getTodayAttendance);

router.route('/employee/summary')
  .get(protect, getAttendanceSummary);

// Admin routes
router.route('/admin/records')
  .get(protect, getAllAttendanceRecords);

router.route('/admin/records/:userId')
  .get(protect, getEmployeeAttendanceRecords);

router.route('/admin/records/all')
  .get(protect, getAllEmployeesAttendanceRecords);

router.route('/admin/analytics/trends')
  .get(protect, getAttendanceTrends);

router.route('/admin/analytics/departments')
  .get(protect, getAttendanceByDepartment);

module.exports = router;