import { 
    TextField, 
    Grid2, 
    Typography, 
    Divider, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch
  } from '@mui/material';
  
  const ProductPricingForm = ({ formData, setFormData }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <Grid2 container spacing={3}>
        <Grid2 item size={12}>
          <Typography variant="h6" gutterBottom>
            Pricing & Inventory
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid2>
  
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            slotProps={{ input: { inputProps: { min: 0 } }, inputLabel: { shrink: true } }}
          />
        </Grid2>
  
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Quantity in Stock"
            name="quantity_in_stock"
            type="number"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            required
            slotProps={{ input: { inputProps: { min: 0 } } }}
          />
        </Grid2>
  
        <Grid2 item size={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping & Tax
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid2>
  
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.requires_shipping}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requires_shipping: e.target.checked
                }))}
                name="requires_shipping"
              />
            }
            label="Requires shipping"
          />
        </Grid2>
  
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Tax Class</InputLabel>
            <Select
              name="tax_class"
              value={formData.tax_class}
              onChange={handleChange}
              label="Tax Class"
            >
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="reduced">Reduced</MenuItem>
              <MenuItem value="zero">Zero Rate</MenuItem>
              <MenuItem value="exempt">Exempt</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>
    );
  };

  export default ProductPricingForm;