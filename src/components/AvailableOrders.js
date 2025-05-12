import { Fragment, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid2, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  Avatar } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const createCustomIcon = (iconComponent, color) => {
  const iconHtml = `
    <div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${iconComponent}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-icon',
    iconSize: [40, 40]
  });
};

// Create icon components as strings
const DeliveryTruckIcon = `
  <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="white" d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17S18.83 15.5 18 15.5 16.5 16.17 16.5 17 17.17 18.5 18 18.5M19.5 9.5H17V12H21.46L19.5 9.5M6 18.5C6.83 18.5 7.5 17.83 7.5 17S6.83 15.5 6 15.5 4.5 16.17 4.5 17 5.17 18.5 6 18.5M20 8L23 12V17H21C21 18.66 19.66 20 18 20S15 18.66 15 17H9C9 18.66 7.66 20 6 20S3 18.66 3 17H1V6C1 4.89 1.89 4 3 4H17V8H20M3 6V15H3.76C4.31 14.39 5.11 14 6 14S7.69 14.39 8.24 15H15V6H3Z" />
  </svg>
`;

const WarehouseBuildingIcon = `
  <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="white" d="M6 19H8V21H6V19M12 3L2 8V21H4V13H20V21H22V8L12 3M8 11H4V9H8V11M14 11H10V9H14V11M20 11H16V9H20V11M8 15H4V13H8V15M14 15H10V13H14V15M20 15H16V13H20V15M14 19H10V17H14V19M20 19H16V17H20V19M18 11V9H22V11H18M18 15V13H22V15H18Z" />
  </svg>
`;

const ShoppingBagIconSVG = `
  <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="white" d="M19 6H17C17 3.2 14.8 1 12 1S7 3.2 7 6H5C3.9 6 3 6.9 3 8V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8C21 6.9 20.1 6 19 6M12 3C13.7 3 15 4.3 15 6H9C9 4.3 10.3 3 12 3M19 20H5V8H19V20M12 12C10.3 12 9 10.7 9 9H7C7 11.8 9.2 14 12 14S17 11.8 17 9H15C15 10.7 13.7 12 12 12Z" />
  </svg>
`;

const deliveryTruckIcon = createCustomIcon(DeliveryTruckIcon, '#1976d2');
const warehouseIcon = createCustomIcon(WarehouseBuildingIcon, '#ff5722');
const orderIcon = createCustomIcon(ShoppingBagIconSVG, '#4caf50');

const AvailableOrders = ({ deliveryPersonId }) => {
  const [orders, setOrders] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/available-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        
        setOrders(data.data);
        setCurrentLocation(data.currentLocation);
        setWarehouseLocation(data.warehouseLocation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableOrders();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAvailableOrders, 30000);
    return () => clearInterval(interval);
  }, [deliveryPersonId]);

  if (loading) return <div className="loading">Loading available orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Box sx={{ height: '100%' }}>
      <Grid2 container spacing={3} sx={{ height: '100%' }}>
        {/* Map Section */}
        <Grid2 item size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
            <MapContainer
              center={currentLocation || [31.9454, 35.9284]}
              zoom={13}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Current Location (Delivery Truck) */}
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
              
              {/* Warehouse Location */}
              {warehouseLocation && (
                <Marker 
                  position={[
                    warehouseLocation.coordinates[1], 
                    warehouseLocation.coordinates[0]
                  ]}
                  icon={warehouseIcon}
                >
                  <Popup>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Assigned Warehouse
                      </Typography>
                      <Chip 
                        label="Main Hub" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Popup>
                </Marker>
              )}
              
              {/* Available Orders */}
              {orders.map(order => (
                <Marker
                  key={order.id}
                  position={[
                    order.location.governorate_center.coordinates[1],
                    order.location.governorate_center.coordinates[0]
                  ]}
                  icon={orderIcon}
                >
                  <Popup>
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Order #{order.id}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          width: 24, 
                          height: 24,
                          mr: 1
                        }}>
                          <ShoppingBagIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2">
                          {(order.distance_meters / 1000).toFixed(1)} km away
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Amount:</strong> {Number(order.total_amount / 1.3701710).toFixed(2)} JOD
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Customer:</strong> {order.buyer_name}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {order.street}, {order.city}
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        size="small"
                        fullWidth
                        onClick={() => claimOrder(order.id)}
                        startIcon={<LocalShippingIcon />}
                      >
                        Claim Order
                      </Button>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </Grid2>
        
        {/* Orders List Section */}
        <Grid2 item size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ height: '600px', overflow: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
              Available Orders
            </Typography>
            
            {orders.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '80%'
              }}>
                <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  No available orders in your area
                </Typography>
              </Box>
            ) : (
              <List dense>
                {orders.map(order => (
                  <Fragment key={order.id}>
                    <ListItem 
                      secondaryAction={
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => claimOrder(order.id)}
                          startIcon={<LocalShippingIcon />}
                        >
                          Claim
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={`Order #${order.id}`}
                        secondary={
                          <>
                            <Box component="span" sx={{ display: 'block' }}>
                              {order.buyer_name} • {(order.distance_meters / 1000).toFixed(1)} km
                            </Box>
                            <Box component="span" sx={{ display: 'block' }}>
                              <Chip 
                                label={`${Number(order.total_amount / 1.3701710).toFixed(2)} JOD`} 
                                size="small" 
                                color="success"
                                sx={{ mr: 1 }}
                              />
                              {order.street}, {order.city}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );

  async function claimOrder(orderId) {
    try {
      const response = await axios.post(`http://localhost:5000/api/claim-order/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.status === 200) {
        // Refresh available orders
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (err) {
      console.error('Failed to claim order:', err);
    }
  }
};

export default AvailableOrders;