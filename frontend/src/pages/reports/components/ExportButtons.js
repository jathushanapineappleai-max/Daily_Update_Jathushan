import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

const ExportButtons = ({ onExportPDF, onExportCSV, onPrint, loading }) => {
  const exportOptions = [
    {
      label: 'Export PDF',
      icon: <PdfIcon />,
      onClick: onExportPDF,
      color: 'error',
      description: 'Professional formatted report'
    },
    {
      label: 'Export CSV',
      icon: <CsvIcon />,
      onClick: onExportCSV,
      color: 'success',
      description: 'Spreadsheet compatible data'
    },
    {
      label: 'Print',
      icon: <PrintIcon />,
      onClick: onPrint,
      color: 'primary',
      description: 'Print current view'
    }
  ];

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DownloadIcon fontSize="small" />
        Export Options
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {exportOptions.map((option, index) => (
          <Button
            key={index}
            variant="outlined"
            color={option.color}
            startIcon={loading ? <CircularProgress size={16} /> : option.icon}
            onClick={option.onClick}
            disabled={loading}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              py: 1.5,
              '&:hover': {
                bgcolor: `${option.color}.50`
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 1 }}>
              <Typography variant="button" fontWeight="medium">
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.description}
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 <strong>Export Tips:</strong>
          <br />
          • PDF: Best for sharing and archiving
          <br />
          • CSV: Import into Excel or other tools
          <br />
          • Print: Quick hard copy reference
        </Typography>
      </Box>
    </Box>
  );
};

export default ExportButtons;
