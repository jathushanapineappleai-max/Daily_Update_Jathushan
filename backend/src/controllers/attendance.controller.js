const { AttendanceRecord, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// @desc    Clock in employee
// @route   POST /api/attendance/employee/clock-in
// @access  Private (Employees)
exports.clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    // Check if user already clocked in today
    const existingRecord = await AttendanceRecord.findOne({
      where: {
        user_id: userId,
        date: currentDate
      }
    });
    
    if (existingRecord && existingRecord.clock_in) {
      return res.status(400).json({
        success: false,
        message: 'Already clocked in today'
      });
    }
    
    const clockInTime = new Date();
    
    // Determine if late (assuming 9:00 AM as deadline)
    const lateThreshold = new Date();
    lateThreshold.setHours(9, 0, 0, 0);
    const status = clockInTime > lateThreshold ? 'late' : 'on_time';
    
    let attendanceRecord;
    
    if (existingRecord) {
      // Update existing record
      attendanceRecord = await existingRecord.update({
        clock_in: clockInTime,
        status: status,
        updated_at: new Date()
      });
    } else {
      // Create new record
      attendanceRecord = await AttendanceRecord.create({
        user_id: userId,
        date: currentDate,
        clock_in: clockInTime,
        status: status,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Clocked in successfully',
      data: {
        id: attendanceRecord.id,
        clock_in: attendanceRecord.clock_in,
        status: attendanceRecord.status
      }
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clock in',
      error: error.message
    });
  }
};

// @desc    Clock out employee
// @route   POST /api/attendance/employee/clock-out
// @access  Private (Employees)
exports.clockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find today's attendance record
    const attendanceRecord = await AttendanceRecord.findOne({
      where: {
        user_id: userId,
        date: currentDate
      }
    });
    
    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: 'No clock in record found for today'
      });
    }
    
    if (attendanceRecord.clock_out) {
      return res.status(400).json({
        success: false,
        message: 'Already clocked out today'
      });
    }
    
    // Check if user is currently on break and end the break automatically
    let updatedRecord = attendanceRecord;
    if (attendanceRecord.break_start) {
      // End the break automatically before clocking out
      const breakEndTime = new Date();
      const breakStartTime = new Date(attendanceRecord.break_start);
      
      // Calculate break duration in seconds
      const breakDurationSeconds = Math.floor((breakEndTime - breakStartTime) / 1000);
      
      // Update total break duration
      const totalBreakDuration = (attendanceRecord.total_break_duration || 0) + breakDurationSeconds;
      
      // Update record to end break
      updatedRecord = await attendanceRecord.update({
        break_start: null,
        total_break_duration: totalBreakDuration,
        updated_at: new Date()
      });
    }
    
    const clockOutTime = new Date();
    
    // Calculate working hours
    const clockInTime = new Date(updatedRecord.clock_in);
    const totalBreakDuration = updatedRecord.total_break_duration || 0;
    
    // Calculate working hours in hours (excluding break time)
    const workingMilliseconds = clockOutTime - clockInTime - (totalBreakDuration * 1000);
    const workingHours = workingMilliseconds / (1000 * 60 * 60); // Convert to hours
    
    // Update record for clock out
    const finalRecord = await updatedRecord.update({
      clock_out: clockOutTime,
      working_hours: parseFloat(workingHours.toFixed(2)),
      updated_at: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Clocked out successfully',
      data: {
        id: finalRecord.id,
        clock_out: finalRecord.clock_out,
        working_hours: finalRecord.working_hours
      }
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clock out',
      error: error.message
    });
  }
};

// @desc    Start break
// @route   POST /api/attendance/employee/start-break
// @access  Private (Employees)
exports.startBreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find today's attendance record
    const attendanceRecord = await AttendanceRecord.findOne({
      where: {
        user_id: userId,
        date: currentDate
      }
    });
    
    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: 'No attendance record found for today'
      });
    }
    
    if (!attendanceRecord.clock_in) {
      return res.status(400).json({
        success: false,
        message: 'Not clocked in yet'
      });
    }
    
    if (attendanceRecord.break_start) {
      return res.status(400).json({
        success: false,
        message: 'Already on break'
      });
    }
    
    // Check if total break duration has already reached the limit (1 hour = 3600 seconds)
    if (attendanceRecord.total_break_duration >= 3600) {
      return res.status(400).json({
        success: false,
        message: 'Daily break limit of 1 hour reached'
      });
    }
    
    const breakStartTime = new Date();
    
    // Update record
    const updatedRecord = await attendanceRecord.update({
      break_start: breakStartTime,
      updated_at: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Break started successfully',
      data: {
        id: updatedRecord.id,
        break_start: updatedRecord.break_start
      }
    });
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during start break',
      error: error.message
    });
  }
};

// @desc    End break
// @route   POST /api/attendance/employee/end-break
// @access  Private (Employees)
exports.endBreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find today's attendance record
    const attendanceRecord = await AttendanceRecord.findOne({
      where: {
        user_id: userId,
        date: currentDate
      }
    });
    
    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: 'No attendance record found for today'
      });
    }
    
    if (!attendanceRecord.break_start) {
      return res.status(400).json({
        success: false,
        message: 'Not on break currently'
      });
    }
    
    const breakEndTime = new Date();
    const breakStartTime = new Date(attendanceRecord.break_start);
    
    // Calculate break duration in seconds
    const breakDurationSeconds = Math.floor((breakEndTime - breakStartTime) / 1000);
    
    // Check if adding this break would exceed the daily limit (1 hour = 3600 seconds)
    const currentTotalBreak = attendanceRecord.total_break_duration || 0;
    if (currentTotalBreak + breakDurationSeconds > 3600) {
      // Calculate maximum allowed break duration for this session
      const maxAllowedBreak = 3600 - currentTotalBreak;
      
      // If max allowed is 0 or negative, deny the break end
      if (maxAllowedBreak <= 0) {
        // Update record to end break without adding more time
        const updatedRecord = await attendanceRecord.update({
          break_start: null,
          updated_at: new Date()
        });
        
        return res.status(400).json({
          success: false,
          message: 'Daily break limit of 1 hour already reached',
          data: {
            id: updatedRecord.id,
            total_break_duration: updatedRecord.total_break_duration
          }
        });
      }
      
      // Limit the break duration to stay within the daily limit
      // Update total break duration to exactly reach the limit
      const totalBreakDuration = 3600;
      
      // Update record
      const updatedRecord = await attendanceRecord.update({
        break_start: null,
        total_break_duration: totalBreakDuration,
        updated_at: new Date()
      });
      
      return res.status(200).json({
        success: true,
        message: `Break ended with adjusted duration. Daily break limit of 1 hour reached`,
        data: {
          id: updatedRecord.id,
          total_break_duration: updatedRecord.total_break_duration
        }
      });
    }
    
    // Update total break duration
    const totalBreakDuration = currentTotalBreak + breakDurationSeconds;
    
    // Update record
    const updatedRecord = await attendanceRecord.update({
      break_start: null,
      total_break_duration: totalBreakDuration,
      updated_at: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Break ended successfully',
      data: {
        id: updatedRecord.id,
        total_break_duration: updatedRecord.total_break_duration
      }
    });
  } catch (error) {
    console.error('End break error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during end break',
      error: error.message
    });
  }
};

// @desc    Get today's attendance record
// @route   GET /api/attendance/employee/today
// @access  Private (Employees)
exports.getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find today's attendance record
    const attendanceRecord = await AttendanceRecord.findOne({
      where: {
        user_id: userId,
        date: currentDate
      },
      attributes: { exclude: ['user_id'] }
    });
    
    res.status(200).json({
      success: true,
      data: attendanceRecord || null
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching today\'s attendance',
      error: error.message
    });
  }
};

// @desc    Get employee attendance summary
// @route   GET /api/attendance/employee/summary
// @access  Private (Employees)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total days worked
    const totalDaysWorked = await AttendanceRecord.count({
      where: {
        user_id: userId,
        clock_in: { [Op.not]: null }
      }
    });
    
    // Get recent attendance records
    const recentRecords = await AttendanceRecord.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
      limit: 30
    });
    
    res.status(200).json({
      success: true,
      data: {
        total_days_worked: totalDaysWorked,
        recent_records: recentRecords
      }
    });
  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance summary',
      error: error.message
    });
  }
};

// @desc    Get all attendance records with pagination
// @route   GET /api/attendance/admin/records
// @access  Private (Admin)
exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await AttendanceRecord.findAndCountAll({
      limit,
      offset,
      order: [['date', 'DESC'], ['created_at', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'emp_id', 'first_name', 'last_name']
      }]
    });
    
    res.status(200).json({
      success: true,
      data: {
        attendance_records: rows,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all attendance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance records',
      error: error.message
    });
  }
};

// @desc    Get attendance records for specific employee
// @route   GET /api/attendance/admin/records/:userId
// @access  Private (Admin)
exports.getEmployeeAttendanceRecords = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await AttendanceRecord.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['date', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'emp_id', 'first_name', 'last_name']
      }]
    });
    
    res.status(200).json({
      success: true,
      data: {
        attendance_records: rows,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get employee attendance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching employee attendance records',
      error: error.message
    });
  }
};

// @desc    Get all attendance records for all employees (without pagination)
// @route   GET /api/attendance/admin/records/all
// @access  Private (Admin)
exports.getAllEmployeesAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await AttendanceRecord.findAll({
      order: [['date', 'DESC'], ['created_at', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'emp_id', 'first_name', 'last_name']
      }]
    });
    
    res.status(200).json({
      success: true,
      data: {
        attendance_records: attendanceRecords
      }
    });
  } catch (error) {
    console.error('Get all employees attendance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching all employees attendance records',
      error: error.message
    });
  }
};

// @desc    Get attendance trends data
// @route   GET /api/attendance/admin/analytics/trends
// @access  Private (Admin)
exports.getAttendanceTrends = async (req, res) => {
  try {
    // Get attendance trends for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const trends = await AttendanceRecord.findAll({
      where: {
        date: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      attributes: [
        'date',
        [fn('COUNT', col('id')), 'total_records'],
        [literal('SUM(CASE WHEN status = "on_time" THEN 1 ELSE 0 END)'), 'on_time_count'],
        [literal('SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END)'), 'late_count']
      ],
      group: ['date'],
      order: [['date', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        trends
      }
    });
  } catch (error) {
    console.error('Get attendance trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance trends',
      error: error.message
    });
  }
};

// @desc    Get average attendance by department
// @route   GET /api/attendance/admin/analytics/departments
// @access  Private (Admin)
exports.getAttendanceByDepartment = async (req, res) => {
  try {
    // This would require department information which is not in the current model
    // For now, we'll return a placeholder response.
    res.status(200).json({
      success: true,
      data: {
        departments: [],
        message: 'Department data not implemented - requires Department model integration'
      }
    });
  } catch (error) {
    console.error('Get attendance by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance by department',
      error: error.message
    });
  }
};