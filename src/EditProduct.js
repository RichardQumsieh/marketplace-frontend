import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
  Grid2,
  IconButton,
  CircularProgress,
  MenuItem,
  AppBar,
  CssBaseline,
  ThemeProvider,
  styled,
  alpha,
  createTheme,
  Avatar,
  Menu,
  Container,
  Fade,
  Switch
} from "@mui/material";
import { Delete, CloudUpload, Dashboard, Shop } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import Footer from "./components/Footer";
import ProductDetailsForm from "./components/ProductForms/ProductDetailsForm";
import ProductSpecsForm from "./components/ProductForms/ProductSpecsForm";
import ProductPricingForm from "./components/ProductForms/ProductPricingForm";

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

const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_in_stock: '',
    category: 'Electronics',
    width_cm: '',
    height_cm: '',
    depth_cm: '',
    weight_kg: '',
    sku: '',
    barcode: '',
    condition: 'new',
    is_digital: false,
    requires_shipping: true,
    tax_class: 'standard'
  });
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/seller/basic`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token
          },
        });
        setSeller(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSellerDetails();

    if (!['Seller', 'Admin'].includes(localStorage.getItem('type'))) navigate('/sign-in');
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(response => {
        const data = response.data;
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          quantity_in_stock: data.quantity_in_stock,
          category: data.category,
          width_cm: data.width_cm || '',
          height_cm: data.height_cm || '',
          depth_cm: data.depth_cm || '',
          weight_kg: data.weight_kg || '',
          sku: data.sku,
          barcode: data.barcode,
          condition: String(data.condition).toLowerCase(),
          is_digital: data.is_digital,
          requires_shipping: data.requires_shipping,
          tax_class: data.tax_class
        });
        setImages(data.images.map(img => ({ id: img.id, base64: img.base64 })));
      })
      .finally(() => setLoading(false));

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveImage = (index, isNew, imageId = null) => {
    if (isNew) {
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
      setRemovedImageIds([...removedImageIds, imageId]);
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const Data = new FormData();
    Data.append('name', formData.name);
    Data.append('description', formData.description);
    Data.append('price', parseFloat(formData.price));
    Data.append('quantity_in_stock', Number(formData.quantity_in_stock).toFixed(0));
    Data.append('sku', formData.sku);
    Data.append('barcode', formData.barcode);
    Data.append('category', formData.category);
    Data.append('width_cm', formData.width_cm ? parseFloat(formData.width_cm) : '');
    Data.append('height_cm', formData.height_cm ? parseFloat(formData.height_cm) : '');
    Data.append('depth_cm', formData.depth_cm ? parseFloat(formData.depth_cm) : '');
    Data.append('weight_kg', formData.weight_kg ? parseFloat(formData.weight_kg) : '');
    Data.append('condition', formData.condition);
    Data.append('is_digital', formData.is_digital);
    Data.append('requires_shipping', formData.requires_shipping);
    Data.append('tax_class', formData.tax_class);
    newImages.forEach((file) => formData.append("newImages", file));

    axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(() => navigate("/seller-profile/Dashboard"))
    .catch(err => console.error("Update failed", err));
  };

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
          <Box sx={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
          }}>
            
          <GlassAppBar 
            position="sticky"
            className={scrolled ? 'scrolled' : ''}
            sx={{
              minHeight: 64
            }}
          >
            <Box sx={{ 
              maxWidth: 1280, 
              mx: 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, sm: 4 },
              mt: 1.5
            }}>
              
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
                        navigate('/seller-profile/Dashboard');
                        handleMenuClose();
                      }}
                    >
                      <Dashboard fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/seller-profile/Products');
                        handleMenuClose();
                      }}
                    >
                      <Shop fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      Products
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/seller-profile/Settings');
                        handleMenuClose();
                      }}
                    >
                      <SettingsIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Box>
          </GlassAppBar>

        <Box sx={{ py: 3 }}>
          <Container maxWidth='lg'>
            <Fade in timeout={500}>
              <Box>
              <Typography variant="h5" fontWeight="bold" mb={2}>Edit Product</Typography>
              
              <ProductDetailsForm
                formData={formData} 
                setFormData={setFormData} 
              />

              <Box sx={{ mb: 2 }}>
                <ProductSpecsForm
                  formData={formData} 
                  setFormData={setFormData} 
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <ProductPricingForm
                  formData={formData} 
                  setFormData={setFormData} 
                />
              </Box>

              <Typography variant="h6" my={2}>Current Images</Typography>
              <Grid2 container spacing={2}>
                {images.map((img, index) => (
                  <Grid2 item size={4} key={index}>
                    <Card>
                      <CardMedia component="img" height="100" image={`data:image/jpeg;base64,${img.base64}`} alt="Product image" />
                      <CardContent>
                        <IconButton onClick={() => {handleRemoveImage(index, false, img.id); console.log(img.id);}}><Delete /></IconButton>
                      </CardContent>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
              
              {newImages[0] && (
                <>
                  <Typography variant="h6" mt={2} mb={1}>New Images</Typography>
                  <Grid2 container spacing={2}>
                    {newImages.map((file, index) => (
                      <Grid2 item size={4} key={index}>
                        <Card>
                          <CardMedia component="img" height="100" src={URL.createObjectURL(file)} alt="New upload" />
                          <CardContent>
                            <IconButton onClick={() => handleRemoveImage(index, true)}><Delete /></IconButton>
                          </CardContent>
                        </Card>
                      </Grid2>
                    ))}
                  </Grid2>
                </>
            )}
              
              <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mt: 2 }}>
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </Box>
            </Fade>
          </Container>
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default EditProduct;