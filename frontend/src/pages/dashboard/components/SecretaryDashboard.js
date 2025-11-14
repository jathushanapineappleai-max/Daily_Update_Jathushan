import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import {
  Event,
  Announcement,
  People,
  Email,
  Schedule,
  CheckCircle,
  ArrowForward,
  PersonAdd,
  Description,
  Send
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SecretaryDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    upcomingMeetings: 2,
    pendingAnnouncements: 3,
    newRegistrations: 4,
    documentsToReview: 6
  };

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Monthly General Meeting',
      date: '2024-01-20',
      time: '10:00 AM',
      attendees: 45
    },
    {
      id: 2,
      title: 'Emergency Council Meeting',
      date: '2024-01-18',
      time: '7:00 PM',
      attendees: 8
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Event sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Upcoming Meetings</Typography>
            </Box>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {stats.upcomingMeetings}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/meetings')}
              endIcon={<ArrowForward />}
            >
              Manage
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Announcement sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Draft Announcements</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {stats.pendingAnnouncements}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/announcements')}
              endIcon={<ArrowForward />}
            >
              Publish
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">New Registrations</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {stats.newRegistrations}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/users')}
              endIcon={<ArrowForward />}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Description sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6">Documents</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              {stats.documentsToReview}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/documents')}
              endIcon={<ArrowForward />}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Meetings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Meetings
            </Typography>
            <List>
              {upcomingMeetings.map((meeting, index) => (
                <React.Fragment key={meeting.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={meeting.title}
                      secondary={`${new Date(meeting.date).toLocaleDateString()} at ${meeting.time} • ${meeting.attendees} attendees`}
                    />
                  </ListItem>
                  {index < upcomingMeetings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/meetings')}
              sx={{ mt: 2 }}
            >
              Schedule New Meeting
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Secretary Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Event />}
                  onClick={() => navigate('/meetings')}
                >
                  Schedule Meeting
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Announcement />}
                  onClick={() => navigate('/announcements')}
                >
                  Create Announcement
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  onClick={() => navigate('/users')}
                >
                  Invite New User
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Send />}
                >
                  Send Notifications
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecretaryDashboard;
