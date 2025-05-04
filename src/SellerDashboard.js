import React, { useState, useEffect } from 'react';
import { 
  Box, Grid2, Typography, Paper, Chip, 
  Select, MenuItem, IconButton, 
  Avatar, LinearProgress, 
  useTheme, useMediaQuery, 
  CircularProgress
} from '@mui/material';
import {
  ArrowUpward, ArrowDownward,
  Inventory, Star, AttachMoney, People, 
  Warning, Refresh, DateRange, MoreVert
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SellerNav from './components/SellerNav';
import axios from 'axios';

const SellerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [period, setPeriod] = useState('30d');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/seller/insights', {
          params: { period },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setInsights(data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  const handleRefresh = () => {
    // Implement refresh logic
  };

  const renderStatCard = (icon, title, value, change, isCurrency = false) => (
    <Paper 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        height: '100%',
        borderLeft: `4px solid ${theme.palette.primary.main}`
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar sx={{ 
          bgcolor: theme.palette.primary.light, 
          mr: 2,
          width: 40,
          height: 40
        }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Box display="flex" alignItems="flex-end">
        <Typography variant="h4" sx={{ fontWeight: 600, mr: 1 }}>
          {isCurrency ? `${Number(value / 1.3701710).toFixed(2)} JOD` : value}
        </Typography>
        {change && (
          <Chip
            size="small"
            icon={change > 0 ? <ArrowUpward /> : <ArrowDownward />}
            label={`${Math.abs(change)}%`}
            sx={{
              ml: 1,
              bgcolor: change > 0 ? theme.palette.success.light : theme.palette.error.light,
              color: change > 0 ? theme.palette.success.dark : theme.palette.error.dark
            }}
          />
        )}
      </Box>
    </Paper>
  );

  const renderRatingDistribution = () => {
    const totalReviews = insights?.ratings?.total_reviews || 0;

    // Precompute percentages for each star rating
    const ratingPercentages = {
      five: (insights?.ratings?.five_stars / totalReviews) * 100 || 0,
      four: (insights?.ratings?.four_stars / totalReviews) * 100 || 0,
      three: (insights?.ratings?.three_stars / totalReviews) * 100 || 0,
      two: (insights?.ratings?.two_stars / totalReviews) * 100 || 0,
      one: (insights?.ratings?.one_stars / totalReviews) * 100 || 0,
    };

    return (
      <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Customer Ratings
          </Typography>
          <Box display="flex" alignItems="center">
            <Star color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">
              {Number(insights?.ratings?.average_rating).toFixed(1) || '0.0'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              /5 ({totalReviews} reviews)
            </Typography>
          </Box>
        </Box>

        {Object.entries(ratingPercentages).map(([key, percentage], index) => {
          const stars = 5 - index; // Map keys to star numbers (e.g., "five" -> 5)
          return (
            <Box key={stars} display="flex" alignItems="center" mb={1}>
              <Typography variant="body2" sx={{ width: 80 }}>
                {stars} Star{stars !== 1 ? 's' : ''}
              </Typography>
              <Box flexGrow={1} mx={2}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      bgcolor:
                        stars >= 4
                          ? theme.palette.success.main
                          : stars >= 3
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {insights?.ratings?.[`${stars}_stars`] || 0}
              </Typography>
            </Box>
          );
        })}
      </Paper>
    );
  };

  const renderRevenueChart = () => {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Revenue Trend
          </Typography>
          <Select
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last Quarter</MenuItem>
          </Select>
        </Box>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={insights?.trends?.map(item => ({
            day: new Date(item.day).toLocaleDateString(),
            revenue: Number(item.revenue / 1.3701710).toFixed(2)
          }))}>
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `${value.toFixed(2)} JOD`} />
            <Tooltip formatter={(value) => [`${value} JOD`, 'Revenue']} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={theme.palette.primary.main} 
              fill={theme.palette.primary.light} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  const renderProductTable = () => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Top Performing Products
        </Typography>
        <IconButton onClick={handleRefresh}>
          <Refresh />
        </IconButton>
      </Box>
      
      <DataGrid
        rows={insights?.products || []}
        columns={[
          { 
            field: 'thumbnail', 
            headerName: '', 
            width: 60,
            renderCell: (params) => (
              <Avatar 
                src={`data:image/jpeg;base64,${params?.value}`} 
                variant="rounded"
                sx={{ width: 40, height: 40 }}
              />
            ),
            sortable: false
          },
          { field: 'name', headerName: 'Product', width: 200 },
          { 
            field: 'price', 
            headerName: 'Price (JOD)', 
            width: 100,
            valueFormatter: (params) => (
              `${Number(params / 1.3701710).toFixed(2)}`
            )
          },
          { 
            field: 'units_sold', 
            headerName: 'Sold', 
            width: 100 
          },
          { 
            field: 'revenue', 
            headerName: 'Revenue (JOD)', 
            width: 120,
            valueFormatter: (params) => (
              `${Number(params / 1.3701710).toFixed(2)}`
            )
          },
          { 
            field: 'average_rating', 
            headerName: 'Rating', 
            width: 120,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                <Star fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {Number(params?.value).toFixed(1)}
                </Typography>
              </Box>
            )
          },
          { 
            field: 'quantity_in_stock', 
            headerName: 'Stock', 
            width: 100,
            renderCell: (params) => (
              <Typography 
                variant="body2" 
                color={params?.value < 5 ? 'error' : 'inherit'}
              >
                {params?.value}
              </Typography>
            )
          }
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`
          }
        }}
      />
    </Paper>
  );

  const renderInventoryAlerts = () => (
    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Inventory Alerts
        </Typography>
        <Chip 
          label={`${insights?.alerts?.length || 0} items`} 
          color="warning"
          variant='outlined'
          size="small"
        />
      </Box>
      
      {insights?.alerts?.length > 0 ? (
        <Box>
          {insights.alerts.map((item) => (
            <Box 
              key={item.id} 
              display="flex" 
              alignItems="center" 
              p={2} 
              mb={1}
              sx={{ 
                border: `1px solid ${theme.palette.warning.light}`,
                borderRadius: 1,
                '&:last-child': { mb: 0 }
              }}
            >
              <Warning color="warning" sx={{ mr: 2 }} />
              <Box flexGrow={1}>
                <Typography variant="subtitle2">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Only {item.quantity_in_stock} left in stock
                </Typography>
              </Box>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100%"
          py={4}
        >
          <Inventory fontSize="large" color="disabled" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            No inventory alerts
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <SellerNav>
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6" color='warning' sx={{ fontWeight: 700 }}>
          Insights
        </Typography>
        <Box display="flex" alignItems="center">
          <DateRange color="action" sx={{ mr: 1 }} />
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last Quarter</MenuItem>
          </Select>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            
              <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, md: 6, lg: 3 }}>
                  {renderStatCard(
                    <AttachMoney />,
                    "Total Revenue",
                    insights?.overview?.total_revenue || 0,
                    12.5,
                    true
                  )}
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 6, lg: 3 }}>
                  {renderStatCard(
                    <Inventory />,
                    "Total Orders",
                    insights?.overview?.total_orders || 0,
                    8.2
                  )}
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 6, lg: 3 }}>
                  {renderStatCard(
                    <People />,
                    "Conversion Rate",
                    `${(insights?.overview?.conversion_rate * 100).toFixed(1)}%`,
                    -2.3
                  )}
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 6, lg: 3 }}>
                  {renderStatCard(
                    <Star />,
                    "Avg. Rating",
                    Number(insights?.ratings?.average_rating).toFixed(1) || 0,
                    1.8
                  )}
                </Grid2>

                <Grid2 item size={{ xs: 12, lg: 8 }}>
                  {renderRevenueChart()}
                </Grid2>
                <Grid2 item size={{ xs: 12, lg: 4 }}>
                  {renderRatingDistribution()}
                </Grid2>

                <Grid2 item size={{ xs: 12, md: 6 }}>
                  {renderProductTable()}
                </Grid2>
                <Grid2 item size={{ xs: 12, lg: 6 }}>
                  {renderInventoryAlerts()}
                </Grid2>
              </Grid2>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
    </SellerNav>
  );
};

export default SellerDashboard;