const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Meeting date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters'],
    default: 'Span Tower 27 Community Hall'
  },
  type: {
    type: String,
    enum: ['general', 'emergency', 'committee', 'annual'],
    default: 'general',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled',
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined', 'attended', 'absent'],
      default: 'invited'
    },
    responseDate: {
      type: Date
    }
  }],
  agenda: [{
    item: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Agenda item cannot exceed 500 characters']
    },
    presenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    duration: {
      type: Number, // in minutes
      min: [5, 'Duration must be at least 5 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes']
    },
    status: {
      type: String,
      enum: ['pending', 'discussed', 'deferred', 'resolved'],
      default: 'pending'
    }
  }],
  minutes: {
    content: {
      type: String,
      trim: true
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recordedAt: {
      type: Date
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    }
  },
  decisions: [{
    item: {
      type: String,
      required: true,
      trim: true
    },
    decision: {
      type: String,
      required: true,
      trim: true
    },
    votingResults: {
      for: { type: Number, default: 0 },
      against: { type: Number, default: 0 },
      abstain: { type: Number, default: 0 }
    },
    actionItems: [{
      task: {
        type: String,
        required: true,
        trim: true
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      dueDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'overdue'],
        default: 'pending'
      }
    }]
  }],
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notifications: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentAt: {
      type: Date
    }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1,
      max: 12
    },
    endDate: {
      type: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for meeting duration in minutes
meetingSchema.virtual('durationMinutes').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes - startMinutes;
});

// Virtual for checking if meeting is upcoming
meetingSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date() && this.status === 'scheduled';
});

// Virtual for checking if meeting is overdue
meetingSchema.virtual('isOverdue').get(function() {
  return this.date < new Date() && this.status === 'scheduled';
});

// Indexes for performance
meetingSchema.index({ date: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ type: 1 });
meetingSchema.index({ 'attendees.user': 1 });
meetingSchema.index({ createdAt: -1 });

// Pre-save middleware to validate time logic
meetingSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return next(new Error('End time must be after start time'));
    }
  }
  
  next();
});

// Method to add attendee
meetingSchema.methods.addAttendee = function(userId, status = 'invited') {
  const existingAttendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (!existingAttendee) {
    this.attendees.push({
      user: userId,
      status: status,
      responseDate: status !== 'invited' ? new Date() : undefined
    });
  }
  
  return this.save();
};

// Method to update attendee status
meetingSchema.methods.updateAttendeeStatus = function(userId, status) {
  const attendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (attendee) {
    attendee.status = status;
    attendee.responseDate = new Date();
  }
  
  return this.save();
};

// Method to approve minutes
meetingSchema.methods.approveMinutes = function(approvedBy) {
  this.minutes.approved = true;
  this.minutes.approvedBy = approvedBy;
  this.minutes.approvedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Meeting', meetingSchema);
