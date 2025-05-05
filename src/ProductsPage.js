import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid2,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  IconButton,
  Tooltip,
  alpha,
  Chip,
  Drawer,
  CircularProgress,
  Link,
  Skeleton
} from '@mui/material';
import axios from 'axios';
import Footer from './components/Footer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import SafeHTML from './components/SafeHTML';

const categories = ['All', 'Electronics', 'Home-Furnish', 'Furniture', 'Books', 'Other'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const location = useLocation(); // Get the current location
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const selectedCategory = queryParams.get('category') || 'All';

  useEffect(() => {
    fetchProducts();
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setFeaturedProduct(products[randomIndex]);
    };

  }, [products]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios(`http://localhost:5000/api/products`, {
        params: {category: (selectedCategory==='All'?'':selectedCategory)}
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2', // A more professional blue
      },
      background: {
        default: '#121212', // Dark background
        paper: '#1e1e1e', // Slightly lighter for cards and papers
      },
      text: {
        primary: '#ffffff', // White text
        secondary: '#b3b3b3', // Light grey for secondary text
      },
    },
    typography: {
      allVariants: {
        fontFamily: '"Lora", serif', // Default for body
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        color: 'white'
      },
      h6: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        color: 'white'
      },
    },
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Drawer
          variant="permanent"
          sx={{
            width: 160,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 160,
              boxSizing: 'border-box',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              mt: 8,
              zIndex: 0
            },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            <List sx={{ py: 0 }}>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat}
                  selected={selectedCategory === cat}
                  component={Link}
                  href={`?category=${cat}`}
                  underline="none"
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    py: 1,
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976d2 30%, #1CBFE3 90%)',
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={cat} 
                    slotProps={{
                      primary: {
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 160px)` },
            ml: { sm: '160px' },
            minHeight: '53vh',
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Featured Product Section */}
            {!featuredProduct ? (
              // Skeleton animation while featuredProduct is loading
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Grid2 container spacing={2}>
                  {/* Skeleton for the image */}
                  <Grid2 item size={{ xs: 12, md: 4 }}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                  </Grid2>

                  {/* Skeleton for the details */}
                  <Grid2 item size={{ xs: 12, md: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Skeleton variant="text" height={40} width="60%" />
                      <Skeleton variant="text" height={30} width="40%" />
                      <Skeleton variant="text" height={20} width="80%" />
                      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                      <Skeleton variant="text" height={40} width="30%" />
                    </Box>
                  </Grid2>
                </Grid2>
              </Paper>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                  }}
                >
                  <Grid2 container>
                    {/* Featured Product Image */}
                    <Grid2 item size={{ xs: 12, md: 4}} p={2}>
                      <Box
                        sx={{
                          position: 'relative',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            featuredProduct.image
                              ? `data:image/jpeg;base64,${featuredProduct.image}`
                              : '/placeholder.jpg'
                          }
                          alt={featuredProduct.name}
                          sx={{
                            maxHeight: '60vh',
                            objectFit: 'contain',
                            width: '100%',
                          }}
                        />
                      </Box>
                    </Grid2>

                    {/* Featured Product Details */}
                    <Grid2 item size={{ xs: 12, md: 8 }}>
                      <Box
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          maxHeight: '80vh',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {featuredProduct.name}
                        </Typography>

                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {Number(featuredProduct.price / 1.3701710).toFixed(2)} JOD
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Rating
                            value={parseFloat(featuredProduct.average_rating)}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {Math.floor(Math.random() * 500 + 50)} reviews
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            mb: 3, 
                            lineHeight: 1.6, 
                            whiteSpace: 'pre-line',
                            display: '-webkit-box',
                            WebkitLineClamp: 8,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                          }}
                        >
                          <SafeHTML html={featuredProduct.description} />
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                          <Button
                            href={`/product/${featuredProduct.id}`}
                            variant="contained"
                            size="small"
                            sx={{
                              px: 3,
                              py: 1,
                              fontSize: '0.875rem',
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              },
                            }}
                          >
                            View Details
                          </Button>
                          <IconButton
                            color="primary"
                            size="small"
                            sx={{
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <ShoppingCartIcon fontSize='small'/>
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Paper>
              </motion.div>
            )}

            {/* Hero Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Discover Amazing Products
                </Typography>
              </Box>
            </motion.div>

            {/* Product Grid */}
            <Box sx={{ gap: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                >
                  <Grid2 container spacing={2}>
                    {products.map((product, index) => (
                      <Grid2 item key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <motion.div
                          whileHover={{ y: -4 }}
                        >
                          <Card
                            sx={{
                              height: '100%',
                              position: 'relative',
                              background: alpha(theme.palette.background.paper, 0.8),
                              backdropFilter: 'blur(20px)',
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                              },
                            }}
                          >
                            <Box sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={
                                  product.image
                                    ? `data:image/jpeg;base64,${product.image}`
                                    : '/placeholder.jpg'
                                }
                                alt={product.name}
                                sx={{
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  },
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  display: 'flex',
                                  gap: 0.5,
                                }}
                              >
                                <Tooltip title="Add to Wishlist">
                                  <IconButton
                                    size="small"
                                  >
                                    <FavoriteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Share">
                                  <IconButton
                                    size="small"
                                  >
                                    <ShareIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                noWrap
                                title={product.name}
                                sx={{ mb: 0.5, fontSize: '0.875rem' }}
                              >
                                {product.name}
                              </Typography>
                              <Typography 
                                variant="h6" 
                                color="primary.main" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  mb: 0.5,
                                  fontSize: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                {Number(product.price / 1.3701710).toFixed(2)} JOD
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                Sold by {product.store_name}
                              </Typography>
                              <Rating
                                value={parseFloat(product.average_rating)}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{ mb: 1.5 }}
                              />
                              <Button
                                href={`/product/${product.id}`}
                                fullWidth
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: 1,
                                  fontWeight: 'bold',
                                  py: 0.75,
                                  fontSize: '0.875rem',
                                  background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #1976d2 30%, #1CBFE3 90%)',
                                  },
                                }}
                              >
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid2>
                    ))}
                  </Grid2>
                </motion.div>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
}