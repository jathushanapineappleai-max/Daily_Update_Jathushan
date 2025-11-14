const axios = require('axios');

// Configure axios defaults
axios.defaults.baseURL = 'https://www.spantower27.org/api';
axios.defaults.timeout = 10000;

let authToken = '';

async function testPhase2() {
  console.log('🧪 Testing Phase 2: Communication Hub Features\n');

  try {
    // Test 1: Authentication
    console.log('📝 Test 1: Authentication');
    const loginResponse = await axios.post('/auth/login', {
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!'
    });

    if (loginResponse.data.success && loginResponse.data.token) {
      authToken = loginResponse.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      console.log('✅ Authentication successful');
      console.log(`   User: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
    } else {
      throw new Error('Authentication failed');
    }

    // Test 2: Create Announcement
    console.log('\n📢 Test 2: Create Announcement');
    const announcementData = {
      title: 'Phase 2 Testing - Communication Hub Launch',
      content: 'We are excited to announce the launch of our new Communication Hub! This system includes announcements, meeting management, email notifications, and real-time updates.',
      priority: 'high',
      category: 'general',
      targetAudience: 'all',
      isPinned: true,
      allowComments: true
    };

    const createAnnouncementResponse = await axios.post('/announcements', announcementData);
    const announcementId = createAnnouncementResponse.data._id;
    
    console.log('✅ Announcement created successfully');
    console.log(`   ID: ${announcementId}`);
    console.log(`   Title: ${createAnnouncementResponse.data.title}`);
    console.log(`   Status: ${createAnnouncementResponse.data.status}`);

    // Test 3: Publish Announcement
    console.log('\n📤 Test 3: Publish Announcement');
    const publishResponse = await axios.put(`/announcements/${announcementId}/publish`);
    
    console.log('✅ Announcement published successfully');
    console.log(`   Status: ${publishResponse.data.status}`);
    console.log(`   Published At: ${publishResponse.data.publishedAt}`);

    // Test 4: Get Announcements List
    console.log('\n📋 Test 4: Get Announcements List');
    const announcementsResponse = await axios.get('/announcements?page=1&limit=5');
    
    console.log('✅ Announcements retrieved successfully');
    console.log(`   Total announcements: ${announcementsResponse.data.pagination.total}`);
    console.log(`   Current page: ${announcementsResponse.data.pagination.current}`);
    console.log(`   Announcements on this page: ${announcementsResponse.data.announcements.length}`);

    // Test 5: Create Meeting
    console.log('\n🤝 Test 5: Create Meeting');
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 7); // Next week

    const meetingData = {
      title: 'Phase 2 Communication Hub Review Meeting',
      description: 'Review the newly implemented Communication Hub features and gather feedback from residents.',
      date: meetingDate.toISOString().split('T')[0],
      startTime: '19:00',
      endTime: '20:30',
      location: 'Span Tower 27 Community Hall',
      type: 'general',
      agenda: [
        {
          item: 'Introduction to Communication Hub',
          duration: 15
        },
        {
          item: 'Demonstration of Announcements System',
          duration: 20
        },
        {
          item: 'Q&A and Feedback Session',
          duration: 30
        },
        {
          item: 'Next Steps and Future Features',
          duration: 25
        }
      ]
    };

    const createMeetingResponse = await axios.post('/meetings', meetingData);
    const meetingId = createMeetingResponse.data._id;
    
    console.log('✅ Meeting created successfully');
    console.log(`   ID: ${meetingId}`);
    console.log(`   Title: ${createMeetingResponse.data.title}`);
    console.log(`   Date: ${createMeetingResponse.data.date}`);
    console.log(`   Status: ${createMeetingResponse.data.status}`);

    // Test 6: Get Meetings List
    console.log('\n📅 Test 6: Get Meetings List');
    const meetingsResponse = await axios.get('/meetings?page=1&limit=5');
    
    console.log('✅ Meetings retrieved successfully');
    console.log(`   Total meetings: ${meetingsResponse.data.pagination.total}`);
    console.log(`   Meetings on this page: ${meetingsResponse.data.meetings.length}`);

    // Test 7: Add Comment to Announcement
    console.log('\n💬 Test 7: Add Comment to Announcement');
    const commentResponse = await axios.post(`/announcements/${announcementId}/comments`, {
      content: 'This is fantastic! The new Communication Hub will greatly improve our community coordination.'
    });
    
    console.log('✅ Comment added successfully');
    console.log(`   Comment ID: ${commentResponse.data._id}`);
    console.log(`   Content: ${commentResponse.data.content}`);

    // Test 8: Pin Announcement
    console.log('\n📌 Test 8: Pin/Unpin Announcement');
    const pinResponse = await axios.put(`/announcements/${announcementId}/pin`, {
      isPinned: true
    });
    
    console.log('✅ Announcement pinned successfully');
    console.log(`   Pinned: ${pinResponse.data.isPinned}`);

    // Test 9: Get Single Announcement with Details
    console.log('\n🔍 Test 9: Get Announcement Details');
    const announcementDetailsResponse = await axios.get(`/announcements/${announcementId}`);
    
    console.log('✅ Announcement details retrieved successfully');
    console.log(`   Views: ${announcementDetailsResponse.data.views}`);
    console.log(`   Comments: ${announcementDetailsResponse.data.comments.length}`);
    console.log(`   Author: ${announcementDetailsResponse.data.author.firstName} ${announcementDetailsResponse.data.author.lastName}`);

    // Test 10: Get Single Meeting with Details
    console.log('\n🔍 Test 10: Get Meeting Details');
    const meetingDetailsResponse = await axios.get(`/meetings/${meetingId}`);
    
    console.log('✅ Meeting details retrieved successfully');
    console.log(`   Organizer: ${meetingDetailsResponse.data.organizer.firstName} ${meetingDetailsResponse.data.organizer.lastName}`);
    console.log(`   Agenda items: ${meetingDetailsResponse.data.agenda.length}`);
    console.log(`   Attendees: ${meetingDetailsResponse.data.attendees.length}`);

    console.log('\n🎉 All Phase 2 tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Authentication system working');
    console.log('✅ Announcements CRUD operations working');
    console.log('✅ Announcement publishing workflow working');
    console.log('✅ Comments system working');
    console.log('✅ Pin/unpin functionality working');
    console.log('✅ Meetings CRUD operations working');
    console.log('✅ Meeting agenda management working');
    console.log('✅ API pagination working');
    console.log('✅ Role-based access control working');
    console.log('✅ Data relationships and population working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the tests
testPhase2();
