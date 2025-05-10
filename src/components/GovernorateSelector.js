import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const GovernorateSelector = ({ value, onChange, language = 'en' }) => {
  const [governorates, setGovernorates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGovernorates = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/governorates');
        setGovernorates(response.data);
      } catch (err) {
        console.error('Failed to fetch governorates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGovernorates();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Governorate</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label="Governorate"
        disabled={loading}
      >
        {governorates.map((gov) => (
          <MenuItem key={gov.id} value={gov.id}>
            {language === 'ar' ? gov.name_ar : gov.name_en}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GovernorateSelector;