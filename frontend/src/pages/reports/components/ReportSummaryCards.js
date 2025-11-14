import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Receipt as IncomeIcon,
  Payment as ExpenseIcon,
  Schedule as DuesIcon
} from '@mui/icons-material';

const ReportSummaryCards = ({ statistics, sx }) => {
  if (!statistics) return null;

  const { summary, outstandingDues, trends, period } = statistics;

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  const formatTrend = (value) => {
    if (!value) return { text: 'No change', color: 'text.secondary', icon: null };
    
    const isPositive = value > 0;
    return {
      text: `${isPositive ? '+' : ''}${formatCurrency(value)}`,
      color: isPositive ? 'success.main' : 'error.main',
      icon: isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />
    };
  };

  const calculateProfitMargin = () => {
    if (!summary?.totalIncome || summary.totalIncome === 0) return 0;
    return ((summary.netIncome / summary.totalIncome) * 100).toFixed(1);
  };

  const summaryCards = [
    {
      title: 'Net Income',
      value: formatCurrency(summary?.netIncome),
      subtitle: `Profit Margin: ${calculateProfitMargin()}%`,
      trend: formatTrend(trends?.netIncomeGrowth),
      icon: <BalanceIcon />,
      color: summary?.netIncome >= 0 ? 'success' : 'error',
      progress: Math.min(Math.abs(calculateProfitMargin()), 100)
    },
    {
      title: 'Total Income',
      value: formatCurrency(summary?.totalIncome),
      subtitle: `${period?.name?.replace(/([A-Z])/g, ' $1').trim() || 'This Period'}`,
      trend: formatTrend(trends?.incomeGrowth),
      icon: <IncomeIcon />,
      color: 'primary',
      progress: 85
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary?.totalExpenses),
      subtitle: `${period?.name?.replace(/([A-Z])/g, ' $1').trim() || 'This Period'}`,
      trend: formatTrend(trends?.expenseGrowth),
      icon: <ExpenseIcon />,
      color: 'warning',
      progress: 65
    },
    {
      title: 'Outstanding Dues',
      value: formatCurrency(outstandingDues?.totalOutstanding),
      subtitle: `${outstandingDues?.pendingCount || 0} pending, ${outstandingDues?.overdueCount || 0} overdue`,
      trend: null,
      icon: <DuesIcon />,
      color: outstandingDues?.overdueCount > 0 ? 'error' : 'info',
      progress: outstandingDues?.overdueCount > 0 ? 90 : 30
    }
  ];

  return (
    <Grid container spacing={3} sx={sx}>
      {summaryCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${card.color === 'success' ? '#e8f5e8' : 
                                                   card.color === 'error' ? '#ffeaea' :
                                                   card.color === 'warning' ? '#fff8e1' :
                                                   card.color === 'info' ? '#e3f2fd' : '#f3e5f5'} 0%, white 100%)`,
              border: '1px solid',
              borderColor: `${card.color}.200`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent>
              {/* Header with Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  {card.title}
                </Typography>
                <Avatar 
                  sx={{ 
                    bgcolor: `${card.color}.100`, 
                    color: `${card.color}.main`,
                    width: 40,
                    height: 40
                  }}
                >
                  {card.icon}
                </Avatar>
              </Box>

              {/* Main Value */}
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={`${card.color}.main`}
                sx={{ mb: 1 }}
              >
                {card.value}
              </Typography>

              {/* Subtitle */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {card.subtitle}
              </Typography>

              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={card.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: `${card.color}.50`,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: `${card.color}.main`,
                    borderRadius: 3
                  },
                  mb: 1
                }}
              />

              {/* Trend Information */}
              {card.trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    vs last period
                  </Typography>
                  <Chip
                    icon={card.trend.icon}
                    label={card.trend.text}
                    size="small"
                    sx={{
                      bgcolor: 'transparent',
                      color: card.trend.color,
                      border: '1px solid',
                      borderColor: card.trend.color,
                      '& .MuiChip-icon': {
                        color: card.trend.color
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Period Information Card */}
      <Grid item xs={12}>
        <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Report Period: {period?.name?.replace(/([A-Z])/g, ' $1').trim() || 'Custom Range'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {period?.startDate && period?.endDate && (
                    `${new Date(period.startDate).toLocaleDateString()} - ${new Date(period.endDate).toLocaleDateString()}`
                  )}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Income: ${formatCurrency(summary?.totalIncome)}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Expenses: ${formatCurrency(summary?.totalExpenses)}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`Net: ${formatCurrency(summary?.netIncome)}`}
                  size="small"
                  color={summary?.netIncome >= 0 ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportSummaryCards;
