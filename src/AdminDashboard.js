import React from 'react';
import { Grid2, Card, CardContent, Typography, Container } from '@mui/material';
import RevenueChart from './components/RevenueChart';
import AdminNavBar from './components/AdminNav';
import Footer from './components/Footer';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: 1254 },
    { label: 'Orders Today', value: 78 },
    { label: 'Revenue (USD)', value: '$12,400' },
    { label: 'Pending Deliveries', value: 15 },
  ];

  return (
    <AdminNavBar>
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Grid2 container spacing={3}>
          {stats.map((stat, index) => (
            <Grid2 item size={{ xs: 12, md: 6, lg: 3 }} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{stat.label}</Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
          <Grid2 item size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sales Trends</Typography>
                <RevenueChart />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
      <Footer />
    </AdminNavBar>
  );
};

export default AdminDashboard;