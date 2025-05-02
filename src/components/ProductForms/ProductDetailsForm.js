import { 
    TextField, 
    Grid2, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    FormControlLabel,
    Switch,
    Typography
  } from '@mui/material';
  import RichTextEditor from './RichTextEditor';
  
const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

  const ProductDetailsForm = ({ formData, setFormData }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <Grid2 container spacing={3}>
        <Grid2 item size={12}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid2>
        
        <Grid2 item size={12}>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          />
        </Grid2>
        
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        
        <Grid2 item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              label="Condition"
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="used">Used</MenuItem>
              <MenuItem value="refurbished">Refurbished</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        
        <Grid2 item size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_digital}
                onChange={(e) => setFormData(prev => ({ ...prev, is_digital: e.target.checked }))}
                name="is_digital"
              />
            }
            label="This is a digital product"
          />
        </Grid2>
      </Grid2>
    );
  };

  export default ProductDetailsForm;