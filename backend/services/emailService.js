const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      await this.transporter.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Email service initialization failed:', error);
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@spantower27.org',
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Announcement notification email
  async sendAnnouncementNotification(announcement, recipients) {
    try {
      const subject = `New Announcement: ${announcement.title}`;
      const htmlContent = this.generateAnnouncementEmailTemplate(announcement);
      
      const emailPromises = recipients.map(recipient => 
        this.sendEmail(recipient.email, subject, htmlContent)
      );

      await Promise.all(emailPromises);
      console.log(`Announcement notification sent to ${recipients.length} recipients`);
    } catch (error) {
      console.error('Failed to send announcement notifications:', error);
      throw error;
    }
  }

  // Meeting invitation email
  async sendMeetingInvitation(meeting, attendees) {
    try {
      const subject = `Meeting Invitation: ${meeting.title}`;
      const htmlContent = this.generateMeetingInvitationTemplate(meeting);
      
      const emailPromises = attendees.map(attendee => 
        this.sendEmail(attendee.email, subject, htmlContent)
      );

      await Promise.all(emailPromises);
      console.log(`Meeting invitations sent to ${attendees.length} attendees`);
    } catch (error) {
      console.error('Failed to send meeting invitations:', error);
      throw error;
    }
  }

  // Meeting reminder email
  async sendMeetingReminder(meeting, attendees) {
    try {
      const subject = `Meeting Reminder: ${meeting.title}`;
      const htmlContent = this.generateMeetingReminderTemplate(meeting);
      
      const emailPromises = attendees.map(attendee => 
        this.sendEmail(attendee.email, subject, htmlContent)
      );

      await Promise.all(emailPromises);
      console.log(`Meeting reminders sent to ${attendees.length} attendees`);
    } catch (error) {
      console.error('Failed to send meeting reminders:', error);
      throw error;
    }
  }

  // Password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const subject = 'Password Reset Request - SpanTower27';
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const htmlContent = this.generatePasswordResetTemplate(user, resetUrl);
      
      await this.sendEmail(user.email, subject, htmlContent);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(user, tempPassword) {
    try {
      const subject = 'Welcome to SpanTower27 Management System';
      const htmlContent = this.generateWelcomeTemplate(user, tempPassword);
      
      await this.sendEmail(user.email, subject, htmlContent);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  generateAnnouncementEmailTemplate(announcement) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Announcement</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .priority-high { border-left: 4px solid #f44336; }
          .priority-medium { border-left: 4px solid #ff9800; }
          .priority-low { border-left: 4px solid #4caf50; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SpanTower27</h1>
            <p>New Announcement</p>
          </div>
          <div class="content priority-${announcement.priority}">
            <h2>${announcement.title}</h2>
            <p><strong>Priority:</strong> ${announcement.priority.toUpperCase()}</p>
            <p><strong>Category:</strong> ${announcement.category}</p>
            <p><strong>Published:</strong> ${new Date(announcement.publishedAt).toLocaleDateString()}</p>
            <div style="margin-top: 20px;">
              ${announcement.content}
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from SpanTower27 Management System</p>
            <p>Please do not reply to this email</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateMeetingInvitationTemplate(meeting) {
    const meetingDate = new Date(meeting.date).toLocaleDateString();
    const agendaItems = meeting.agenda.map(item => `<li>${item.item}</li>`).join('');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Meeting Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .meeting-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SpanTower27</h1>
            <p>Meeting Invitation</p>
          </div>
          <div class="content">
            <h2>${meeting.title}</h2>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${meetingDate}</p>
              <p><strong>Time:</strong> ${meeting.startTime} - ${meeting.endTime}</p>
              <p><strong>Location:</strong> ${meeting.location}</p>
              <p><strong>Type:</strong> ${meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}</p>
              ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
            </div>
            ${agendaItems ? `
              <h3>Agenda:</h3>
              <ul>${agendaItems}</ul>
            ` : ''}
          </div>
          <div class="footer">
            <p>This is an automated message from SpanTower27 Management System</p>
            <p>Please confirm your attendance through the management portal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateMeetingReminderTemplate(meeting) {
    const meetingDate = new Date(meeting.date).toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Meeting Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .reminder-box { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SpanTower27</h1>
            <p>Meeting Reminder</p>
          </div>
          <div class="content">
            <div class="reminder-box">
              <h2>🔔 Reminder: ${meeting.title}</h2>
              <p><strong>Date:</strong> ${meetingDate}</p>
              <p><strong>Time:</strong> ${meeting.startTime} - ${meeting.endTime}</p>
              <p><strong>Location:</strong> ${meeting.location}</p>
            </div>
            <p>This is a friendly reminder about the upcoming meeting. Please make sure to attend on time.</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder from SpanTower27 Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SpanTower27</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>You have requested to reset your password for your SpanTower27 account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p><strong>Note:</strong> This link will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from SpanTower27 Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeTemplate(user, tempPassword) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to SpanTower27</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4caf50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .credentials { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SpanTower27</h1>
            <p>Management System</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName} ${user.lastName},</h2>
            <p>Welcome to the SpanTower27 Condominium Management System! Your account has been created successfully.</p>
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Temporary Password:</strong> ${tempPassword}</p>
              <p><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
            <p><strong>Important:</strong> Please log in and change your password immediately for security reasons.</p>
            <p>You can access the system at: ${process.env.FRONTEND_URL}</p>
          </div>
          <div class="footer">
            <p>This is an automated message from SpanTower27 Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
