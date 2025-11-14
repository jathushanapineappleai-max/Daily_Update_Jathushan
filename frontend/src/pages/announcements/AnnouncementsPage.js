// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
//   Grid,
//   Fab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Switch,
//   FormControlLabel,
//   Alert,
//   Pagination,
//   IconButton,
//   Menu,
//   ListItemIcon,
//   ListItemText
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   PushPin as PinIcon,
//   MoreVert as MoreVertIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Publish as PublishIcon,
//   Visibility as ViewIcon,
//   Comment as CommentIcon
// } from '@mui/icons-material';
// import { useSelector } from 'react-redux';
// import { format } from 'date-fns';
// import api from '../../services/apiService';

// const AnnouncementsPage = () => {
//   const { user } = useSelector(state => state.auth);
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Dialog states
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingAnnouncement, setEditingAnnouncement] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     priority: 'medium',
//     category: 'general',
//     targetAudience: 'all',
//     expiryDate: '',
//     isPinned: false,
//     allowComments: true
//   });

//   const canCreateAnnouncement = ['secretary', 'president', 'administrator'].includes(user?.role);
//   const canManageAnnouncements = ['president', 'administrator'].includes(user?.role);

//   useEffect(() => {
//     fetchAnnouncements();
//   }, [page]);

//   const fetchAnnouncements = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/announcements?page=${page}&limit=10`);
//       setAnnouncements(response.data.announcements);
//       setTotalPages(response.data.pagination.pages);
//       setError('');
//     } catch (error) {
//       setError('Failed to fetch announcements');
//       console.error('Fetch announcements error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingAnnouncement) {
//         await api.put(`/announcements/${editingAnnouncement._id}`, formData);
//         setSuccess('Announcement updated successfully');
//       } else {
//         await api.post('/announcements', formData);
//         setSuccess('Announcement created successfully');
//       }

//       setOpenDialog(false);
//       setEditingAnnouncement(null);
//       resetForm();
//       fetchAnnouncements();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to save announcement');
//     }
//   };

//   const handleEdit = (announcement) => {
//     setEditingAnnouncement(announcement);
//     setFormData({
//       title: announcement.title,
//       content: announcement.content,
//       priority: announcement.priority,
//       category: announcement.category,
//       targetAudience: announcement.targetAudience,
//       expiryDate: announcement.expiryDate ? announcement.expiryDate.split('T')[0] : '',
//       isPinned: announcement.isPinned,
//       allowComments: announcement.allowComments
//     });
//     setOpenDialog(true);
//     setAnchorEl(null);
//   };

//   const handleDelete = async (announcementId) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       try {
//         await api.delete(`/announcements/${announcementId}`);
//         setSuccess('Announcement deleted successfully');
//         fetchAnnouncements();
//       } catch (error) {
//         setError(error.response?.data?.message || 'Failed to delete announcement');
//       }
//     }
//     setAnchorEl(null);
//   };

//   const handlePublish = async (announcementId) => {
//     try {
//       await api.put(`/announcements/${announcementId}/publish`);
//       setSuccess('Announcement published successfully');
//       fetchAnnouncements();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to publish announcement');
//     }
//     setAnchorEl(null);
//   };

//   const handlePin = async (announcementId, isPinned) => {
//     try {
//       await api.put(`/announcements/${announcementId}/pin`, { isPinned: !isPinned });
//       setSuccess(`Announcement ${!isPinned ? 'pinned' : 'unpinned'} successfully`);
//       fetchAnnouncements();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to update pin status');
//     }
//     setAnchorEl(null);
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       content: '',
//       priority: 'medium',
//       category: 'general',
//       targetAudience: 'all',
//       expiryDate: '',
//       isPinned: false,
//       allowComments: true
//     });
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'error';
//       case 'medium': return 'warning';
//       case 'low': return 'success';
//       default: return 'default';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'published': return 'success';
//       case 'draft': return 'warning';
//       case 'archived': return 'default';
//       default: return 'default';
//     }
//   };

//   const canEditAnnouncement = (announcement) => {
//     return announcement.author._id === user?._id || canManageAnnouncements;
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Announcements
//         </Typography>
//         {canCreateAnnouncement && (
//           <Fab
//             color="primary"
//             aria-label="add announcement"
//             onClick={() => setOpenDialog(true)}
//           >
//             <AddIcon />
//           </Fab>
//         )}
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {loading ? (
//         <Typography>Loading announcements...</Typography>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {announcements.map((announcement) => (
//               <Grid item xs={12} key={announcement._id}>
//                 <Card
//                   sx={{
//                     position: 'relative',
//                     border: announcement.isPinned ? '2px solid #1976d2' : 'none'
//                   }}
//                 >
//                   {announcement.isPinned && (
//                     <PinIcon
//                       sx={{
//                         position: 'absolute',
//                         top: 8,
//                         right: 8,
//                         color: '#1976d2'
//                       }}
//                     />
//                   )}

//                   <CardContent>
//                     <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//                       <Typography variant="h6" component="h2" fontWeight="bold">
//                         {announcement.title}
//                       </Typography>

//                       {canEditAnnouncement(announcement) && (
//                         <IconButton
//                           onClick={(e) => {
//                             setAnchorEl(e.currentTarget);
//                             setSelectedAnnouncement(announcement);
//                           }}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                       )}
//                     </Box>

//                     <Box display="flex" gap={1} mb={2}>
//                       <Chip
//                         label={announcement.priority.toUpperCase()}
//                         color={getPriorityColor(announcement.priority)}
//                         size="small"
//                       />
//                       <Chip
//                         label={announcement.status.toUpperCase()}
//                         color={getStatusColor(announcement.status)}
//                         size="small"
//                       />
//                       <Chip
//                         label={announcement.category}
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Box>

//                     <Typography variant="body2" color="text.secondary" paragraph>
//                       {announcement.content.length > 200
//                         ? `${announcement.content.substring(0, 200)}...`
//                         : announcement.content
//                       }
//                     </Typography>

//                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                       <Typography variant="caption" color="text.secondary">
//                         By {announcement.author.firstName} {announcement.author.lastName} • {' '}
//                         {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
//                       </Typography>

//                       <Box display="flex" alignItems="center" gap={2}>
//                         <Typography variant="caption" color="text.secondary">
//                           {announcement.views} views
//                         </Typography>
//                         {announcement.comments && announcement.comments.length > 0 && (
//                           <Box display="flex" alignItems="center" gap={0.5}>
//                             <CommentIcon fontSize="small" color="action" />
//                             <Typography variant="caption" color="text.secondary">
//                               {announcement.comments.length}
//                             </Typography>
//                           </Box>
//                         )}
//                       </Box>
//                     </Box>
//                   </CardContent>

//                   <CardActions>
//                     <Button size="small" startIcon={<ViewIcon />}>
//                       View Details
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           {totalPages > 1 && (
//             <Box display="flex" justifyContent="center" mt={4}>
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={(e, value) => setPage(value)}
//                 color="primary"
//               />
//             </Box>
//           )}
//         </>
//       )}

//       {/* Action Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem onClick={() => handleEdit(selectedAnnouncement)}>
//           <ListItemIcon><EditIcon /></ListItemIcon>
//           <ListItemText>Edit</ListItemText>
//         </MenuItem>

//         {selectedAnnouncement?.status === 'draft' && canManageAnnouncements && (
//           <MenuItem onClick={() => handlePublish(selectedAnnouncement._id)}>
//             <ListItemIcon><PublishIcon /></ListItemIcon>
//             <ListItemText>Publish</ListItemText>
//           </MenuItem>
//         )}

//         {canManageAnnouncements && (
//           <MenuItem onClick={() => handlePin(selectedAnnouncement._id, selectedAnnouncement.isPinned)}>
//             <ListItemIcon><PinIcon /></ListItemIcon>
//             <ListItemText>{selectedAnnouncement?.isPinned ? 'Unpin' : 'Pin'}</ListItemText>
//           </MenuItem>
//         )}

//         <MenuItem onClick={() => handleDelete(selectedAnnouncement._id)}>
//           <ListItemIcon><DeleteIcon /></ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Create/Edit Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
//         <form onSubmit={handleSubmit}>
//           <DialogTitle>
//             {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
//           </DialogTitle>

//           <DialogContent>
//             <TextField
//               fullWidth
//               label="Title"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               required
//               margin="normal"
//             />

//             <TextField
//               fullWidth
//               label="Content"
//               value={formData.content}
//               onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//               required
//               multiline
//               rows={4}
//               margin="normal"
//             />

//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Priority</InputLabel>
//                   <Select
//                     value={formData.priority}
//                     onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                     label="Priority"
//                   >
//                     <MenuItem value="low">Low</MenuItem>
//                     <MenuItem value="medium">Medium</MenuItem>
//                     <MenuItem value="high">High</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Category</InputLabel>
//                   <Select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                     label="Category"
//                   >
//                     <MenuItem value="general">General</MenuItem>
//                     <MenuItem value="maintenance">Maintenance</MenuItem>
//                     <MenuItem value="financial">Financial</MenuItem>
//                     <MenuItem value="security">Security</MenuItem>
//                     <MenuItem value="events">Events</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Target Audience</InputLabel>
//                   <Select
//                     value={formData.targetAudience}
//                     onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
//                     label="Target Audience"
//                   >
//                     <MenuItem value="all">All Residents</MenuItem>
//                     <MenuItem value="residents">Residents Only</MenuItem>
//                     <MenuItem value="council">Council Members</MenuItem>
//                     <MenuItem value="management">Management</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             <TextField
//               fullWidth
//               label="Expiry Date"
//               type="date"
//               value={formData.expiryDate}
//               onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//               InputLabelProps={{ shrink: true }}
//               margin="normal"
//             />

//             <Box sx={{ mt: 2 }}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.isPinned}
//                     onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
//                   />
//                 }
//                 label="Pin this announcement"
//               />

//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.allowComments}
//                     onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
//                   />
//                 }
//                 label="Allow comments"
//               />
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => {
//               setOpenDialog(false);
//               setEditingAnnouncement(null);
//               resetForm();
//             }}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="contained">
//               {editingAnnouncement ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Container>
//   );
// };

// export default AnnouncementsPage;

import React, { useState, useEffect } from "react";
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
  Switch,
  FormControlLabel,
  Alert,
  Pagination,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  PushPin as PinIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import api from "../../services/apiService";

const AnnouncementsPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    category: "general",
    targetAudience: ["all"],
    expiryDate: "",
    isPinned: false,
    allowComments: true,
    attachments: [],
  });

  const canCreateAnnouncement = [
    "secretary",
    "president",
    "administrator",
  ].includes(user?.role);
  const canManageAnnouncements = ["president", "administrator"].includes(
    user?.role
  );

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/announcements?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.pagination.pages);
      setError("");
    } catch (err) {
      setError("Failed to fetch announcements");
      console.error("Fetch announcements error:", err);
    } finally {
      setLoading(false);
    }
  };

  // helper to map UI targetAudience to backend visibility
  const buildVisibility = (aud) => {
    switch (aud) {
      case "all":
        return { isPublic: true, roles: [], units: [] };
      case "residents":
        return { isPublic: false, roles: ["resident"], units: [] };
      case "council":
        return { isPublic: false, roles: ["council"], units: [] };
      case "management":
        return {
          isPublic: false,
          roles: ["president", "secretary", "administrator", "treasurer"],
          units: [],
        };
      default:
        return { isPublic: true, roles: [], units: [] };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure category matches backend enum
      let category =
        formData.category === "events" ? "event" : formData.category;

      // Map targetAudience (array) → visibility using first selection
      const selectedAudience = Array.isArray(formData.targetAudience)
        ? formData.targetAudience[0]
        : formData.targetAudience;
      const visibility = buildVisibility(selectedAudience);

      // Build the payload to match backend schema
      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        category,
        expiryDate: formData.expiryDate || null,
        isPinned: formData.isPinned,
        visibility,
        attachments: formData.attachments?.length ? formData.attachments : [],
      };

      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Announcement updated successfully");
      } else {
        await api.post("/announcements", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Announcement created successfully");
      }

      setOpenDialog(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const message = Array.isArray(backendErrors)
        ? backendErrors.map((e) => e.msg).join("; ")
        : err.response?.data?.message || "Failed to save announcement";
      setError(message);
      console.error("Save announcement error:", err);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      targetAudience: announcement.targetAudience || ["all"],
      expiryDate: announcement.expiryDate
        ? announcement.expiryDate.split("T")[0]
        : "",
      isPinned: announcement.isPinned,
      allowComments: announcement.allowComments,
      attachments: announcement.attachments || [],
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await api.delete(`/announcements/${announcementId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Announcement deleted successfully");
        fetchAnnouncements();
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete announcement"
        );
      }
    }
    setAnchorEl(null);
  };

  const handlePublish = async (announcementId) => {
    try {
      await api.put(
        `/announcements/${announcementId}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Announcement published successfully");
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish announcement");
    }
    setAnchorEl(null);
  };

  const handlePin = async (announcementId, isPinned) => {
    try {
      await api.put(
        `/announcements/${announcementId}/pin`,
        { isPinned: !isPinned },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(
        `Announcement ${!isPinned ? "pinned" : "unpinned"} successfully`
      );
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update pin status");
    }
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      category: "general",
      targetAudience: ["all"],
      expiryDate: "",
      isPinned: false,
      allowComments: true,
      attachments: [],
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const canEditAnnouncement = (announcement) => {
    return announcement.author._id === user?._id || canManageAnnouncements;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
        >
          Announcements
        </Typography>
        {canCreateAnnouncement && (
          <Fab
            color="primary"
            aria-label="add announcement"
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading announcements...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {announcements.map((announcement) => (
              <Grid item xs={12} key={announcement._id}>
                <Card
                  sx={{
                    position: "relative",
                    border: announcement.isPinned
                      ? "2px solid #1976d2"
                      : "none",
                  }}
                >
                  {announcement.isPinned && (
                    <PinIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#1976d2",
                      }}
                    />
                  )}

                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {announcement.title}
                      </Typography>

                      {canEditAnnouncement(announcement) && (
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedAnnouncement(announcement);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={announcement.priority.toUpperCase()}
                        color={getPriorityColor(announcement.priority)}
                        size="small"
                      />
                      <Chip
                        label={announcement.status.toUpperCase()}
                        color={getStatusColor(announcement.status)}
                        size="small"
                      />
                      <Chip
                        label={announcement.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {announcement.content.length > 200
                        ? `${announcement.content.substring(0, 200)}...`
                        : announcement.content}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="text.secondary">
                        By {announcement.author.firstName}{" "}
                        {announcement.author.lastName} •{" "}
                        {format(
                          new Date(announcement.createdAt),
                          "MMM dd, yyyy"
                        )}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="caption" color="text.secondary">
                          {announcement.views} views
                        </Typography>
                        {announcement.comments &&
                          announcement.comments.length > 0 && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CommentIcon fontSize="small" color="action" />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {announcement.comments.length}
                              </Typography>
                            </Box>
                          )}
                      </Box>
                    </Box>
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
        <MenuItem onClick={() => handleEdit(selectedAnnouncement)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {selectedAnnouncement?.status === "draft" && canManageAnnouncements && (
          <MenuItem onClick={() => handlePublish(selectedAnnouncement._id)}>
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText>Publish</ListItemText>
          </MenuItem>
        )}

        {canManageAnnouncements && (
          <MenuItem
            onClick={() =>
              handlePin(selectedAnnouncement._id, selectedAnnouncement.isPinned)
            }
          >
            <ListItemIcon>
              <PinIcon />
            </ListItemIcon>
            <ListItemText>
              {selectedAnnouncement?.isPinned ? "Unpin" : "Pin"}
            </ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleDelete(selectedAnnouncement._id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAnnouncement
              ? "Edit Announcement"
              : "Create New Announcement"}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              inputProps={{ minLength: 5 }}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              multiline
              rows={4}
              inputProps={{ minLength: 10 }}
              margin="normal"
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    label="Category"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={formData.targetAudience[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: [e.target.value],
                      })
                    }
                    label="Target Audience"
                  >
                    <MenuItem value="all">All Residents</MenuItem>
                    <MenuItem value="residents">Residents Only</MenuItem>
                    <MenuItem value="council">Council Members</MenuItem>
                    <MenuItem value="management">Management</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPinned}
                    onChange={(e) =>
                      setFormData({ ...formData, isPinned: e.target.checked })
                    }
                  />
                }
                label="Pin this announcement"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allowComments}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowComments: e.target.checked,
                      })
                    }
                  />
                }
                label="Allow comments"
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingAnnouncement(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingAnnouncement ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AnnouncementsPage;
