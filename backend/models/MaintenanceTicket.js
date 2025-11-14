const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: [
      'plumbing',
      'electrical',
      'hvac',
      'structural',
      'cleaning',
      'security',
      'elevator',
      'fire_safety',
      'landscaping',
      'pest_control',
      'other'
    ],
    required: [true, 'Category is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  status: {
    type: String,
    enum: [
      'open',
      'assigned',
      'in_progress',
      'pending_approval',
      'pending_parts',
      'on_hold',
      'resolved',
      'closed',
      'cancelled'
    ],
    default: 'open',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['unit', 'common_area', 'building_exterior', 'parking', 'other'],
      required: true
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Location details cannot exceed 200 characters']
    },
    unitNumber: {
      type: String,
      trim: true,
      maxlength: [10, 'Unit number cannot exceed 10 characters']
    },
    floor: {
      type: Number,
      min: -2, // Basement levels
      max: 20
    }
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  estimatedDuration: {
    type: Number, // in hours
    min: 0.5,
    max: 720 // 30 days
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  workLog: [{
    date: {
      type: Date,
      default: Date.now
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Work log entry cannot exceed 500 characters']
    },
    hoursWorked: {
      type: Number,
      min: 0,
      max: 24
    },
    status: {
      type: String,
      enum: ['started', 'in_progress', 'completed', 'on_hold', 'cancelled']
    }
  }],
  attachments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'document', 'video', 'other'],
      default: 'image'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Attachment description cannot exceed 200 characters']
    }
  }],
  partsUsed: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0
    },
    supplier: {
      type: String,
      trim: true
    },
    partNumber: {
      type: String,
      trim: true
    }
  }],
  approval: {
    required: {
      type: Boolean,
      default: false
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Approval comments cannot exceed 500 characters']
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback comments cannot exceed 500 characters']
    },
    submittedAt: {
      type: Date
    }
  },
  recurringMaintenance: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'semi_annual', 'annual']
    },
    nextScheduledDate: {
      type: Date
    },
    parentTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTicket'
    }
  },
  notifications: {
    requestorNotified: {
      type: Boolean,
      default: false
    },
    assigneeNotified: {
      type: Boolean,
      default: false
    },
    completionNotified: {
      type: Boolean,
      default: false
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if ticket is overdue
maintenanceTicketSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && 
         !['resolved', 'closed', 'cancelled'].includes(this.status);
});

// Virtual for total parts cost
maintenanceTicketSchema.virtual('totalPartsCost').get(function() {
  return this.partsUsed.reduce((total, part) => {
    return total + (part.quantity * part.unitCost);
  }, 0);
});

// Virtual for total hours worked
maintenanceTicketSchema.virtual('totalHoursWorked').get(function() {
  return this.workLog.reduce((total, log) => {
    return total + (log.hoursWorked || 0);
  }, 0);
});

// Virtual for age in days
maintenanceTicketSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = this.createdAt;
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// Indexes for performance
maintenanceTicketSchema.index({ ticketNumber: 1 });
maintenanceTicketSchema.index({ status: 1 });
maintenanceTicketSchema.index({ priority: 1 });
maintenanceTicketSchema.index({ category: 1 });
maintenanceTicketSchema.index({ requestedBy: 1 });
maintenanceTicketSchema.index({ assignedTo: 1 });
maintenanceTicketSchema.index({ vendor: 1 });
maintenanceTicketSchema.index({ scheduledDate: 1 });
maintenanceTicketSchema.index({ dueDate: 1 });
maintenanceTicketSchema.index({ createdAt: -1 });
maintenanceTicketSchema.index({ 'location.unitNumber': 1 });

// Pre-save middleware to generate ticket number
maintenanceTicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    
    this.ticketNumber = `MT${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Method to add work log entry
maintenanceTicketSchema.methods.addWorkLog = function(technicianId, description, hoursWorked, status) {
  this.workLog.push({
    technician: technicianId,
    description: description,
    hoursWorked: hoursWorked,
    status: status,
    date: new Date()
  });
  
  // Update ticket status based on work log status
  if (status === 'completed' && this.status !== 'resolved') {
    this.status = 'resolved';
    this.completedDate = new Date();
  } else if (status === 'in_progress' && this.status === 'assigned') {
    this.status = 'in_progress';
  }
  
  return this.save();
};

// Method to assign ticket
maintenanceTicketSchema.methods.assignTo = function(assigneeId, scheduledDate = null) {
  this.assignedTo = assigneeId;
  this.status = 'assigned';
  if (scheduledDate) {
    this.scheduledDate = scheduledDate;
  }
  
  return this.save();
};

// Method to approve ticket
maintenanceTicketSchema.methods.approve = function(approverId, comments = '') {
  this.approval.approver = approverId;
  this.approval.approvedAt = new Date();
  this.approval.comments = comments;
  
  // Update status based on current status
  if (this.status === 'pending_approval') {
    this.status = 'assigned';
  }
  
  return this.save();
};

// Method to close ticket
maintenanceTicketSchema.methods.close = function(feedback = null) {
  this.status = 'closed';
  if (!this.completedDate) {
    this.completedDate = new Date();
  }
  
  if (feedback) {
    this.feedback = {
      ...feedback,
      submittedAt: new Date()
    };
  }
  
  return this.save();
};

// Static method to get statistics
maintenanceTicketSchema.statics.getStatistics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalTickets: { $sum: 1 },
        openTickets: {
          $sum: { $cond: [{ $in: ['$status', ['open', 'assigned', 'in_progress']] }, 1, 0] }
        },
        resolvedTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        closedTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
        },
        avgResolutionTime: {
          $avg: {
            $cond: [
              { $ne: ['$completedDate', null] },
              { $subtract: ['$completedDate', '$createdAt'] },
              null
            ]
          }
        },
        totalCost: { $sum: '$actualCost' }
      }
    }
  ]);
};

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
