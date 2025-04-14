import React, { useEffect, useState } from "react";
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
  Link,
  styled,
  AppBar,
  alpha,
  CircularProgress,
  useMediaQuery,
  Avatar,
  Menu,
  Fade,
  Container
} from "@mui/material";
import { AddPhotoAlternate, Delete } from "@mui/icons-material";
import axios from "axios";
import { isAuthenticated } from "./utils/auth";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import Carousel from "react-material-ui-carousel";
import Footer from "./components/Footer";

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: 'blur(12px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&.scrolled': {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    boxShadow: theme.shadows[4]
  }
}));

const FloatingDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 300,
    borderRight: 'none',
    boxShadow: theme.shadows[16],
    background: `linear-gradient(195deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
    backdropFilter: 'blur(12px)'
  }
}));

const Image = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "contain",
  borderRadius: "10px",
});

const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/seller/${localStorage.getItem('id')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token
          },
        });
        setSeller(response.data.seller);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch seller details');
        setLoading(false);
      }
    };

    fetchSellerDetails();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  },[]);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5'
      },
      secondary: {
        main: '#f48fb1',
        light: '#f8bbd0',
        dark: '#f06292'
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e'
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)'
      }
    },
    typography: {
      allVariants: {
        fontFamily: '"Inter", "Roboto", sans-serif',
      },
      h6: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px'
          }
        }
      }
    }
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const tabs = (
    <Tabs
      value={selectedTab}
      onChange={(_, newValue) => setSelectedTab(newValue)}
      orientation={isMobile ? 'vertical' : 'horizontal'}
      variant={isMobile ? 'fullWidth' : 'scrollable'}
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
      sx={{
        '& .MuiTab-root': {
          minHeight: 64,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          minWidth: 'unset',
          px: 3,
          '&.Mui-selected': {
            fontWeight: 600,
            bgcolor: isMobile ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
          },
          '& svg': {
            mr: 1.5,
            fontSize: '1.2rem'
          }
        }
      }}
    >
      <Tab label="Product" icon={<AddBoxIcon />} iconPosition="start" />
      <Tab label="Preview" icon={<VisibilityIcon />} iconPosition="start" />
    </Tabs>
  );

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('type');
    window.location.href = '/sign-in';
  };

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      bgcolor: 'black'
    }}>
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  if (isAuthenticated())
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
        }}>
          
        <FloatingDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            BackdropProps: {
              sx: {
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)'
              }
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Box>
          {tabs}
        </FloatingDrawer>
        
        <GlassAppBar 
          position="sticky"
          className={scrolled ? 'scrolled' : ''}
          sx={{
            zIndex: theme.zIndex.drawer - 1,
            minHeight: 45
          }}
        >
          <Box sx={{ 
            maxWidth: 1280, 
            mx: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4 }
          }}>
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {['Product', 'Preview'][selectedTab]}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  GoPrime
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  {tabs}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    ml: 2
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      {seller?.store_name}
                    </Typography>
                    
                    <IconButton 
                      onClick={handleMenuOpen} 
                      sx={{
                        p: 0.5,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.light',
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <Avatar 
                        src={`data:image/jpeg;base64,${seller?.profile_photo}` || ''} 
                        alt="User Avatar"
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main'
                        }}
                      />
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      slotProps={{ paper: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                          '&:hover': {
                            bgcolor: 'rgba(144, 202, 249, 0.08)'
                          }
                        },
                        }}}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate('/seller-profile');
                          handleMenuClose();
                        }}
                      >
                        <SettingsIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        Dashboard
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </GlassAppBar>

        <Box sx={{ py: 3 }}>
          <Container maxWidth='xl'>
            <Fade in timeout={500}>
              <Box>
                {selectedTab === 0 ?
                (<Box>
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
          </Fade>
        </Container>
      </Box>
    </Box>
    <Footer />
    </ThemeProvider>
  );
  else return navigate('/sign-in');
};

export default AddProduct;