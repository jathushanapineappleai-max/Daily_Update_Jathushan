const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true,
    maxlength: [200, 'Document name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'financial_reports',
      'meeting_minutes',
      'legal_documents',
      'insurance',
      'maintenance_records',
      'vendor_contracts',
      'policies',
      'forms',
      'certificates',
      'correspondence',
      'other'
    ],
    required: [true, 'Category is required']
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'other'],
    required: true
  },
  url: {
    type: String,
    required: [true, 'Document URL is required']
  },
  size: {
    type: Number, // in bytes
    required: true,
    min: 0
  },
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
      default: false
    }
  },
  accessControl: {
    canDownload: {
      type: Boolean,
      default: true
    },
    canPrint: {
      type: Boolean,
      default: true
    },
    canShare: {
      type: Boolean,
      default: false
    },
    passwordProtected: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    author: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    createdDate: {
      type: Date
    },
    modifiedDate: {
      type: Date
    }
  },
  versionHistory: [{
    version: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    changeLog: {
      type: String,
      trim: true,
      maxlength: [500, 'Change log cannot exceed 500 characters']
    }
  }],
  relatedDocuments: [{
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    relationship: {
      type: String,
      enum: ['supersedes', 'superseded_by', 'related', 'attachment', 'reference'],
      default: 'related'
    }
  }],
  approvalRequired: {
    type: Boolean,
    default: false
  },
  approvalWorkflow: {
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
  expiryDate: {
    type: Date
  },
  reminderDate: {
    type: Date
  },
  accessLog: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['view', 'download', 'print', 'share'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isEncrypted: {
    type: Boolean,
    default: false
  },
  checksum: {
    type: String // For file integrity verification
  },
  retentionPolicy: {
    retainUntil: {
      type: Date
    },
    autoDelete: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if document is expired
documentSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Virtual for file size in human readable format
documentSchema.virtual('humanReadableSize').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for latest version info
documentSchema.virtual('latestVersion').get(function() {
  if (this.versionHistory.length === 0) {
    return {
      version: this.version,
      url: this.url,
      size: this.size,
      uploadedBy: this.uploadedBy,
      uploadedAt: this.createdAt
    };
  }
  
  return this.versionHistory[this.versionHistory.length - 1];
});

// Indexes for performance
documentSchema.index({ name: 'text', description: 'text', 'metadata.keywords': 'text' });
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ 'visibility.roles': 1 });
documentSchema.index({ 'metadata.tags': 1 });
documentSchema.index({ expiryDate: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ downloadCount: -1 });
documentSchema.index({ viewCount: -1 });

// Method to check if user can access document
documentSchema.methods.canUserAccess = function(user) {
  // Check if document is public
  if (this.visibility.isPublic) {
    return true;
  }
  
  // Check role-based access
  if (this.visibility.roles.length > 0) {
    if (!this.visibility.roles.includes(user.role)) {
      return false;
    }
  }
  
  // Check unit-based access
  if (this.visibility.units.length > 0) {
    if (!user.unitNumber || !this.visibility.units.includes(user.unitNumber)) {
      return false;
    }
  }
  
  return true;
};

// Method to log access
documentSchema.methods.logAccess = function(userId, action, ipAddress = '', userAgent = '') {
  this.accessLog.push({
    user: userId,
    action: action,
    timestamp: new Date(),
    ipAddress: ipAddress,
    userAgent: userAgent
  });
  
  // Update counters
  if (action === 'view') {
    this.viewCount += 1;
  } else if (action === 'download') {
    this.downloadCount += 1;
  }
  
  return this.save();
};

// Method to create new version
documentSchema.methods.createNewVersion = function(newUrl, newSize, uploadedBy, changeLog = '') {
  // Add current version to history
  this.versionHistory.push({
    version: this.version,
    url: this.url,
    size: this.size,
    uploadedBy: this.uploadedBy,
    uploadedAt: this.updatedAt || this.createdAt,
    changeLog: changeLog
  });
  
  // Update current version
  this.version += 1;
  this.url = newUrl;
  this.size = newSize;
  this.uploadedBy = uploadedBy;
  
  return this.save();
};

// Method to approve document
documentSchema.methods.approve = function(approverId, comments = '') {
  this.approvalWorkflow.approver = approverId;
  this.approvalWorkflow.approvedAt = new Date();
  this.approvalWorkflow.comments = comments;
  
  return this.save();
};

// Method to add related document
documentSchema.methods.addRelatedDocument = function(documentId, relationship = 'related') {
  const existingRelation = this.relatedDocuments.find(
    rel => rel.document.toString() === documentId.toString()
  );
  
  if (!existingRelation) {
    this.relatedDocuments.push({
      document: documentId,
      relationship: relationship
    });
  }
  
  return this.save();
};

// Static method to search documents
documentSchema.statics.searchDocuments = function(query, user, options = {}) {
  const {
    category = null,
    tags = [],
    dateFrom = null,
    dateTo = null,
    page = 1,
    limit = 10
  } = options;
  
  let searchQuery = {
    status: 'active',
    $or: [
      { 'visibility.isPublic': true },
      { 'visibility.roles': user.role }
    ]
  };
  
  if (user.unitNumber) {
    searchQuery.$or.push({ 'visibility.units': user.unitNumber });
  }
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category) {
    searchQuery.category = category;
  }
  
  if (tags.length > 0) {
    searchQuery['metadata.tags'] = { $in: tags };
  }
  
  if (dateFrom || dateTo) {
    searchQuery.createdAt = {};
    if (dateFrom) searchQuery.createdAt.$gte = new Date(dateFrom);
    if (dateTo) searchQuery.createdAt.$lte = new Date(dateTo);
  }
  
  return this.find(searchQuery)
    .populate('uploadedBy', 'firstName lastName role')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get expiring documents
documentSchema.statics.getExpiringDocuments = function(daysAhead = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return this.find({
    status: 'active',
    expiryDate: {
      $exists: true,
      $lte: futureDate,
      $gte: new Date()
    }
  }).populate('uploadedBy', 'firstName lastName email');
};

module.exports = mongoose.model('Document', documentSchema);
