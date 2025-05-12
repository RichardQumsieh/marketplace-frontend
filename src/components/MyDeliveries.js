import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Card, 
  CardContent, 
  Divider, 
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid2,
  Paper
} from '@mui/material';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';

// Custom icons
const deliveryTruckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/284/284733.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const warehouseIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619032.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const orderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const steps = ['Assigned', 'Shipped', 'Delivered'];

const MyDelivery = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  
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
      setActiveOrders(response.data.orders);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPickup = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/confirm-pickup/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      fetchActiveOrders();
    } catch (err) {
      setError('Failed to confirm pickup');
      console.error(err);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/complete-delivery/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      fetchActiveOrders();
    } catch (err) {
      setError('Failed to complete delivery');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };
  }, []);

  // Calculate bounds when orders or location change
  useEffect(() => {
    if (activeOrders.length > 0 || currentLocation) {
      const locations = [];
      
      if (currentLocation) {
        locations.push([currentLocation.lat, currentLocation.lng]);
      }

      activeOrders.forEach(order => {
        if (order.address.coordinates) {
          locations.push([order.address.coordinates[1], order.address.coordinates[0]]);
        }
      });

      if (locations.length > 0) {
        setMapBounds(L.latLngBounds(locations).pad(0.2));
      }
    }
  }, [activeOrders, currentLocation]);

  const getActiveStep = (status) => {
    switch (status) {
      case 'Assigned': return 0;
      case 'Shipped': return 1;
      case 'Delivered': return 2;
      default: return 0;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Active Deliveries
      </Typography>
      
      {activeOrders.length === 0 ? (
        <Alert severity="info">You don't have any active deliveries</Alert>
      ) : (
        <Grid2 container spacing={3}>
          {/* Map Column */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ height: '500px', borderRadius: 2 }}>
              <MapContainer
                center={currentLocation || [31.9454, 35.9284]} // Default to Amman
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                bounds={mapBounds}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Current Location */}
                {currentLocation && (
                  <Marker 
                    position={[currentLocation.lat, currentLocation.lng]}
                    icon={deliveryTruckIcon}
                  >
                    <Popup>
                      <Typography variant="subtitle2">Your Current Location</Typography>
                    </Popup>
                  </Marker>
                )}
                
                {/* Order Locations */}
                {activeOrders.map(order => (
                  <Marker
                    key={order.id}
                    position={[
                      order.address.coordinates[1], // lat
                      order.address.coordinates[0]  // lng
                    ]}
                    icon={orderIcon}
                  >
                    <Popup>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Order #{order.id}
                        </Typography>
                        <Typography variant="body2">
                          Status: {order.status}
                        </Typography>
                        <Typography variant="body2">
                          {order.address.street}, {order.address.city}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Paper>
          </Grid2>
          
          {/* Orders List Column */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            {activeOrders.map((order) => (
              <Card key={order.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Typography color="textSecondary">
                    {Number(order.total_amount / 1.3701710).toFixed(2)} JOD
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>
                      <strong>Delivery Address:</strong> {order.address.street}, {order.address.city}
                    </Typography>
                    <Typography>
                      <strong>Governorate:</strong> {order.address.governorate}
                    </Typography>
                    <Typography>
                      <strong>Distance:</strong> {order.distance ? `${(order.distance / 1000).toFixed(1)} km` : 'Unknown'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    {order.status === 'Assigned' && (
                      <Button
                        variant="contained"
                        onClick={() => handleConfirmPickup(order.id)}
                        startIcon={<LocalShippingIcon />}
                      >
                        Confirm Pickup
                      </Button>
                    )}
                    
                    {order.status === 'Shipped' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleCompleteDelivery(order.id)}
                        startIcon={<WarehouseIcon />}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
};

export default MyDelivery;