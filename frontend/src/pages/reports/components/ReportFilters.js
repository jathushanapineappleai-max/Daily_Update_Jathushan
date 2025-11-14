import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import api from '../../../services/apiService';

const ReportFilters = ({ filters, metadata, onFiltersChange }) => {
  const [dateRanges, setDateRanges] = useState({});
  const [localFilters, setLocalFilters] = useState(filters);

  // Predefined date range options
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'lastQuarter', label: 'Last Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  useEffect(() => {
    fetchDateRanges();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchDateRanges = async () => {
    try {
      const response = await api.get('/reports/date-ranges');
      if (response.data.success) {
        setDateRanges(response.data.dateRanges);
      }
    } catch (error) {
      console.error('Failed to fetch date ranges:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...localFilters, [field]: value };

    // Handle date range selection
    if (field === 'dateRange' && value !== 'custom') {
      const selectedRange = dateRanges[value];
      if (selectedRange) {
        updatedFilters.startDate = formatDateForInput(selectedRange.startDate);
        updatedFilters.endDate = formatDateForInput(selectedRange.endDate);
        updatedFilters.customRange = false;
      }
    } else if (field === 'dateRange' && value === 'custom') {
      updatedFilters.customRange = true;
    }

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const clearFilters = () => {
    const clearedFilters = {
      ...localFilters,
      category: '',
      classification: '',
      status: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.classification) count++;
    if (localFilters.status) count++;
    return count;
  };

  return (
    <Box>
      {/* Date Range Selection */}
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DateRangeIcon fontSize="small" />
        Date Range
      </Typography>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Select Period</InputLabel>
        <Select
          value={localFilters.dateRange}
          label="Select Period"
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        >
          {dateRangeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Custom Date Range */}
      {localFilters.customRange && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      )}

      {/* Selected Date Range Display */}
      {localFilters.startDate && localFilters.endDate && (
        <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Selected Range:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {formatDateForDisplay(localFilters.startDate)} - {formatDateForDisplay(localFilters.endDate)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Advanced Filters */}
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterIcon fontSize="small" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Chip 
            label={getActiveFiltersCount()} 
            size="small" 
            color="primary" 
            sx={{ ml: 'auto' }}
          />
        )}
      </Typography>

      {/* Category Filter */}
      {metadata?.categories && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={localFilters.category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {metadata.categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Classification Filter */}
      {metadata?.classifications && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Classification</InputLabel>
          <Select
            value={localFilters.classification}
            label="Classification"
            onChange={(e) => handleFilterChange('classification', e.target.value)}
          >
            <MenuItem value="">All Classifications</MenuItem>
            {metadata.classifications.map((classification) => (
              <MenuItem key={classification} value={classification}>
                {classification.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Status Filter */}
      {metadata?.statuses && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={localFilters.status}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {metadata.statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace(/\b\w/g, l => l.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {localFilters.category && (
              <Chip
                label={`Category: ${localFilters.category.replace('_', ' ')}`}
                size="small"
                onDelete={() => handleFilterChange('category', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {localFilters.classification && (
              <Chip
                label={`Type: ${localFilters.classification.replace('_', ' ')}`}
                size="small"
                onDelete={() => handleFilterChange('classification', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {localFilters.status && (
              <Chip
                label={`Status: ${localFilters.status}`}
                size="small"
                onDelete={() => handleFilterChange('status', '')}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
          
          {getActiveFiltersCount() > 1 && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={clearFilters}
              >
                Clear All Filters
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Filter Tips */}
      <Box sx={{ mt: 2, p: 1, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
        <Typography variant="caption" color="info.main">
          💡 <strong>Tip:</strong> Use filters to narrow down your report data. Combine multiple filters for more specific insights.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportFilters;
