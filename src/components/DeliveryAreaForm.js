// DeliveryAreaForm.jsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import AreaMapInput from './AreaMapInput';
import axios from 'axios';

const DeliveryAreaForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
    isActive: true,
    coordinates: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.coordinates.length < 3) {
      setError('Please draw a valid polygon with at least 3 points');
      return;
    }

    setLoading(true);

    try {
        // Transform coordinates to server format
        const payload = {
        ...formData,
        coordinates: formData.coordinates.map(coord => ({
            lat: parseFloat(coord[0]),
            lng: parseFloat(coord[1])
        }))
        };
    
        await axios.post('http://localhost:5000/api/delivery-areas', payload);
    } catch (error) {
        // Handle different error responses
        if (error.response) {
        // Server responded with error status
        throw new Error(
            error.response.data.error || 
            error.response.data.message || 
            'Failed to create delivery area'
        );
        } else if (error.request) {
        // Request was made but no response
        throw new Error('No response from server');
        } else {
        // Other errors
        throw new Error(error.message);
        }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Area Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="City"
        value={formData.city}
        onChange={(e) => setFormData({...formData, city: e.target.value})}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        margin="normal"
      />
      
      <FormControlLabel
        control={
          <Switch 
            checked={formData.isActive} 
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})} 
          />
        }
        label="Active Area"
        sx={{ mb: 2 }}
      />
      
      <Typography variant="h6" gutterBottom>Define Delivery Area</Typography>
      <AreaMapInput 
        onPolygonChange={(coords) => setFormData({...formData, coordinates: coords})} 
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Save Delivery Area'
        )}
      </Button>
    </Box>
  );
};

export default DeliveryAreaForm;