const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  category: {
    type: String,
    enum: [
      'general',
      'maintenance',
      'financial',
      'security',
      'emergency',
      'event',
      'policy',
      'meeting',
      'other'
    ],
    default: 'general',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'published', 'archived', 'expired'],
    default: 'draft',
    required: true
  },
  visibility: {
    roles: [{
      type: String,
      enum: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
    }],
    units: [{
      type: String,
      trim: true
    }],
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  approvalWorkflow: {
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
      default: 'document'
    },
    size: {
      type: Number // in bytes
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  }],
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    },
    pushSent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    recipients: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      email: {
        type: Boolean,
        default: false
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: false
      }
    }]
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    shares: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for like count
announcementSchema.virtual('likeCount').get(function() {
  return this.metadata.likes.length;
});

// Indexes for performance
announcementSchema.index({ status: 1, publishDate: -1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ author: 1 });
announcementSchema.index({ expiryDate: 1 });
announcementSchema.index({ isPinned: 1, publishDate: -1 });
announcementSchema.index({ 'visibility.roles': 1 });
announcementSchema.index({ tags: 1 });
announcementSchema.index({ createdAt: -1 });

// Pre-save middleware to handle expiry
announcementSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'published') {
    this.status = 'expired';
  }
  next();
});

// Method to mark as read by user
announcementSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(
    read => read.user.toString() === userId.toString()
  );
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    this.metadata.views += 1;
  }
  
  return this.save();
};

// Method to add comment
announcementSchema.methods.addComment = function(userId, content, isApproved = true) {
  this.comments.push({
    user: userId,
    content: content,
    isApproved: isApproved,
    createdAt: new Date()
  });
  
  return this.save();
};

// Method to like/unlike announcement
announcementSchema.methods.toggleLike = function(userId) {
  const existingLike = this.metadata.likes.find(
    like => like.user.toString() === userId.toString()
  );
  
  if (existingLike) {
    this.metadata.likes = this.metadata.likes.filter(
      like => like.user.toString() !== userId.toString()
    );
  } else {
    this.metadata.likes.push({
      user: userId,
      likedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to approve announcement
announcementSchema.methods.approve = function(approverId, comments = '') {
  this.approvalWorkflow.approver = approverId;
  this.approvalWorkflow.approvedAt = new Date();
  this.approvalWorkflow.comments = comments;
  this.status = 'published';
  
  return this.save();
};

// Method to check if user can view announcement
announcementSchema.methods.canUserView = function(user) {
  // If public, everyone can view
  if (this.visibility.isPublic) {
    return true;
  }
  
  // Check role-based visibility
  if (this.visibility.roles.length > 0) {
    if (!this.visibility.roles.includes(user.role)) {
      return false;
    }
  }
  
  // Check unit-based visibility
  if (this.visibility.units.length > 0) {
    if (!user.unitNumber || !this.visibility.units.includes(user.unitNumber)) {
      return false;
    }
  }
  
  return true;
};

// Static method to get announcements for user
announcementSchema.statics.getForUser = function(user, options = {}) {
  const {
    page = 1,
    limit = 10,
    category = null,
    priority = null,
    includePinned = true
  } = options;
  
  let query = {
    status: 'published',
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: new Date() } }
    ]
  };
  
  // Add visibility filters
  const visibilityConditions = [
    { 'visibility.isPublic': true }
  ];
  
  if (user.role) {
    visibilityConditions.push({ 'visibility.roles': user.role });
  }
  
  if (user.unitNumber) {
    visibilityConditions.push({ 'visibility.units': user.unitNumber });
  }
  
  query.$and = [{ $or: visibilityConditions }];
  
  if (category) {
    query.category = category;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  let sortQuery = {};
  if (includePinned) {
    sortQuery = { isPinned: -1, publishDate: -1 };
  } else {
    sortQuery = { publishDate: -1 };
  }
  
  return this.find(query)
    .populate('author', 'firstName lastName role')
    .sort(sortQuery)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

module.exports = mongoose.model('Announcement', announcementSchema);
