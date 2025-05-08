import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Container, 
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import AvailableOrders from './components/AvailableOrders';
import MyDeliveries from './components/MyDeliveries';
import DeliveryAreaForm from './components/DeliveryAreaForm';
import LocationUpdater from './components/LocationUpdater';
import BusinessNavBar from './components/BusinessNavBar';

const DeliveryDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Check if delivery personnel has an assigned area
    const checkAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/delivery/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.data.service_area_id) {
          setTabValue(2); // Auto-switch to area assignment if none
        }
      } catch (err) {
        console.error('Failed to fetch delivery personnel data', err);
      } finally {
        setLoading(false);
      }
    };
    checkAssignment();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BusinessNavBar>
        <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
            Delivery Dashboard
        </Typography>
        
        <Paper elevation={3} sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
            <Tab label="Available Orders" />
            <Tab label="My Deliveries" />
            <Tab label="My Delivery Area" />
            <Tab label="Location Settings" />
            </Tabs>
        </Paper>

        <Box sx={{ mb: 4 }}>
            {tabValue === 0 && <AvailableOrders />}
            {tabValue === 1 && <MyDeliveries />}
            {tabValue === 2 && <DeliveryAreaForm />}
            {tabValue === 3 && <LocationUpdater />}
        </Box>
        </Container>
    </BusinessNavBar>
  );
};

export default DeliveryDashboard;