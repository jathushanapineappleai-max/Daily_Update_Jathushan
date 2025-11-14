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
  Group,
  Event,
  Announcement,
  HowToVote,
  Schedule,
  CheckCircle,
  ArrowForward,
  Assessment,
  Forum
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CouncilDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    upcomingMeetings: 2,
    pendingVotes: 4,
    newAnnouncements: 6,
    communityFeedback: 8
  };

  const pendingVotes = [
    {
      id: 1,
      title: 'Approve New Security System Upgrade',
      deadline: '2024-01-18',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Budget Allocation for Landscaping',
      deadline: '2024-01-20',
      status: 'pending'
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Council Stats */}
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
              View
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HowToVote sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">Pending Votes</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {stats.pendingVotes}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Vote
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Announcement sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6">New Announcements</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {stats.newAnnouncements}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/announcements')}
              endIcon={<ArrowForward />}
            >
              Read
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Forum sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h6">Community Feedback</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              {stats.communityFeedback}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForward />}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Votes */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Items Requiring Your Vote
            </Typography>
            <List>
              {pendingVotes.map((vote, index) => (
                <React.Fragment key={vote.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <HowToVote color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {vote.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={vote.status}
                            color="warning"
                          />
                        </Box>
                      }
                      secondary={`Deadline: ${new Date(vote.deadline).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < pendingVotes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Cast Your Votes
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Council Actions */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Council Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Event />}
                  onClick={() => navigate('/meetings')}
                >
                  Meeting Minutes
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                >
                  Community Reports
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Forum />}
                >
                  Resident Feedback
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CouncilDashboard;
