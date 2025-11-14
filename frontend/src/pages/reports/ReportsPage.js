import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Assessment as ReportIcon,
  PictureAsPdf as PdfIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import api from '../../services/apiService';

// Import report components
import ReportFilters from './components/ReportFilters';
import ReportPreview from './components/ReportPreview';
import ReportSummaryCards from './components/ReportSummaryCards';
import ExportButtons from './components/ExportButtons';

const ReportsPage = () => {
  const { user } = useSelector((state) => state.auth);
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState('income_statement');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    category: '',
    classification: '',
    status: '',
    customRange: false
  });

  // Report types configuration
  const reportTypes = [
    { id: 'income_statement', name: 'Income Statement', icon: '📊' },
    { id: 'cash_flow', name: 'Cash Flow', icon: '💰' },
    { id: 'transaction_summary', name: 'Transaction Summary', icon: '📋' },
    { id: 'budget_variance', name: 'Budget Variance', icon: '📈' },
    { id: 'outstanding_dues', name: 'Outstanding Dues', icon: '⏰' }
  ];

  // Load initial data
  useEffect(() => {
    fetchMetadata();
    fetchStatistics();
  }, []);

  // Generate report when filters change (with debouncing)
  useEffect(() => {
    if (filters.startDate && filters.endDate && !loading) {
      const timeoutId = setTimeout(() => {
        generateReport();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [reportType, filters.startDate, filters.endDate]);

  const fetchMetadata = async () => {
    try {
      const response = await api.get('/reports/metadata');
      if (response.data.success) {
        setMetadata(response.data.metadata);
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/reports/statistics', {
        params: { period: filters.dateRange }
      });
      if (response.data.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const generateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select a date range');
      return;
    }

    if (loading) {
      console.log('⏳ Report generation already in progress, skipping...');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log(`📊 Generating ${reportType} report from ${filters.startDate} to ${filters.endDate}...`);

      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      };

      // Add optional filters
      if (filters.category) params.category = filters.category;
      if (filters.classification) params.classification = filters.classification;
      if (filters.status) params.status = filters.status;

      const startTime = Date.now();
      const response = await api.get(`/reports/financial/${reportType}`, {
        params,
        timeout: 30000 // 30 second timeout
      });
      const endTime = Date.now();

      if (response.data.success) {
        setReportData(response.data.report);
        setSuccess(`Report generated successfully in ${((endTime - startTime) / 1000).toFixed(1)}s`);
        console.log(`✅ Report generated in ${endTime - startTime}ms:`, response.data.report);
      }
    } catch (error) {
      console.error('Report generation error:', error);
      setError(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setReportType(reportTypes[newValue].id);
    setReportData(null); // Clear previous report data
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      setError('Please generate a report first');
      return;
    }

    try {
      setLoading(true);
      console.log('📄 Exporting PDF...');

      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      };

      if (filters.category) params.category = filters.category;
      if (filters.classification) params.classification = filters.classification;
      if (filters.status) params.status = filters.status;

      const response = await api.get(`/reports/pdf/${reportType}`, {
        params,
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!reportData) {
      setError('Please generate a report first');
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Exporting CSV...');

      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      };

      if (filters.category) params.category = filters.category;
      if (filters.classification) params.classification = filters.classification;
      if (filters.status) params.status = filters.status;

      const response = await api.get(`/reports/export/csv/${reportType}`, {
        params,
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess('CSV exported successfully');
    } catch (error) {
      console.error('CSV export error:', error);
      setError('Failed to export CSV');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportData) {
      setError('Please generate a report first');
      return;
    }
    window.print();
  };

  const handleRefresh = () => {
    generateReport();
    fetchStatistics();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Helmet>
        <title>Financial Reports - SpanTower27</title>
      </Helmet>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportIcon color="primary" />
          Financial Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate comprehensive financial reports with charts, analytics, and export options
        </Typography>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Summary Statistics Cards */}
      {statistics && (
        <ReportSummaryCards statistics={statistics} sx={{ mb: 4 }} />
      )}

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filters Panel */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Filters
              </Typography>
              <ReportFilters
                filters={filters}
                metadata={metadata}
                onFiltersChange={handleFiltersChange}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="contained"
                fullWidth
                onClick={generateReport}
                disabled={loading || !filters.startDate || !filters.endDate}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                sx={{ mb: 2 }}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>

              {reportData && (
                <ExportButtons
                  onExportPDF={handleExportPDF}
                  onExportCSV={handleExportCSV}
                  onPrint={handlePrint}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Report Content */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              {/* Report Type Tabs */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
              >
                {reportTypes.map((type, index) => (
                  <Tab
                    key={type.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{type.icon}</span>
                        {type.name}
                      </Box>
                    }
                  />
                ))}
              </Tabs>

              {/* Report Preview */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                  <CircularProgress size={60} />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    Generating {reportTypes[activeTab]?.name}...
                  </Typography>
                </Box>
              ) : reportData ? (
                <ReportPreview
                  reportData={reportData}
                  reportType={reportType}
                  filters={filters}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <ReportIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Report Generated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select your filters and click "Generate Report" to view financial data
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsPage;
