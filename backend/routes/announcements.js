// const express = require('express');
// const router = express.Router();
// const { auth, authorize, authorizeHierarchy } = require('../middleware/auth');
// const {
//   validateAnnouncement,
//   sanitizeInput
// } = require('../middleware/validation');
// const Announcement = require('../models/Announcement');
// const notificationService = require('../services/notificationService');

// // @route   GET /api/announcements
// // @desc    Get all announcements (with pagination and filtering)
// // @access  Private (All authenticated users)
// router.get('/', auth, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = {};

//     // Filter by priority if specified
//     if (req.query.priority) {
//       filter.priority = req.query.priority;
//     }

//     // Filter by status if specified
//     if (req.query.status) {
//       filter.status = req.query.status;
//     }

//     // Filter by date range if specified
//     if (req.query.startDate || req.query.endDate) {
//       filter.createdAt = {};
//       if (req.query.startDate) {
//         filter.createdAt.$gte = new Date(req.query.startDate);
//       }
//       if (req.query.endDate) {
//         filter.createdAt.$lte = new Date(req.query.endDate);
//       }
//     }

//     // Role-based filtering
//     if (req.user.role === 'resident') {
//       // Residents can only see published announcements
//       filter.status = 'published';
//     }

//     const announcements = await Announcement.find(filter)
//       .populate('author', 'firstName lastName role')
//       .sort({ isPinned: -1, priority: -1, createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Announcement.countDocuments(filter);

//     res.json({
//       announcements,
//       pagination: {
//         current: page,
//         pages: Math.ceil(total / limit),
//         total,
//         hasNext: page < Math.ceil(total / limit),
//         hasPrev: page > 1
//       }
//     });

//   } catch (error) {
//     console.error('Get announcements error:', error);
//     res.status(500).json({ message: 'Server error while fetching announcements' });
//   }
// });

// // @route   GET /api/announcements/:id
// // @desc    Get single announcement
// // @access  Private (All authenticated users)
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id)
//       .populate('author', 'firstName lastName role email')
//       .populate('comments.user', 'firstName lastName role');

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     // Check if user can view this announcement
//     if (req.user.role === 'resident' && announcement.status !== 'published') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Increment view count
//     announcement.views += 1;
//     await announcement.save();

//     res.json(announcement);

//   } catch (error) {
//     console.error('Get announcement error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while fetching announcement' });
//   }
// });

// // @route   POST /api/announcements
// // @desc    Create new announcement
// // @access  Private (Secretary, President, Administrator)
// router.post('/', auth, authorizeHierarchy('secretary'), validateAnnouncement, sanitizeInput, async (req, res) => {
//   try {
//     const {
//       title,
//       content,
//       priority,
//       category,
//       targetAudience,
//       expiryDate,
//       isPinned,
//       allowComments,
//       attachments
//     } = req.body;

//     const announcement = new Announcement({
//       title,
//       content,
//       priority,
//       category,
//       targetAudience,
//       expiryDate,
//       isPinned,
//       allowComments,
//       attachments,
//       author: req.user._id,
//       status: req.user.role === 'administrator' ? 'published' : 'draft' // Auto-publish for admin
//     });

//     await announcement.save();
//     await announcement.populate('author', 'firstName lastName role');

//     res.status(201).json(announcement);

//   } catch (error) {
//     console.error('Create announcement error:', error);
//     res.status(500).json({ message: 'Server error while creating announcement' });
//   }
// });

// // @route   PUT /api/announcements/:id
// // @desc    Update announcement
// // @access  Private (Author, President, Administrator)
// router.put('/:id', auth, validateAnnouncement, sanitizeInput, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     // Check permissions
//     const canEdit = announcement.author.toString() === req.user._id.toString() ||
//                    ['president', 'administrator'].includes(req.user.role);

//     if (!canEdit) {
//       return res.status(403).json({ message: 'Not authorized to edit this announcement' });
//     }

//     const {
//       title,
//       content,
//       priority,
//       category,
//       targetAudience,
//       expiryDate,
//       isPinned,
//       allowComments,
//       attachments,
//       status
//     } = req.body;

//     // Update fields
//     announcement.title = title || announcement.title;
//     announcement.content = content || announcement.content;
//     announcement.priority = priority || announcement.priority;
//     announcement.category = category || announcement.category;
//     announcement.targetAudience = targetAudience || announcement.targetAudience;
//     announcement.expiryDate = expiryDate || announcement.expiryDate;
//     announcement.isPinned = isPinned !== undefined ? isPinned : announcement.isPinned;
//     announcement.allowComments = allowComments !== undefined ? allowComments : announcement.allowComments;
//     announcement.attachments = attachments || announcement.attachments;

//     // Only certain roles can change status
//     if (status && ['president', 'administrator'].includes(req.user.role)) {
//       announcement.status = status;
//       if (status === 'published') {
//         announcement.publishedAt = new Date();
//       }
//     }

//     announcement.updatedAt = new Date();
//     await announcement.save();
//     await announcement.populate('author', 'firstName lastName role');

//     res.json(announcement);

//   } catch (error) {
//     console.error('Update announcement error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while updating announcement' });
//   }
// });

// // @route   DELETE /api/announcements/:id
// // @desc    Delete announcement
// // @access  Private (Author, President, Administrator)
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     // Check permissions
//     const canDelete = announcement.author.toString() === req.user._id.toString() ||
//                      ['president', 'administrator'].includes(req.user.role);

//     if (!canDelete) {
//       return res.status(403).json({ message: 'Not authorized to delete this announcement' });
//     }

//     await Announcement.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Announcement deleted successfully' });

//   } catch (error) {
//     console.error('Delete announcement error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while deleting announcement' });
//   }
// });

// // @route   POST /api/announcements/:id/comments
// // @desc    Add comment to announcement
// // @access  Private (All authenticated users)
// router.post('/:id/comments', auth, sanitizeInput, async (req, res) => {
//   try {
//     const { content } = req.body;

//     if (!content || content.trim().length === 0) {
//       return res.status(400).json({ message: 'Comment content is required' });
//     }

//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     // Comments are allowed by default for published announcements
//     if (announcement.status !== 'published') {
//       return res.status(403).json({ message: 'Comments are only allowed on published announcements' });
//     }

//     const comment = {
//       content: content.trim(),
//       user: req.user._id,
//       createdAt: new Date()
//     };

//     announcement.comments.push(comment);
//     await announcement.save();
//     await announcement.populate('comments.user', 'firstName lastName role');

//     // Return the new comment
//     const newComment = announcement.comments[announcement.comments.length - 1];
//     res.status(201).json(newComment);

//   } catch (error) {
//     console.error('Add comment error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while adding comment' });
//   }
// });

// // @route   PUT /api/announcements/:id/publish
// // @desc    Publish announcement
// // @access  Private (President, Administrator)
// router.put('/:id/publish', auth, authorizeHierarchy('president'), async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     announcement.status = 'published';
//     announcement.publishedAt = new Date();
//     await announcement.save();
//     await announcement.populate('author', 'firstName lastName role');

//     // Send notifications for published announcement
//     await notificationService.handleAnnouncementNotification(announcement);

//     res.json(announcement);

//   } catch (error) {
//     console.error('Publish announcement error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while publishing announcement' });
//   }
// });

// // @route   PUT /api/announcements/:id/pin
// // @desc    Pin/Unpin announcement
// // @access  Private (President, Administrator)
// router.put('/:id/pin', auth, authorizeHierarchy('president'), async (req, res) => {
//   try {
//     const { isPinned } = req.body;
//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }

//     announcement.isPinned = isPinned;
//     await announcement.save();
//     await announcement.populate('author', 'firstName lastName role');

//     res.json(announcement);

//   } catch (error) {
//     console.error('Pin announcement error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Announcement not found' });
//     }
//     res.status(500).json({ message: 'Server error while updating pin status' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const { validateAnnouncement, sanitizeInput } = require('../middleware/validation');
const announcementController = require('../controllers/announcementController');

// Routes
router.get('/', auth, announcementController.getAnnouncements);
router.get('/:id', auth, announcementController.getAnnouncementById);
router.post('/', auth, authorizeHierarchy('secretary'), validateAnnouncement, sanitizeInput, announcementController.createAnnouncement);
router.put('/:id', auth, validateAnnouncement, sanitizeInput, announcementController.updateAnnouncement);
router.delete('/:id', auth, announcementController.deleteAnnouncement);
router.post('/:id/comments', auth, sanitizeInput, announcementController.addComment);
router.put('/:id/publish', auth, authorizeHierarchy('president'), announcementController.publishAnnouncement);
router.put('/:id/pin', auth, authorizeHierarchy('president'), announcementController.pinAnnouncement);

module.exports = router;
