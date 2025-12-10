const { AttendanceRecord } = require('./src/models');

// Test the attendance model directly
async function testAttendanceModel() {
  try {
    console.log('Testing attendance model...');
    
    // Try to create a sample attendance record
    const attendanceRecord = await AttendanceRecord.create({
      user_id: 1,
      date: new Date().toISOString().split('T')[0],
      clock_in: new Date(),
      status: 'on_time'
    });
    
    console.log('Attendance record created successfully:', attendanceRecord.toJSON());
    
    // Clean up - delete the test record
    await attendanceRecord.destroy();
    console.log('Test record cleaned up');
  } catch (error) {
    console.log('Error creating attendance record:', error.message);
    console.log('Error code:', error.original?.code);
  }
}

testAttendanceModel();