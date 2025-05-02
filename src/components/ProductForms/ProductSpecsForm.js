import { TextField, Grid2, Typography, Divider } from '@mui/material';

const ProductSpecsForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={12}>
        <Typography variant="h6" gutterBottom>
          Physical Attributes
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Width (cm)"
          name="width_cm"
          type="number"
          value={formData.width_cm}
          onChange={handleChange}
          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
        />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Height (cm)"
          name="height_cm"
          type="number"
          value={formData.height_cm}
          onChange={handleChange}
          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
        />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Depth (cm)"
          name="depth_cm"
          type="number"
          value={formData.depth_cm}
          onChange={handleChange}
          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
        />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Weight (kg)"
          name="weight_kg"
          type="number"
          value={formData.weight_kg}
          onChange={handleChange}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />
      </Grid2>
      
      <Grid2 item size={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Identification
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
        />
      </Grid2>
      
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Barcode"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
        />
      </Grid2>
    </Grid2>
  );
};

export default ProductSpecsForm;