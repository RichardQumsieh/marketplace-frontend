import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const steps = ['Claimed', 'Pickup Confirmed', 'Delivered'];

const MyDeliveries = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/delivery-personnel/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setActiveOrders(response.data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPickup = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/confirm-pickup/${orderId}`);
      fetchActiveOrders();
    } catch (err) {
      setError('Failed to confirm pickup');
      console.error(err);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/complete-delivery/${orderId}`);
      fetchActiveOrders();
    } catch (err) {
      setError('Failed to complete delivery');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
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
        Your Active Deliveries
      </Typography>
      
      {activeOrders.length === 0 ? (
        <Alert severity="info">You don't have any active deliveries</Alert>
      ) : (
        <Box>
          {activeOrders.map((order) => (
            <Card key={order.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography color="textSecondary">
                  ${order.total_amount} • {order.items.length} items
                </Typography>
                
                <Box sx={{ width: '100%', mt: 3 }}>
                  <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Pickup:</strong> {order.seller.business_name}
                  </Typography>
                  <Typography>
                    <strong>Delivery:</strong> {order.street}, {order.city}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  {order.status === 'Assigned' && (
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmPickup(order.id)}
                    >
                      Confirm Pickup
                    </Button>
                  )}
                  
                  {order.status === 'Shipped' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleCompleteDelivery(order.id)}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

function getActiveStep(status) {
  switch (status) {
    case 'Assigned': return 0;
    case 'Shipped': return 1;
    case 'Delivered': return 2;
    default: return 0;
  }
}

export default MyDeliveries;