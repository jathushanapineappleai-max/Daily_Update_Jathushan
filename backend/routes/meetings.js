// const express = require('express');
// const router = express.Router();
// const { auth, authorize, authorizeHierarchy } = require('../middleware/auth');
// const {
//   validateMeeting,
//   sanitizeInput
// } = require('../middleware/validation');
// const Meeting = require('../models/Meeting');
// const User = require('../models/User');
// const notificationService = require('../services/notificationService');

// // @route   GET /api/meetings
// // @desc    Get all meetings (with pagination and filtering)
// // @access  Private (All authenticated users)
// router.get('/', auth, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = {};

//     // Filter by status if specified
//     if (req.query.status) {
//       filter.status = req.query.status;
//     }

//     // Filter by type if specified
//     if (req.query.type) {
//       filter.type = req.query.type;
//     }

//     // Filter by date range if specified
//     if (req.query.startDate || req.query.endDate) {
//       filter.date = {};
//       if (req.query.startDate) {
//         filter.date.$gte = new Date(req.query.startDate);
//       }
//       if (req.query.endDate) {
//         filter.date.$lte = new Date(req.query.endDate);
//       }
//     }

//     const meetings = await Meeting.find(filter)
//       .populate('organizer', 'firstName lastName role')
//       .populate('attendees.user', 'firstName lastName role unitNumber')
//       .sort({ date: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Meeting.countDocuments(filter);

//     res.json({
//       meetings,
//       pagination: {
//         current: page,
//         pages: Math.ceil(total / limit),
//         total,
//         hasNext: page < Math.ceil(total / limit),
//         hasPrev: page > 1
//       }
//     });

//   } catch (error) {
//     console.error('Get meetings error:', error);
//     res.status(500).json({ message: 'Server error while fetching meetings' });
//   }
// });

// // @route   GET /api/meetings/:id
// // @desc    Get single meeting
// // @access  Private (All authenticated users)
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const meeting = await Meeting.findById(req.params.id)
//       .populate('organizer', 'firstName lastName role email')
//       .populate('attendees.user', 'firstName lastName role unitNumber email')
//       .populate('agenda.presenter', 'firstName lastName role')
//       .populate('minutes.recordedBy', 'firstName lastName role')
//       .populate('minutes.approvedBy', 'firstName lastName role')
//       .populate('decisions.actionItems.assignedTo', 'firstName lastName role');

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     res.json(meeting);

//   } catch (error) {
//     console.error('Get meeting error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while fetching meeting' });
//   }
// });

// // @route   POST /api/meetings
// // @desc    Create new meeting
// // @access  Private (Secretary, President, Administrator)
// router.post('/', auth, authorizeHierarchy('secretary'), validateMeeting, sanitizeInput, async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       date,
//       startTime,
//       endTime,
//       location,
//       type,
//       agenda,
//       attendees
//     } = req.body;

//     const meeting = new Meeting({
//       title,
//       description,
//       date,
//       startTime,
//       endTime,
//       location,
//       type,
//       agenda,
//       organizer: req.user._id,
//       status: 'scheduled'
//     });

//     // Add attendees if provided
//     if (attendees && Array.isArray(attendees)) {
//       for (const attendeeId of attendees) {
//         await meeting.addAttendee(attendeeId);
//       }
//     }

//     await meeting.save();
//     await meeting.populate('organizer', 'firstName lastName role');
//     await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

//     // Send meeting invitations
//     if (meeting.attendees.length > 0) {
//       await notificationService.handleMeetingInvitation(meeting);
//     }

//     res.status(201).json(meeting);

//   } catch (error) {
//     console.error('Create meeting error:', error);
//     res.status(500).json({ message: 'Server error while creating meeting' });
//   }
// });

// // @route   PUT /api/meetings/:id
// // @desc    Update meeting
// // @access  Private (Organizer, President, Administrator)
// router.put('/:id', auth, validateMeeting, sanitizeInput, async (req, res) => {
//   try {
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     // Check permissions
//     const canEdit = meeting.organizer.toString() === req.user._id.toString() ||
//                    ['president', 'administrator'].includes(req.user.role);

//     if (!canEdit) {
//       return res.status(403).json({ message: 'Not authorized to edit this meeting' });
//     }

//     const {
//       title,
//       description,
//       date,
//       startTime,
//       endTime,
//       location,
//       type,
//       agenda,
//       status
//     } = req.body;

//     // Update fields
//     meeting.title = title || meeting.title;
//     meeting.description = description || meeting.description;
//     meeting.date = date || meeting.date;
//     meeting.startTime = startTime || meeting.startTime;
//     meeting.endTime = endTime || meeting.endTime;
//     meeting.location = location || meeting.location;
//     meeting.type = type || meeting.type;
//     meeting.agenda = agenda || meeting.agenda;

//     if (status) {
//       meeting.status = status;
//     }

//     await meeting.save();
//     await meeting.populate('organizer', 'firstName lastName role');
//     await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

//     res.json(meeting);

//   } catch (error) {
//     console.error('Update meeting error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while updating meeting' });
//   }
// });

// // @route   DELETE /api/meetings/:id
// // @desc    Delete meeting
// // @access  Private (Organizer, President, Administrator)
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     // Check permissions
//     const canDelete = meeting.organizer.toString() === req.user._id.toString() ||
//                      ['president', 'administrator'].includes(req.user.role);

//     if (!canDelete) {
//       return res.status(403).json({ message: 'Not authorized to delete this meeting' });
//     }

//     await Meeting.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Meeting deleted successfully' });

//   } catch (error) {
//     console.error('Delete meeting error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while deleting meeting' });
//   }
// });

// // @route   POST /api/meetings/:id/attendees
// // @desc    Add attendee to meeting
// // @access  Private (Organizer, President, Administrator)
// router.post('/:id/attendees', auth, authorizeHierarchy('secretary'), async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     await meeting.addAttendee(userId);
//     await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

//     res.json(meeting.attendees);

//   } catch (error) {
//     console.error('Add attendee error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting or user not found' });
//     }
//     res.status(500).json({ message: 'Server error while adding attendee' });
//   }
// });

// // @route   PUT /api/meetings/:id/attendees/:userId
// // @desc    Update attendee status
// // @access  Private (Attendee can update own status, organizer can update any)
// router.put('/:id/attendees/:userId', auth, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     // Check permissions - user can update own status, organizer/admin can update any
//     const canUpdate = req.params.userId === req.user._id.toString() ||
//                      meeting.organizer.toString() === req.user._id.toString() ||
//                      ['president', 'administrator'].includes(req.user.role);

//     if (!canUpdate) {
//       return res.status(403).json({ message: 'Not authorized to update attendee status' });
//     }

//     await meeting.updateAttendeeStatus(req.params.userId, status);
//     await meeting.populate('attendees.user', 'firstName lastName role unitNumber');

//     res.json(meeting.attendees);

//   } catch (error) {
//     console.error('Update attendee status error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while updating attendee status' });
//   }
// });

// // @route   PUT /api/meetings/:id/minutes
// // @desc    Add or update meeting minutes
// // @access  Private (Secretary, President, Administrator)
// router.put('/:id/minutes', auth, authorizeHierarchy('secretary'), sanitizeInput, async (req, res) => {
//   try {
//     const { content } = req.body;
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     meeting.minutes = {
//       content,
//       recordedBy: req.user._id,
//       recordedAt: new Date(),
//       approved: false
//     };

//     await meeting.save();
//     await meeting.populate('minutes.recordedBy', 'firstName lastName role');

//     res.json(meeting.minutes);

//   } catch (error) {
//     console.error('Update minutes error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while updating minutes' });
//   }
// });

// // @route   PUT /api/meetings/:id/minutes/approve
// // @desc    Approve meeting minutes
// // @access  Private (President, Administrator)
// router.put('/:id/minutes/approve', auth, authorizeHierarchy('president'), async (req, res) => {
//   try {
//     const meeting = await Meeting.findById(req.params.id);

//     if (!meeting) {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }

//     if (!meeting.minutes || !meeting.minutes.content) {
//       return res.status(400).json({ message: 'No minutes to approve' });
//     }

//     meeting.minutes.approved = true;
//     meeting.minutes.approvedBy = req.user._id;
//     meeting.minutes.approvedAt = new Date();

//     await meeting.save();
//     await meeting.populate('minutes.recordedBy', 'firstName lastName role');
//     await meeting.populate('minutes.approvedBy', 'firstName lastName role');

//     res.json(meeting.minutes);

//   } catch (error) {
//     console.error('Approve minutes error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Meeting not found' });
//     }
//     res.status(500).json({ message: 'Server error while approving minutes' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const { auth, authorizeHierarchy } = require('../middleware/auth');
const { validateMeeting, sanitizeInput } = require('../middleware/validation');
const meetingController = require('../controllers/meetingController');

// Meetings CRUD
router.get('/', auth, meetingController.getMeetings);
router.get('/:id', auth, meetingController.getMeetingById);
router.post('/', auth, authorizeHierarchy('secretary'), validateMeeting, sanitizeInput, meetingController.createMeeting);
router.put('/:id', auth, validateMeeting, sanitizeInput, meetingController.updateMeeting);
router.delete('/:id', auth, meetingController.deleteMeeting);

// Attendees
router.post('/:id/attendees', auth, authorizeHierarchy('secretary'), meetingController.addAttendee);
router.put('/:id/attendees/:userId', auth, meetingController.updateAttendeeStatus);

// Minutes
router.put('/:id/minutes', auth, authorizeHierarchy('secretary'), sanitizeInput, meetingController.updateMinutes);
router.put('/:id/minutes/approve', auth, authorizeHierarchy('president'), meetingController.approveMinutes);

module.exports = router;
