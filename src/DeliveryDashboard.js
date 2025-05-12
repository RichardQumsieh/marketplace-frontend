import { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import AvailableOrders from './components/AvailableOrders';
import MyDeliveries from './components/MyDeliveries';
import LocationUpdater from './components/LocationUpdater';
import BusinessNavBar from './components/BusinessNavBar';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';

const validTabs = ['available-orders', 'my-deliveries', 'location-settings'];

const DeliveryDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('page');

  // Validate the initial tab value
  const [tabValue, setTabValue] = useState(
    validTabs.includes(initialTab) ? initialTab : 'available-orders'
  );
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Update the URL with the new tab value
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', newValue);
    window.history.pushState({}, '', newUrl);
  };

  useEffect(() => {
    // Check if delivery personnel has an assigned area
    const checkAssignment = async () => {
      try {
        await axios.get(`http://localhost:5000/api/delivery/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
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
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab label="Available Orders" value="available-orders" />
          <Tab label="My Deliveries" value="my-deliveries" />
          <Tab label="Location Settings" value="location-settings" />
        </Tabs>
      </Paper>

      <Container maxWidth="xl" sx={{ minHeight: '53vh' }}>
        <Box sx={{ mb: 4 }}>
          {tabValue === 'available-orders' && <AvailableOrders />}
          {tabValue === 'my-deliveries' && <MyDeliveries />}
          {tabValue === 'location-settings' && <LocationUpdater />}
        </Box>
      </Container>
      <Footer />
    </BusinessNavBar>
  );
};

export default DeliveryDashboard;