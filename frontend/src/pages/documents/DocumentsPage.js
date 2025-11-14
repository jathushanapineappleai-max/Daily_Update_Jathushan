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
  List,
  ListItem,
  ListItemText as MuiListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../services/apiService';

const DocumentsPage = () => {
  const { user } = useSelector(state => state.auth);
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    isPublic: true,
    file: null
  });

  const canManageDocuments = ['secretary', 'president', 'administrator'].includes(user?.role);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [page, filterCategory, searchTerm, allDocuments]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents');

      // Handle response safely
      if (response.data && response.data.documents) {
        setAllDocuments(response.data.documents);
      } else {
        // Fallback to demo data if API structure is different
        setAllDocuments(getDemoDocuments());
      }
      setError('');
    } catch (error) {
      // If API doesn't exist yet, show demo data
      if (error.response?.status === 401 || error.response?.status === 404 || !error.response) {
        setAllDocuments(getDemoDocuments());
        setError('');
      } else {
        setError('Failed to fetch documents');
        console.error('Fetch documents error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...allDocuments];

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description.toLowerCase().includes(searchLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        doc.fileName.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const totalItems = filtered.length;
    const pages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(pages);

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDocs = filtered.slice(startIndex, endIndex);

    setDocuments(paginatedDocs);
  };

  // Demo data for when API is not available
  const getDemoDocuments = () => [
    {
      _id: '1',
      title: 'Building Maintenance Manual',
      description: 'Comprehensive guide for building maintenance procedures and schedules',
      category: 'maintenance',
      fileType: 'pdf',
      fileName: 'maintenance_manual.pdf',
      fileSize: 2048576,
      tags: ['maintenance', 'procedures', 'manual'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'System', lastName: 'Admin' },
      uploadedAt: '2024-01-15T00:00:00Z',
      downloads: 45,
      views: 128
    },
    {
      _id: '2',
      title: 'Fire Safety Procedures',
      description: 'Emergency evacuation procedures and fire safety protocols',
      category: 'safety',
      fileType: 'pdf',
      fileName: 'fire_safety.pdf',
      fileSize: 1536000,
      tags: ['safety', 'emergency', 'fire'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Security', lastName: 'Team' },
      uploadedAt: '2024-01-10T00:00:00Z',
      downloads: 67,
      views: 203
    },
    {
      _id: '3',
      title: 'Annual General Meeting Minutes',
      description: 'Minutes from the 2024 Annual General Meeting',
      category: 'meetings',
      fileType: 'docx',
      fileName: 'agm_2024_minutes.docx',
      fileSize: 512000,
      tags: ['meeting', 'minutes', 'agm'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Secretary', lastName: 'Office' },
      uploadedAt: '2024-01-08T00:00:00Z',
      downloads: 23,
      views: 89
    },
    {
      _id: '4',
      title: 'Budget Report 2024',
      description: 'Annual budget report and financial statements',
      category: 'financial',
      fileType: 'xlsx',
      fileName: 'budget_2024.xlsx',
      fileSize: 768000,
      tags: ['budget', 'financial', 'report'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Treasurer', lastName: 'Office' },
      uploadedAt: '2024-01-05T00:00:00Z',
      downloads: 34,
      views: 156
    },
    {
      _id: '5',
      title: 'Building Floor Plans',
      description: 'Architectural floor plans for all building levels',
      category: 'architectural',
      fileType: 'pdf',
      fileName: 'floor_plans.pdf',
      fileSize: 4096000,
      tags: ['architecture', 'plans', 'building'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Management', lastName: 'Office' },
      uploadedAt: '2024-01-03T00:00:00Z',
      downloads: 78,
      views: 245
    },
    {
      _id: '6',
      title: 'Vendor Contracts 2024',
      description: 'Collection of vendor service contracts and agreements',
      category: 'contracts',
      fileType: 'pdf',
      fileName: 'vendor_contracts_2024.pdf',
      fileSize: 3072000,
      tags: ['contracts', 'vendors', 'agreements'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Admin', lastName: 'Office' },
      uploadedAt: '2024-01-01T00:00:00Z',
      downloads: 12,
      views: 67
    },
    {
      _id: '7',
      title: 'Pool Maintenance Schedule',
      description: 'Weekly and monthly pool cleaning and chemical treatment schedule',
      category: 'maintenance',
      fileType: 'pdf',
      fileName: 'pool_maintenance.pdf',
      fileSize: 1024000,
      tags: ['pool', 'maintenance', 'cleaning'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Pool', lastName: 'Service' },
      uploadedAt: '2024-01-20T00:00:00Z',
      downloads: 28,
      views: 95
    },
    {
      _id: '8',
      title: 'Emergency Contact List',
      description: 'Contact information for emergency services and building management',
      category: 'safety',
      fileType: 'pdf',
      fileName: 'emergency_contacts.pdf',
      fileSize: 256000,
      tags: ['emergency', 'contacts', 'safety'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Security', lastName: 'Office' },
      uploadedAt: '2024-01-18T00:00:00Z',
      downloads: 156,
      views: 312
    },
    {
      _id: '9',
      title: 'Board Meeting Minutes - December',
      description: 'Minutes from the December board meeting discussing budget and maintenance',
      category: 'meetings',
      fileType: 'docx',
      fileName: 'board_minutes_dec.docx',
      fileSize: 384000,
      tags: ['board', 'meeting', 'minutes', 'december'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Secretary', lastName: 'Board' },
      uploadedAt: '2024-01-12T00:00:00Z',
      downloads: 15,
      views: 47
    },
    {
      _id: '10',
      title: 'Financial Statement Q4 2023',
      description: 'Fourth quarter financial statement and expense breakdown',
      category: 'financial',
      fileType: 'xlsx',
      fileName: 'financial_q4_2023.xlsx',
      fileSize: 892000,
      tags: ['financial', 'statement', 'quarterly', 'expenses'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Accounting', lastName: 'Firm' },
      uploadedAt: '2024-01-02T00:00:00Z',
      downloads: 22,
      views: 73
    },
    {
      _id: '11',
      title: 'Elevator Inspection Certificate',
      description: 'Annual elevator safety inspection certificate and compliance report',
      category: 'safety',
      fileType: 'pdf',
      fileName: 'elevator_inspection.pdf',
      fileSize: 1536000,
      tags: ['elevator', 'inspection', 'safety', 'certificate'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Inspection', lastName: 'Service' },
      uploadedAt: '2024-01-25T00:00:00Z',
      downloads: 41,
      views: 118
    },
    {
      _id: '12',
      title: 'Building Insurance Policy',
      description: 'Comprehensive building insurance policy documentation',
      category: 'contracts',
      fileType: 'pdf',
      fileName: 'insurance_policy.pdf',
      fileSize: 2560000,
      tags: ['insurance', 'policy', 'coverage'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Insurance', lastName: 'Agent' },
      uploadedAt: '2024-01-07T00:00:00Z',
      downloads: 8,
      views: 32
    },
    {
      _id: '13',
      title: 'HVAC System Manual',
      description: 'Operation and maintenance manual for the building HVAC system',
      category: 'maintenance',
      fileType: 'pdf',
      fileName: 'hvac_manual.pdf',
      fileSize: 3584000,
      tags: ['hvac', 'manual', 'maintenance', 'system'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'HVAC', lastName: 'Technician' },
      uploadedAt: '2024-01-14T00:00:00Z',
      downloads: 35,
      views: 87
    },
    {
      _id: '14',
      title: 'Parking Regulations',
      description: 'Updated parking rules and regulations for all residents',
      category: 'general',
      fileType: 'pdf',
      fileName: 'parking_regulations.pdf',
      fileSize: 512000,
      tags: ['parking', 'regulations', 'rules'],
      isPublic: true,
      uploadedBy: { _id: user?._id || '1', firstName: 'Management', lastName: 'Office' },
      uploadedAt: '2024-01-22T00:00:00Z',
      downloads: 89,
      views: 234
    },
    {
      _id: '15',
      title: 'Landscaping Contract',
      description: 'Annual landscaping and grounds maintenance contract',
      category: 'contracts',
      fileType: 'pdf',
      fileName: 'landscaping_contract.pdf',
      fileSize: 1792000,
      tags: ['landscaping', 'contract', 'grounds', 'maintenance'],
      isPublic: false,
      uploadedBy: { _id: user?._id || '1', firstName: 'Property', lastName: 'Manager' },
      uploadedAt: '2024-01-16T00:00:00Z',
      downloads: 19,
      views: 54
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, formData[key].split(',').map(tag => tag.trim()).join(','));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (editingDocument) {
        await api.put(`/documents/${editingDocument._id}`, submitData);
        setSuccess('Document updated successfully');
      } else {
        await api.post('/documents', submitData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });
        setSuccess('Document uploaded successfully');
      }

      setOpenDialog(false);
      setEditingDocument(null);
      setUploadProgress(0);
      resetForm();
      fetchDocuments();
    } catch (error) {
      // If API doesn't exist yet, show demo success
      if (error.response?.status === 401 || error.response?.status === 404 || !error.response) {
        setSuccess('Demo: Document would be uploaded when API is implemented');
        setOpenDialog(false);
        setEditingDocument(null);
        setUploadProgress(0);
        resetForm();
      } else {
        setError(error.response?.data?.message || 'Failed to save document');
      }
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      description: document.description,
      category: document.category,
      tags: document.tags.join(', '),
      isPublic: document.isPublic,
      file: null
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${documentId}`);
        setSuccess('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 404 || !error.response) {
          setSuccess('Demo: Document would be deleted when API is implemented');
        } else {
          setError(error.response?.data?.message || 'Failed to delete document');
        }
      }
    }
    setAnchorEl(null);
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404 || !error.response) {
        setSuccess('Demo: Document download would work when API is implemented');
      } else {
        setError('Failed to download document');
      }
    }
    setAnchorEl(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      tags: '',
      isPublic: true,
      file: null
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setPage(1);
  };

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <PdfIcon />;
      case 'doc':
      case 'docx': return <DocumentIcon />;
      case 'xls':
      case 'xlsx': return <DocumentIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <ImageIcon />;
      case 'mp4':
      case 'avi':
      case 'mov': return <VideoIcon />;
      case 'mp3':
      case 'wav': return <AudioIcon />;
      default: return <FileIcon />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'default',
      'maintenance': 'primary',
      'safety': 'error',
      'meetings': 'info',
      'financial': 'warning',
      'architectural': 'secondary',
      'contracts': 'success'
    };
    return colors[category] || 'default';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canAccessDocument = (document) => {
    return document.isPublic || canManageDocuments || document.uploadedBy._id === user?._id;
  };

  const canEditDocument = (document) => {
    return document.uploadedBy._id === user?._id || canManageDocuments;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Document Repository
        </Typography>
        {canManageDocuments && (
          <Fab
            color="primary"
            aria-label="upload document"
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

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Filter by Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="safety">Safety</MenuItem>
                  <MenuItem value="meetings">Meetings</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="architectural">Architectural</MenuItem>
                  <MenuItem value="contracts">Contracts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {loading ? (
        <Typography>Loading documents...</Typography>
      ) : (
        <>
          {documents.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No documents found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Try adjusting your search or filter settings
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {documents.filter(doc => canAccessDocument(doc)).map((document) => (
                <Grid item xs={12} sm={6} md={4} key={document._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getFileIcon(document.fileType)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                              {document.title}
                            </Typography>
                            <Chip
                              label={document.category.toUpperCase()}
                              color={getCategoryColor(document.category)}
                              size="small"
                            />
                          </Box>
                        </Box>

                        {canEditDocument(document) && (
                          <IconButton
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedDocument(document);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Chip
                          label={document.isPublic ? 'Public' : 'Private'}
                          color={document.isPublic ? 'success' : 'warning'}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(document.fileSize)}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {document.description.length > 100
                          ? `${document.description.substring(0, 100)}...`
                          : document.description
                        }
                      </Typography>

                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">
                          Tags:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {document.tags.length > 3 && (
                            <Chip
                              label={`+${document.tags.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Uploaded by {document.uploadedBy.firstName} {document.uploadedBy.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          {document.views} views
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {document.downloads} downloads
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleDownload(document._id, document.fileName)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(document._id, document.fileName)}
                      >
                        Download
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

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
        <MenuItem onClick={() => handleEdit(selectedDocument)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit Document</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleDownload(selectedDocument?._id, selectedDocument?.fileName)}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleDelete(selectedDocument?._id)}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>Delete Document</ListItemText>
        </MenuItem>
      </Menu>

      {/* Upload/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingDocument ? 'Edit Document' : 'Upload New Document'}
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Document Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.value })}
                    label="Visibility"
                  >
                    <MenuItem value={true}>Public (All residents can view)</MenuItem>
                    <MenuItem value={false}>Private (Management only)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. maintenance, procedures, manual"
                />
              </Grid>

              {!editingDocument && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      hidden
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      required={!editingDocument}
                    />
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {formData.file ? formData.file.name : 'Click to select file'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, etc.
                    </Typography>
                  </Box>
                </Grid>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <Grid item xs={12}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Uploading... {uploadProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              setEditingDocument(null);
              setUploadProgress(0);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingDocument ? 'Update' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default DocumentsPage;