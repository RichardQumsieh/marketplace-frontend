import { useEffect, useState } from 'react';
import { Box, Grid2, Typography, Paper, CircularProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import AdminNavBar from './components/AdminNav';
import Footer from './components/Footer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InsightsDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/insights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setInsights(response.data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!insights) {
    return (
      <Box p={3}>
        <Typography variant="h6">Failed to load insights data</Typography>
      </Box>
    );
  }

  return (
    <AdminNavBar>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Platform Insights
        </Typography>

        <Grid2 container spacing={3} mb={4}>
          <Grid2 item size={{ xs: 12, md: 4 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">
                {insights.userStats.reduce((acc, stat) => acc + parseInt(stat.count), 0)}
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 item size={{ xs: 12, md: 4 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Active Products
              </Typography>
              <Typography variant="h3">{insights.productCount}</Typography>
            </Paper>
          </Grid2>
          <Grid2 item size={{ xs: 12, md: 4 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Completed Orders
              </Typography>
              <Typography variant="h3">
                {insights.orderStats.find(o => o.status === 'Delivered')?.count || 0}
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={3} mb={4}>
          <Grid2 item size={{ xs: 12, md: 4 }}>
            <Paper elevation={1} sx={{ p: 2, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trends (Last 12 Months)
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={insights.revenueTrends.map(u => ({ ...u, month: new Date(u.month).toLocaleDateString() }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid2>
          <Grid2 item size={{ xs: 12, md: 5 }}>
            <Paper elevation={1} sx={{ p: 2, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                      data={insights.userStats.map(u => ({ ...u, count: Number(u.count) }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="user_type"
                      label={({ user_type, percent }) => `${user_type}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {insights.userStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={3}>
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Paper elevation={1} sx={{ p: 2, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insights.orderStats}
                  margin={{ top: 5, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Order Count" />
                  <Bar dataKey="total_value" fill="#82ca9d" name="Total Value" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid2>
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Paper elevation={1} sx={{ p: 2, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Top Sellers
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={insights.topSellers}
                  margin={{ top: 5, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="store_name" type="category" width={110} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_sales" fill="#8884d8" name="Total Sales" />
                  <Bar dataKey="order_count" fill="#82ca9d" name="Order Count" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
      <Footer />
    </AdminNavBar>
  );
};

export default InsightsDashboard;