import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
  Paper,
  IconButton,
  MenuItem,
  Divider,
  ThemeProvider,
  createTheme,
  Alert,
  CssBaseline,
  Drawer,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Link,
} from "@mui/material";
import { AddPhotoAlternate, Delete } from "@mui/icons-material";
import axios from "axios";
import { isAuthenticated } from "./utils/auth";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LaunchIcon from '@mui/icons-material/Launch';
import Carousel from "react-material-ui-carousel";
import { styled } from "@mui/system";

const Image = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "contain",
  borderRadius: "10px",
});
const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('theme')) || false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    images: [],
  });

  const [error, setError] = useState('');

  const sanitizeInput = (input) => {
    return String(input).normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setProductDetails({
      ...productDetails,
      images: [...productDetails.images, ...newImages],
    });
  };

  const handleImageRemove = (index) => {
    const updatedImages = productDetails.images.filter((_, i) => i !== index);
    setProductDetails({ ...productDetails, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, description, price, quantity, category, images } = productDetails;

    if (!name || !description || !price || !quantity || !category || !images) {
      setError("Please fill in all fields and upload at least one image.");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("description", sanitizeInput(description));
    data.append("price", price);
    data.append("quantity_in_stock", quantity);
    data.append("category", category);
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      if (response.status === 201) {
        alert("Product added successfully!");
        setProductDetails({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: "",
          images: [],
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add the product. Please try again.");
    }
  };

  const theme = createTheme({
    palette: {
        mode: darkMode ? 'dark' : 'light',
    },
  });

  if (isAuthenticated())
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 210,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 210, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" },
          }}
        >
          <Box>
            <FormControlLabel
              sx = {{ ml: 0.6, mt: 2 }}
              control={<Switch checked={darkMode} onChange={() => { setDarkMode(!darkMode); localStorage.setItem('theme', !darkMode); }} />}
              label = "Dark Mode"
            />
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{ mt: 2 }}
            >
              <Tab icon={<AddBoxIcon />} label="Add Product" />
              <Tab icon={<VisibilityIcon />} label="Preview" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              fullWidth
              onClick={() => navigate("/seller-profile")}
            >
              Back to Profile
            </Button>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {selectedTab === 0 ?
          (<Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
            >
            {error && (
                <Typography>
                    <Alert color="error">{error}</Alert>
                </Typography>
            )}
            <Paper
                elevation={3}
                sx={{
                p: 4,
                mt: 2,
                borderRadius: 3,
                }}
            >
                <TextField
                label="Product Name"
                name="name"
                value={productDetails.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                />
                <TextField
                label="Description"
                name="description"
                value={productDetails.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
                />
    
                <Grid2 container spacing={2} sx={{ mb: 2 }}>
                  <Grid2 item size={6}>
                      <TextField
                      label="Price (USD)"
                      name="price"
                      type="number"
                      value={productDetails.price}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      />
                  </Grid2>
                  <Grid2 item size={6}>
                      <TextField
                      label="Quantity in Stock"
                      name="quantity"
                      type="number"
                      value={productDetails.quantity}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      />
                  </Grid2>
                </Grid2>
                
                <Typography variant="caption" color="text.secondary">
                  Price after applying fees (JOD): <Link href="#" target="blank" rel="noopener">read more here <LaunchIcon fontSize="10px" sx={{ verticalAlign: 'middle' }}/></Link>
                  <Typography color="error">
                    {Number(productDetails.price / 1.3701710 - productDetails.price / 1.3701710 * 0.065).toFixed(2)} JOD
                  </Typography>
                </Typography>

                <TextField
                label="Category"
                name="category"
                value={productDetails.category}
                onChange={handleInputChange}
                select
                fullWidth
                margin="normal"
                required
                >
                {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                    {cat}
                    </MenuItem>
                ))}
                </TextField>
    
                <Divider sx={{ my: 3 }} />
    
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                }}
                >
                <Typography variant="body1" gutterBottom>
                    Upload Product Images
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<AddPhotoAlternate />}
                >
                    Upload Images
                    <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                    required
                    />
                </Button>
    
                <Grid2 container spacing={2} sx={{ mt: 2 }}>
                    {productDetails.images[0] && productDetails.images.map((image, index) => (
                    <Grid2 item key={index} size = {{ xs: 12, sm: 6 }}>
                        <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: 150,
                            overflow: "hidden",
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                        >
                        <img
                            src={image.preview}
                            alt={`preview-${index}`}
                            style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            }}
                        />
                        <IconButton
                            sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            background: "rgba(255,255,255,0.7)",
                            }}
                            onClick={() => handleImageRemove(index)}
                        >
                            <Delete />
                        </IconButton>
                        </Box>
                    </Grid2>
                    ))}
                </Grid2>
                </Box>
    
                <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleSubmit}
                fullWidth
                >
                Submit Product
                </Button>
            </Paper>
            </Box>)
          : (
            <Box sx={{ margin: "auto" }}>
              <Grid2 container spacing={3}>
                <Grid2 item size = {{ xs: 12, sm: 4 }}>
                  {productDetails.images.length > 0 ? (
                      <Carousel>
                        {productDetails.images.map((image, index) => (
                          <Image
                            key={index}
                            src={`${image.preview}`}
                            alt={`Product Image ${index + 1}`}
                          />
                        ))}
                      </Carousel>
                  ) : (
                    <Typography>No images available</Typography>
                  )}
                </Grid2>
        
                <Grid2 item size = {{ xs: 12, sm: 8 }}>
                  <Paper sx={{ padding: "20px", borderRadius: "10px" }} elevation={3}>
                    <Typography variant="h6" fontWeight="bold">
                      {productDetails.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      {productDetails.price} JOD
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                      {productDetails.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
                      Category: {productDetails.category || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      In Stock: {productDetails.quantity}
                    </Typography>

                      <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 3, width: "100%" }}
                      >
                        Add to Cart
                      </Button>
                  </Paper>
                </Grid2>
              </Grid2>
            </Box>
          )}
        </Box>
    </Box>
    </ThemeProvider>
  );
  else return navigate('/admin-auth');
};

export default AddProduct;