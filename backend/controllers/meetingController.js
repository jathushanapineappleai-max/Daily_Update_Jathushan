const Meeting = require('../models/Meeting');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// Get all meetings with pagination and filtering
exports.getMeetings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const meetings = await Meeting.find(filter)
      .populate('organizer', 'firstName lastName role')
      .populate('attendees.user', 'firstName lastName role unitNumber')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meeting.countDocuments(filter);

    res.json({
      meetings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ message: 'Server error while fetching meetings' });
  }
};

// Get single meeting
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'firstName lastName role email')
      .populate('attendees.user', 'firstName lastName role unitNumber email')
      .populate('agenda.presenter', 'firstName lastName role')
      .populate('minutes.recordedBy', 'firstName lastName role')
      .populate('minutes.approvedBy', 'firstName lastName role')
      .populate('decisions.actionItems.assignedTo', 'firstName lastName role');

    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    res.json(meeting);

  } catch (error) {
    console.error('Get meeting error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while fetching meeting' });
  }
};

// Create new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, type, agenda, attendees } = req.body;

    const meeting = new Meeting({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      type,
      agenda,
      organizer: req.user._id,
      status: 'scheduled'
    });

    if (attendees && Array.isArray(attendees)) {
      for (const attendeeId of attendees) {
        await meeting.addAttendee(attendeeId);
      }
    }

    await meeting.save();
    await meeting.populate('organizer', 'firstName lastName role');
    await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

    if (meeting.attendees.length > 0) {
      await notificationService.handleMeetingInvitation(meeting);
    }

    res.status(201).json(meeting);

  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Server error while creating meeting' });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const canEdit = meeting.organizer.toString() === req.user._id.toString() ||
                    ['president', 'administrator'].includes(req.user.role);
    if (!canEdit) return res.status(403).json({ message: 'Not authorized to edit this meeting' });

    const { title, description, date, startTime, endTime, location, type, agenda, status } = req.body;

    meeting.title = title || meeting.title;
    meeting.description = description || meeting.description;
    meeting.date = date || meeting.date;
    meeting.startTime = startTime || meeting.startTime;
    meeting.endTime = endTime || meeting.endTime;
    meeting.location = location || meeting.location;
    meeting.type = type || meeting.type;
    meeting.agenda = agenda || meeting.agenda;
    if (status) meeting.status = status;

    await meeting.save();
    await meeting.populate('organizer', 'firstName lastName role');
    await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

    res.json(meeting);

  } catch (error) {
    console.error('Update meeting error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while updating meeting' });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const canDelete = meeting.organizer.toString() === req.user._id.toString() ||
                     ['president', 'administrator'].includes(req.user.role);
    if (!canDelete) return res.status(403).json({ message: 'Not authorized to delete this meeting' });

    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting deleted successfully' });

  } catch (error) {
    console.error('Delete meeting error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while deleting meeting' });
  }
};

// Add attendee to meeting
exports.addAttendee = async (req, res) => {
  try {
    const { userId } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await meeting.addAttendee(userId);
    await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

    res.json(meeting.attendees);

  } catch (error) {
    console.error('Add attendee error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting or user not found' });
    res.status(500).json({ message: 'Server error while adding attendee' });
  }
};

// Update attendee status
exports.updateAttendeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const canUpdate = req.params.userId === req.user._id.toString() ||
                     meeting.organizer.toString() === req.user._id.toString() ||
                     ['president', 'administrator'].includes(req.user.role);
    if (!canUpdate) return res.status(403).json({ message: 'Not authorized to update attendee status' });

    await meeting.updateAttendeeStatus(req.params.userId, status);
    await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

    res.json(meeting.attendees);

  } catch (error) {
    console.error('Update attendee status error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while updating attendee status' });
  }
};

// Add or update minutes
exports.updateMinutes = async (req, res) => {
  try {
    const { content } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    meeting.minutes = {
      content,
      recordedBy: req.user._id,
      recordedAt: new Date(),
      approved: false
    };

    await meeting.save();
    await meeting.populate('minutes.recordedBy', 'firstName lastName role');

    res.json(meeting.minutes);

  } catch (error) {
    console.error('Update minutes error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while updating minutes' });
  }
};

// Approve minutes
exports.approveMinutes = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.minutes || !meeting.minutes.content) return res.status(400).json({ message: 'No minutes to approve' });

    meeting.minutes.approved = true;
    meeting.minutes.approvedBy = req.user._id;
    meeting.minutes.approvedAt = new Date();

    await meeting.save();
    await meeting.populate('minutes.recordedBy', 'firstName lastName role');
    await meeting.populate('minutes.approvedBy', 'firstName lastName role');

    res.json(meeting.minutes);

  } catch (error) {
    console.error('Approve minutes error:', error);
    if (error.name === 'CastError') return res.status(404).json({ message: 'Meeting not found' });
    res.status(500).json({ message: 'Server error while approving minutes' });
  }
};
