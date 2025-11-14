import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Pagination,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
  Divider,
  List,
  ListItem,
  ListItemText as MuiListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Assignment as AgendaIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../services/apiService';

const MeetingsPage = () => {
  const { user } = useSelector(state => state.auth);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'general',
    agenda: [{ item: '', duration: 15 }]
  });

  const canCreateMeeting = ['secretary', 'president', 'administrator'].includes(user?.role);
  const canManageMeetings = ['president', 'administrator'].includes(user?.role);

  useEffect(() => {
    fetchMeetings();
  }, [page]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/meetings?page=${page}&limit=10`);
      setMeetings(response.data.meetings);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (error) {
      setError('Failed to fetch meetings');
      console.error('Fetch meetings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeeting) {
        await api.put(`/meetings/${editingMeeting._id}`, formData);
        setSuccess('Meeting updated successfully');
      } else {
        await api.post('/meetings', formData);
        setSuccess('Meeting created successfully');
      }

      setOpenDialog(false);
      setEditingMeeting(null);
      resetForm();
      fetchMeetings();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save meeting');
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      date: meeting.date ? meeting.date.split('T')[0] : '',
      startTime: meeting.startTime || '',
      endTime: meeting.endTime || '',
      location: meeting.location || '',
      type: meeting.type || 'general',
      agenda: meeting.agenda && meeting.agenda.length > 0 ? meeting.agenda : [{ item: '', duration: 15 }]
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await api.delete(`/meetings/${meetingId}`);
        setSuccess('Meeting deleted successfully');
        fetchMeetings();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete meeting');
      }
    }
    setAnchorEl(null);
  };

  const handleStatusChange = async (meetingId, newStatus) => {
    try {
      await api.put(`/meetings/${meetingId}`, { status: newStatus });
      setSuccess(`Meeting ${newStatus} successfully`);
      fetchMeetings();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update meeting status');
    }
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'general',
      agenda: [{ item: '', duration: 15 }]
    });
  };

  const addAgendaItem = () => {
    setFormData({
      ...formData,
      agenda: [...formData.agenda, { item: '', duration: 15 }]
    });
  };

  const removeAgendaItem = (index) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: newAgenda });
  };

  const updateAgendaItem = (index, field, value) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index][field] = value;
    setFormData({ ...formData, agenda: newAgenda });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'general': return 'default';
      case 'emergency': return 'error';
      case 'committee': return 'info';
      case 'annual': return 'secondary';
      default: return 'default';
    }
  };

  const canEditMeeting = (meeting) => {
    return meeting.organizer._id === user?._id || canManageMeetings;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Meetings
        </Typography>
        {canCreateMeeting && (
          <Fab
            color="primary"
            aria-label="add meeting"
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading meetings...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {meetings.map((meeting) => (
              <Grid item xs={12} md={6} key={meeting._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {meeting.title}
                      </Typography>

                      {canEditMeeting(meeting) && (
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedMeeting(meeting);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={meeting.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(meeting.status)}
                        size="small"
                      />
                      <Chip
                        label={meeting.type.toUpperCase()}
                        color={getTypeColor(meeting.type)}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(meeting.date), 'MMM dd, yyyy')} • {meeting.startTime} - {meeting.endTime}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {meeting.location}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {meeting.attendees.length} attendees
                      </Typography>
                      {meeting.attendees.length > 0 && (
                        <AvatarGroup max={4} sx={{ ml: 1 }}>
                          {meeting.attendees.slice(0, 4).map((attendee, index) => (
                            <Avatar key={index} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                              {attendee.user.firstName[0]}{attendee.user.lastName[0]}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      )}
                    </Box>

                    {meeting.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {meeting.description.length > 100
                          ? `${meeting.description.substring(0, 100)}...`
                          : meeting.description
                        }
                      </Typography>
                    )}

                    {meeting.agenda && meeting.agenda.length > 0 && (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AgendaIcon fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight="bold">
                            Agenda ({meeting.agenda.length} items)
                          </Typography>
                        </Box>
                        <List dense sx={{ py: 0 }}>
                          {meeting.agenda.slice(0, 2).map((item, index) => (
                            <ListItem key={index} sx={{ py: 0, px: 0 }}>
                              <MuiListItemText
                                primary={item.item}
                                secondary={`${item.duration} min`}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                          {meeting.agenda.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{meeting.agenda.length - 2} more items
                            </Typography>
                          )}
                        </List>
                      </Box>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="caption" color="text.secondary">
                      Organized by {meeting.organizer.firstName} {meeting.organizer.lastName}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small" startIcon={<ViewIcon />}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEdit(selectedMeeting)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {selectedMeeting?.status === 'scheduled' && (
          <MenuItem onClick={() => handleStatusChange(selectedMeeting._id, 'completed')}>
            <ListItemIcon><CompleteIcon /></ListItemIcon>
            <ListItemText>Mark Complete</ListItemText>
          </MenuItem>
        )}

        {selectedMeeting?.status === 'scheduled' && (
          <MenuItem onClick={() => handleStatusChange(selectedMeeting._id, 'cancelled')}>
            <ListItemIcon><CancelIcon /></ListItemIcon>
            <ListItemText>Cancel Meeting</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleDelete(selectedMeeting._id)}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Meeting Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              margin="normal"
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Meeting Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                label="Meeting Type"
              >
                <MenuItem value="general">General Meeting</MenuItem>
                <MenuItem value="emergency">Emergency Meeting</MenuItem>
                <MenuItem value="committee">Committee Meeting</MenuItem>
                <MenuItem value="annual">Annual Meeting</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Agenda Items
            </Typography>

            {formData.agenda.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label={`Agenda Item ${index + 1}`}
                    value={item.item}
                    onChange={(e) => updateAgendaItem(index, 'item', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Duration (min)"
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateAgendaItem(index, 'duration', parseInt(e.target.value) || 15)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={1}>
                  {formData.agenda.length > 1 && (
                    <IconButton onClick={() => removeAgendaItem(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}

            <Button onClick={addAgendaItem} startIcon={<AddIcon />} sx={{ mt: 1 }}>
              Add Agenda Item
            </Button>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              setEditingMeeting(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingMeeting ? 'Update' : 'Schedule'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MeetingsPage;
