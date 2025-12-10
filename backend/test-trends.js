const axios = require('axios');

// Test the attendance trends endpoint
async function testAttendanceTrends() {
  try {
    console.log('Testing attendance trends endpoint...');
    
    // Test trends endpoint (this will fail without authentication)
    const response = await axios.get('http://localhost:5000/api/attendance/admin/analytics/trends', {
      headers: {
        'Authorization': 'Bearer fake-token-for-testing'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('Error message:', error.message);
    }
  }
}

testAttendanceTrends();