import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Delivery will be made here</Popup>
    </Marker>
  );
};

const DeliveryLocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationOption, setLocationOption] = useState('current');
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userPos = { lat: latitude, lng: longitude };
          setUserLocation(userPos);
          setPosition(userPos);
          reverseGeocode(userPos);
          setLoading(false);
          onLocationChange({ delivery_lat: latitude, delivery_lng: longitude });
        },
        (err) => {
          setError('Unable to retrieve your location. Please enable location services or select a location manually.');
          setLoading(false);
          setLocationOption('manual');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please select a location manually.');
      setLoading(false);
      setLocationOption('manual');
    }
  }, []);

  const reverseGeocode = async (latlng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setAddress(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
    }
  };

  const handleMapClick = (newPosition) => {
    setPosition(newPosition);
    setLocationOption('manual');
    reverseGeocode(newPosition);
    onLocationChange({ delivery_lat: newPosition.lat, delivery_lng: newPosition.lng });
  };

  const handleLocationOptionChange = (event) => {
    const option = event.target.value;
    setLocationOption(option);
    
    if (option === 'current' && userLocation) {
      setPosition(userLocation);
      reverseGeocode(userLocation);
      onLocationChange({ delivery_lat: userLocation.lat, delivery_lng: userLocation.lng });
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
        <CircularProgress size={60} />
        <Typography variant="body1" mt={2}>Detecting your current location...</Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid2 container spacing={3}>
          <Grid2 item size={12}>
            <Typography variant="h6" gutterBottom>
              Select Delivery Location
            </Typography>
            
            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <RadioGroup
              row
              value={locationOption}
              onChange={handleLocationOptionChange}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                value="current"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <MyLocationIcon sx={{ mr: 1 }} />
                    <Typography>Use my current location</Typography>
                  </Box>
                }
                disabled={!userLocation}
              />
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography>Select different location</Typography>
                  </Box>
                }
              />
            </RadioGroup>

            {position && (
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
                <Typography variant="subtitle2">Selected Location:</Typography>
                <Typography variant="body2">{address}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}
                </Typography>
              </Paper>
            )}
          </Grid2>

          <Grid2 item size={12}>
            <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={userLocation || [0, 0]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={position} setPosition={handleMapClick} />
              </MapContainer>
            </Box>
          </Grid2>

          <Grid2 item size={12}>
            <Typography variant="caption" color="text.secondary">
              {locationOption === 'current'
                ? 'Your current location will be used for delivery.'
                : 'Click on the map to select your delivery location.'}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default DeliveryLocationPicker;