import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import axios from 'axios';

const LocationUpdater = () => {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleToggle = (event) => {
    const { checked } = event.target;
    setIsActive(checked);
    
    if (checked) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  };

  const startLocationTracking = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        updateBackendLocation(latitude, longitude);
      },
      (err) => {
        setError('Error getting location: ' + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    
    setWatchId(id);
    setLoading(false);
  };

  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const updateBackendLocation = async (lat, lng) => {
    try {
      await axios.post('http://localhost:5000/api/update-location', {
        lat,
        lng
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    } catch (err) {
      console.error('Failed to update location', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location Settings
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={handleToggle}
              color="primary"
            />
          }
          label="Share my live location"
        />
        
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {location && (
          <Box sx={{ mt: 2 }}>
            <Typography>
              Your current location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </Typography>
          </Box>
        )}
        
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            if (location) {
              updateBackendLocation(location.lat, location.lng);
            }
          }}
        >
          Update Location Now
        </Button>
      </Paper>
    </Box>
  );
};

export default LocationUpdater;