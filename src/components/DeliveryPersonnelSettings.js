import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ProfileAvatar from './ProfileAvatar'

const DeliveryPersonnelSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/delivery/settings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setSettings(res.data);
        if (res.data.profile_photo) {
          setPreviewPhoto(`data:image/jpeg;base64,${res.data.profile_photo}`);
        }
      } catch (err) {
        setError('Failed to load settings');
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e) => {
    setSettings({ ...settings, availability_status: e.target.checked });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('profile_photo', profilePhoto);
      await axios.post('http://localhost:5000/api/delivery/profile-photo', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Profile photo updated!');
    } catch (err) {
      setError('Failed to upload photo');
    }
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/delivery/settings', {
        phone_number: settings.phone_number,
        vehicle_type: settings.vehicle_type,
        availability_status: settings.availability_status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setSuccess('Settings updated!');
    } catch (err) {
      setError('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Delivery Settings</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ProfileAvatar
          profilePhoto={previewPhoto || `data:image/jpeg;base64,${settings?.encode}`}
          width={64}
          height={64}
          mr={2}
        />
        <label htmlFor="profile-photo-upload">
          <input
            id="profile-photo-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <Button variant="outlined" component="span">
            Choose Photo
          </Button>
        </label>
        <Button
          variant="contained"
          color='error'
          sx={{ ml: 2 }}
          disabled={!profilePhoto || saving}
          onClick={()=>{
            setPreviewPhoto(null);
            setProfilePhoto(null);
            setSettings((val) => ({
              ...val,
              profile_photo: null
            }));
          }}
        >
          Remove
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          disabled={!profilePhoto || saving}
          onClick={handlePhotoUpload}
        >
          Save
        </Button>
      </Box>

      <TextField
        label="Phone Number"
        name="phone_number"
        value={settings?.phone_number || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Vehicle Type</InputLabel>
        <Select
          value={settings?.vehicle_type || ''}
          onChange={(e) => handleChange(e.target.value)}
          label="Assign Service Area (Optional)"
        >
          {['Car', 'Motorbike', 'Truck'].map((car, index) => (
            <MenuItem key={index} value={car}>
              {car}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={!!settings?.availability_status}
            onChange={handleSwitch}
            name="availability_status"
          />
        }
        label="Available for Delivery"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={saving}
        fullWidth
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </Paper>
  );
};

export default DeliveryPersonnelSettings;