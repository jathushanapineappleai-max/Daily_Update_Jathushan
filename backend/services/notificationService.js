const emailService = require('./emailService');
const User = require('../models/User');

class NotificationService {
  constructor() {
    this.io = null;
  }

  // Initialize Socket.IO
  initialize(io) {
    this.io = io;
    console.log('Notification service initialized with Socket.IO');
  }

  // Send real-time notification to specific users
  async sendRealTimeNotification(userIds, notification) {
    if (!this.io) {
      console.warn('Socket.IO not initialized, skipping real-time notification');
      return;
    }

    try {
      // Send to specific users if they're connected
      userIds.forEach(userId => {
        this.io.to(`user_${userId}`).emit('notification', notification);
      });

      console.log(`Real-time notification sent to ${userIds.length} users`);
    } catch (error) {
      console.error('Failed to send real-time notification:', error);
    }
  }

  // Send notification to all users with specific roles
  async sendRoleBasedNotification(roles, notification) {
    if (!this.io) {
      console.warn('Socket.IO not initialized, skipping role-based notification');
      return;
    }

    try {
      roles.forEach(role => {
        this.io.to(`role_${role}`).emit('notification', notification);
      });

      console.log(`Role-based notification sent to roles: ${roles.join(', ')}`);
    } catch (error) {
      console.error('Failed to send role-based notification:', error);
    }
  }

  // Broadcast notification to all connected users
  async broadcastNotification(notification) {
    if (!this.io) {
      console.warn('Socket.IO not initialized, skipping broadcast notification');
      return;
    }

    try {
      this.io.emit('notification', notification);
      console.log('Broadcast notification sent to all users');
    } catch (error) {
      console.error('Failed to broadcast notification:', error);
    }
  }

  // Handle new announcement notifications
  async handleAnnouncementNotification(announcement) {
    try {
      // Determine target audience
      let targetUsers = [];
      
      if (announcement.targetAudience === 'all') {
        targetUsers = await User.find({ isActive: true });
      } else if (announcement.targetAudience === 'residents') {
        targetUsers = await User.find({ role: 'resident', isActive: true });
      } else if (announcement.targetAudience === 'council') {
        targetUsers = await User.find({ 
          role: { $in: ['council', 'secretary', 'treasurer', 'president'] }, 
          isActive: true 
        });
      } else if (announcement.targetAudience === 'management') {
        targetUsers = await User.find({ 
          role: { $in: ['secretary', 'treasurer', 'president', 'administrator'] }, 
          isActive: true 
        });
      }

      // Create notification object
      const notification = {
        type: 'announcement',
        title: 'New Announcement',
        message: announcement.title,
        data: {
          announcementId: announcement._id,
          priority: announcement.priority,
          category: announcement.category
        },
        timestamp: new Date()
      };

      // Send real-time notifications
      const userIds = targetUsers.map(user => user._id.toString());
      await this.sendRealTimeNotification(userIds, notification);

      // Send email notifications if enabled
      const emailUsers = targetUsers.filter(user => 
        user.preferences?.emailNotifications !== false
      );

      if (emailUsers.length > 0) {
        await emailService.sendAnnouncementNotification(announcement, emailUsers);
      }

      console.log(`Announcement notification sent to ${targetUsers.length} users`);
    } catch (error) {
      console.error('Failed to handle announcement notification:', error);
    }
  }

  // Handle meeting invitation notifications
  async handleMeetingInvitation(meeting) {
    try {
      // Get attendees with user details
      const attendeeIds = meeting.attendees.map(attendee => attendee.user);
      const attendees = await User.find({ _id: { $in: attendeeIds }, isActive: true });

      // Create notification object
      const notification = {
        type: 'meeting_invitation',
        title: 'Meeting Invitation',
        message: `You're invited to: ${meeting.title}`,
        data: {
          meetingId: meeting._id,
          date: meeting.date,
          startTime: meeting.startTime,
          location: meeting.location
        },
        timestamp: new Date()
      };

      // Send real-time notifications
      const userIds = attendees.map(user => user._id.toString());
      await this.sendRealTimeNotification(userIds, notification);

      // Send email invitations
      const emailUsers = attendees.filter(user => 
        user.preferences?.emailNotifications !== false
      );

      if (emailUsers.length > 0) {
        await emailService.sendMeetingInvitation(meeting, emailUsers);
      }

      console.log(`Meeting invitation sent to ${attendees.length} attendees`);
    } catch (error) {
      console.error('Failed to handle meeting invitation:', error);
    }
  }

  // Handle meeting reminder notifications
  async handleMeetingReminder(meeting) {
    try {
      // Get attendees who haven't declined
      const attendeeIds = meeting.attendees
        .filter(attendee => attendee.status !== 'declined')
        .map(attendee => attendee.user);
      
      const attendees = await User.find({ _id: { $in: attendeeIds }, isActive: true });

      // Create notification object
      const notification = {
        type: 'meeting_reminder',
        title: 'Meeting Reminder',
        message: `Reminder: ${meeting.title} is coming up`,
        data: {
          meetingId: meeting._id,
          date: meeting.date,
          startTime: meeting.startTime,
          location: meeting.location
        },
        timestamp: new Date()
      };

      // Send real-time notifications
      const userIds = attendees.map(user => user._id.toString());
      await this.sendRealTimeNotification(userIds, notification);

      // Send email reminders
      const emailUsers = attendees.filter(user => 
        user.preferences?.emailNotifications !== false
      );

      if (emailUsers.length > 0) {
        await emailService.sendMeetingReminder(meeting, emailUsers);
      }

      console.log(`Meeting reminder sent to ${attendees.length} attendees`);
    } catch (error) {
      console.error('Failed to handle meeting reminder:', error);
    }
  }

  // Handle user registration notifications
  async handleUserRegistration(user, tempPassword) {
    try {
      // Send welcome email
      await emailService.sendWelcomeEmail(user, tempPassword);

      // Notify administrators about new user
      const admins = await User.find({ 
        role: { $in: ['administrator', 'president'] }, 
        isActive: true 
      });

      const notification = {
        type: 'user_registration',
        title: 'New User Registered',
        message: `${user.firstName} ${user.lastName} has joined as ${user.role}`,
        data: {
          userId: user._id,
          role: user.role,
          unitNumber: user.unitNumber
        },
        timestamp: new Date()
      };

      const adminIds = admins.map(admin => admin._id.toString());
      await this.sendRealTimeNotification(adminIds, notification);

      console.log(`User registration notification sent for ${user.email}`);
    } catch (error) {
      console.error('Failed to handle user registration notification:', error);
    }
  }

  // Handle password reset notifications
  async handlePasswordReset(user, resetToken) {
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to handle password reset notification:', error);
    }
  }

  // Handle system alerts (for administrators)
  async handleSystemAlert(alertType, message, data = {}) {
    try {
      const admins = await User.find({ 
        role: 'administrator', 
        isActive: true 
      });

      const notification = {
        type: 'system_alert',
        title: 'System Alert',
        message,
        data: {
          alertType,
          ...data
        },
        timestamp: new Date(),
        priority: 'high'
      };

      const adminIds = admins.map(admin => admin._id.toString());
      await this.sendRealTimeNotification(adminIds, notification);

      console.log(`System alert sent to ${admins.length} administrators`);
    } catch (error) {
      console.error('Failed to handle system alert:', error);
    }
  }

  // Schedule meeting reminders (to be called by a cron job)
  async scheduleMeetingReminders() {
    try {
      const Meeting = require('../models/Meeting');
      
      // Find meetings happening in the next 24 hours that haven't sent reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const upcomingMeetings = await Meeting.find({
        date: {
          $gte: new Date(),
          $lte: tomorrow
        },
        status: 'scheduled',
        'notifications.reminderSent': false
      }).populate('attendees.user');

      for (const meeting of upcomingMeetings) {
        await this.handleMeetingReminder(meeting);
        
        // Mark reminder as sent
        meeting.notifications.reminderSent = true;
        meeting.notifications.reminderSentAt = new Date();
        await meeting.save();
      }

      console.log(`Processed ${upcomingMeetings.length} meeting reminders`);
    } catch (error) {
      console.error('Failed to schedule meeting reminders:', error);
    }
  }
}

module.exports = new NotificationService();
