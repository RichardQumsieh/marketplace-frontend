import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid2,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/available-orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load available orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/claim-order/${orderId}`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
      fetchAvailableOrders(); // Refresh the list
    } catch (err) {
      setError('Failed to claim order');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Orders Available in Your Area
      </Typography>
      
      {orders.length === 0 ? (
        <Alert severity="info">No orders available in your area at the moment</Alert>
      ) : (
        <Grid2 container spacing={3}>
          {orders.map((order) => (
            <Grid2 item size={{ xs: 12, md: 6 }} key={order.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Typography color="textSecondary">
                    {order.items.length} items • ${order.total_amount}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Chip 
                      label={order.payment_status} 
                      color={order.payment_status === 'Completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2">
                    Delivery to: {order.street}, {order.city}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleClaimOrder(order.id)}
                      fullWidth
                    >
                      Claim This Order
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default AvailableOrders;