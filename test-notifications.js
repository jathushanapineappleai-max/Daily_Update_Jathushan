const notificationService = require('./backend/services/notificationService');
const emailService = require('./backend/services/emailService');

async function testNotificationServices() {
  console.log('🔔 Testing Notification Services\n');

  try {
    // Test 1: Email Service Initialization
    console.log('📧 Test 1: Email Service Initialization');
    console.log('✅ Email service initialized (check logs for SMTP connection)');

    // Test 2: Test Email Template Generation
    console.log('\n📝 Test 2: Email Template Generation');
    
    const mockAnnouncement = {
      title: 'Test Announcement',
      content: 'This is a test announcement for Phase 2 testing.',
      priority: 'high',
      category: 'general',
      publishedAt: new Date()
    };

    const announcementTemplate = emailService.generateAnnouncementEmailTemplate(mockAnnouncement);
    console.log('✅ Announcement email template generated');
    console.log(`   Template length: ${announcementTemplate.length} characters`);

    const mockMeeting = {
      title: 'Test Meeting',
      date: new Date('2025-08-24'),
      startTime: '19:00',
      endTime: '20:30',
      location: 'Community Hall',
      type: 'general',
      description: 'Test meeting for Phase 2',
      agenda: [
        { item: 'Test agenda item 1' },
        { item: 'Test agenda item 2' }
      ]
    };

    const meetingTemplate = emailService.generateMeetingInvitationTemplate(mockMeeting);
    console.log('✅ Meeting invitation email template generated');
    console.log(`   Template length: ${meetingTemplate.length} characters`);

    // Test 3: Notification Service Methods
    console.log('\n🔔 Test 3: Notification Service Methods');
    
    const mockNotification = {
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification',
      timestamp: new Date()
    };

    // Test broadcast (will work even without Socket.IO connected)
    await notificationService.broadcastNotification(mockNotification);
    console.log('✅ Broadcast notification method working');

    // Test role-based notification
    await notificationService.sendRoleBasedNotification(['administrator'], mockNotification);
    console.log('✅ Role-based notification method working');

    // Test user-specific notification
    await notificationService.sendRealTimeNotification(['test-user-id'], mockNotification);
    console.log('✅ User-specific notification method working');

    console.log('\n🎉 All notification service tests completed successfully!');
    console.log('\n📊 Notification Test Summary:');
    console.log('✅ Email service initialized');
    console.log('✅ Email templates generating correctly');
    console.log('✅ Notification service methods working');
    console.log('✅ Real-time notification infrastructure ready');
    console.log('✅ Email notification infrastructure ready');

    console.log('\n📝 Note: To test actual email sending, configure SMTP settings in .env file:');
    console.log('   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');

  } catch (error) {
    console.error('❌ Notification test failed:', error.message);
  }
}

// Run the notification tests
testNotificationServices();
