const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  businessRegistrationNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Registration number cannot exceed 50 characters']
  },
  contactPerson: {
    firstName: {
      type: String,
      required: [true, 'Contact person first name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Contact person last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    primary: {
      type: String,
      required: [true, 'Primary phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
    },
    secondary: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
    },
    fax: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid fax number']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters']
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Postal code cannot exceed 20 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
      default: 'Sri Lanka'
    }
  },
  services: [{
    category: {
      type: String,
      enum: [
        'plumbing',
        'electrical',
        'hvac',
        'cleaning',
        'security',
        'landscaping',
        'pest_control',
        'elevator_maintenance',
        'fire_safety',
        'construction',
        'painting',
        'carpentry',
        'other'
      ],
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Service description cannot exceed 500 characters']
    },
    hourlyRate: {
      type: Number,
      min: 0
    },
    minimumCharge: {
      type: Number,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'suspended', 'blacklisted'],
    default: 'pending',
    required: true
  },
  approvalWorkflow: {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedBy: [{
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [500, 'Comments cannot exceed 500 characters']
      },
      reviewedAt: {
        type: Date
      }
    }],
    finalApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    finalApprovalDate: {
      type: Date
    }
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'business_license',
        'insurance_certificate',
        'tax_certificate',
        'bank_details',
        'references',
        'certifications',
        'other'
      ],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date
    }
  }],
  insurance: {
    provider: {
      type: String,
      trim: true
    },
    policyNumber: {
      type: String,
      trim: true
    },
    coverage: {
      type: Number,
      min: 0
    },
    expiryDate: {
      type: Date
    }
  },
  bankDetails: {
    bankName: {
      type: String,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    routingNumber: {
      type: String,
      trim: true
    },
    accountHolderName: {
      type: String,
      trim: true
    }
  },
  rating: {
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    reviews: [{
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Review comment cannot exceed 500 characters']
      },
      workOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceTicket'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  performance: {
    totalJobs: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    cancelledJobs: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number, // in hours
      default: 0
    },
    onTimeCompletion: {
      type: Number, // percentage
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'sms'],
      default: 'email'
    },
    workingHours: {
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
      }
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    emergencyAvailable: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full contact name
vendorSchema.virtual('contactFullName').get(function() {
  return `${this.contactPerson.firstName} ${this.contactPerson.lastName}`;
});

// Virtual for completion rate
vendorSchema.virtual('completionRate').get(function() {
  if (this.performance.totalJobs === 0) return 0;
  return (this.performance.completedJobs / this.performance.totalJobs) * 100;
});

// Virtual for checking if insurance is expired
vendorSchema.virtual('isInsuranceExpired').get(function() {
  return this.insurance.expiryDate && this.insurance.expiryDate < new Date();
});

// Indexes for performance
vendorSchema.index({ companyName: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ 'services.category': 1 });
vendorSchema.index({ 'rating.averageRating': -1 });
vendorSchema.index({ createdAt: -1 });
vendorSchema.index({ tags: 1 });

// Method to add review
vendorSchema.methods.addReview = function(reviewerId, rating, comment, workOrderId = null) {
  this.rating.reviews.push({
    reviewer: reviewerId,
    rating: rating,
    comment: comment,
    workOrder: workOrderId,
    createdAt: new Date()
  });
  
  // Recalculate average rating
  this.rating.totalReviews = this.rating.reviews.length;
  const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.averageRating = totalRating / this.rating.totalReviews;
  
  return this.save();
};

// Method to approve vendor
vendorSchema.methods.approve = function(approverId, comments = '') {
  this.status = 'approved';
  this.approvalWorkflow.finalApprover = approverId;
  this.approvalWorkflow.finalApprovalDate = new Date();
  
  // Add approval to workflow
  const existingReview = this.approvalWorkflow.reviewedBy.find(
    review => review.reviewer.toString() === approverId.toString()
  );
  
  if (existingReview) {
    existingReview.status = 'approved';
    existingReview.comments = comments;
    existingReview.reviewedAt = new Date();
  } else {
    this.approvalWorkflow.reviewedBy.push({
      reviewer: approverId,
      status: 'approved',
      comments: comments,
      reviewedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to update performance metrics
vendorSchema.methods.updatePerformance = function(jobData) {
  const { completed, cancelled, completionTime, onTime, revenue } = jobData;
  
  if (completed) {
    this.performance.completedJobs += 1;
  }
  
  if (cancelled) {
    this.performance.cancelledJobs += 1;
  }
  
  this.performance.totalJobs += 1;
  
  if (completionTime) {
    const currentAvg = this.performance.averageCompletionTime;
    const totalJobs = this.performance.totalJobs;
    this.performance.averageCompletionTime = 
      ((currentAvg * (totalJobs - 1)) + completionTime) / totalJobs;
  }
  
  if (typeof onTime === 'boolean') {
    const currentOnTime = this.performance.onTimeCompletion;
    const totalCompleted = this.performance.completedJobs;
    const onTimeCount = Math.round((currentOnTime / 100) * (totalCompleted - 1));
    const newOnTimeCount = onTimeCount + (onTime ? 1 : 0);
    this.performance.onTimeCompletion = (newOnTimeCount / totalCompleted) * 100;
  }
  
  if (revenue) {
    this.performance.totalRevenue += revenue;
  }
  
  return this.save();
};

// Static method to get vendors by service category
vendorSchema.statics.getByServiceCategory = function(category, options = {}) {
  const { status = 'active', minRating = 0 } = options;
  
  return this.find({
    'services.category': category,
    status: status,
    'rating.averageRating': { $gte: minRating }
  }).sort({ 'rating.averageRating': -1, 'performance.completionRate': -1 });
};

module.exports = mongoose.model('Vendor', vendorSchema);
