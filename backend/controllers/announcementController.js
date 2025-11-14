const Announcement = require('../models/Announcement');
const notificationService = require('../services/notificationService');

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    if (req.user.role === 'resident') filter.status = 'published';

    const announcements = await Announcement.find(filter)
      .populate('author', 'firstName lastName role')
      .sort({ isPinned: -1, priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error while fetching announcements' });
  }
};

// Get single announcement
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName role email')
      .populate('comments.user', 'firstName lastName role');

    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    if (req.user.role === 'resident' && announcement.status !== 'published') {
      return res.status(403).json({ message: 'Access denied' });
    }

    announcement.views += 1;
    await announcement.save();

    res.json(announcement);

  } catch (error) {
    console.error('Get announcement error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while fetching announcement' });
  }
};

// Create new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title, content, priority, category, targetAudience,
      expiryDate, isPinned, allowComments, attachments
    } = req.body;

    const announcement = new Announcement({
      title,
      content,
      priority,
      category,
      targetAudience,
      expiryDate,
      isPinned,
      allowComments,
      attachments,
      author: req.user._id,
      status: req.user.role === 'administrator' ? 'published' : 'draft'
    });

    await announcement.save();
    await announcement.populate('author', 'firstName lastName role');

    res.status(201).json(announcement);

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error while creating announcement' });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    const canEdit = announcement.author.toString() === req.user._id.toString() ||
      ['president', 'administrator'].includes(req.user.role);
    if (!canEdit) return res.status(403).json({ message: 'Not authorized to edit this announcement' });

    const {
      title, content, priority, category, targetAudience,
      expiryDate, isPinned, allowComments, attachments, status
    } = req.body;

    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.priority = priority || announcement.priority;
    announcement.category = category || announcement.category;
    announcement.targetAudience = targetAudience || announcement.targetAudience;
    announcement.expiryDate = expiryDate || announcement.expiryDate;
    announcement.isPinned = isPinned !== undefined ? isPinned : announcement.isPinned;
    announcement.allowComments = allowComments !== undefined ? allowComments : announcement.allowComments;
    announcement.attachments = attachments || announcement.attachments;

    if (status && ['president', 'administrator'].includes(req.user.role)) {
      announcement.status = status;
      if (status === 'published') announcement.publishedAt = new Date();
    }

    announcement.updatedAt = new Date();
    await announcement.save();
    await announcement.populate('author', 'firstName lastName role');

    res.json(announcement);

  } catch (error) {
    console.error('Update announcement error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while updating announcement' });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    const canDelete = announcement.author.toString() === req.user._id.toString() ||
      ['president', 'administrator'].includes(req.user.role);
    if (!canDelete) return res.status(403).json({ message: 'Not authorized to delete this announcement' });

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });

  } catch (error) {
    console.error('Delete announcement error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while deleting announcement' });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    if (announcement.status !== 'published') {
      return res.status(403).json({ message: 'Comments are only allowed on published announcements' });
    }

    const comment = { content: content.trim(), user: req.user._id, createdAt: new Date() };
    announcement.comments.push(comment);
    await announcement.save();
    await announcement.populate('comments.user', 'firstName lastName role');

    const newComment = announcement.comments[announcement.comments.length - 1];
    res.status(201).json(newComment);

  } catch (error) {
    console.error('Add comment error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

// Publish announcement
exports.publishAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    announcement.status = 'published';
    announcement.publishedAt = new Date();
    await announcement.save();
    await announcement.populate('author', 'firstName lastName role');

    await notificationService.handleAnnouncementNotification(announcement);

    res.json(announcement);

  } catch (error) {
    console.error('Publish announcement error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while publishing announcement' });
  }
};

// Pin/Unpin announcement
exports.pinAnnouncement = async (req, res) => {
  try {
    const { isPinned } = req.body;
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    announcement.isPinned = isPinned;
    await announcement.save();
    await announcement.populate('author', 'firstName lastName role');

    res.json(announcement);

  } catch (error) {
    console.error('Pin announcement error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Announcement not found' });
    res.status(500).json({ message: 'Server error while updating pin status' });
  }
};
