import React, { useState } from 'react';
import { TextField, Select, MenuItem, Box, Button } from '@mui/material';

const OrderFilters = ({ onFilter }) => {
  const [status, setStatus] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const handleFilter = () => {
    onFilter({ status, minDate, maxDate });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        displayEmpty
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="cancelled">Cancelled</MenuItem>
      </Select>
      <TextField
        type="date"
        value={minDate}
        onChange={(e) => setMinDate(e.target.value)}
        label="Start Date"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type="date"
        value={maxDate}
        onChange={(e) => setMaxDate(e.target.value)}
        label="End Date"
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={handleFilter}>
        Filter
      </Button>
    </Box>
  );
};

export default OrderFilters;