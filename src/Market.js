import { useEffect, useState } from "react";
import { Typography, Box, Grid2, Card, CardMedia, CardContent, Skeleton, Divider, Tooltip, Paper, createTheme, ThemeProvider, CssBaseline, CircularProgress, Link, Rating } from "@mui/material";
import Carousel from 'react-material-ui-carousel';
import axios from "axios";
import MainLayout from "./components/MainLayout";
import Footer from "./components/Footer";
import { userPrevilegeCheck } from "./utils/abstraction";
import SafeHTML from "./components/SafeHTML";

export default function Marketplace() {
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
      h3: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        color: 'white'
      },
      h5: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
        color: 'white'
      },
    },
  });
  
  const carouselItems = [
    {
      image: "homepage.jpg",
      title: "Latest Tech Arrivals",
      description: "Cutting-edge gear for the urban elite"
    },
    {
      image: "homepage_1.jpg",
      title: "Special Offers",
      description: "Up to 50% off on selected items"
    }
    // Add more items as needed
  ];

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    userPrevilegeCheck();
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <Box>
          <Carousel
            indicators={false}
            navButtonsAlwaysVisible={true}
            interval={4000}
            sx={{
              minHeight: '400px',
              '& .MuiPaper-root': {
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.5s ease-in-out',
              },
              '& .MuiButtonBase-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }
            }}
          >
            {carouselItems.map((item, index) => (
              <Paper key={index} elevation={0}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.6)',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                    width: '100%',
                    color: '#ffffff',
                    textAlign: 'center',
                    p: 4,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      animation: 'fadeIn 1s ease-in-out',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="h5"
                    sx={{
                      mt: 2,
                      animation: 'fadeIn 1s ease-in-out 0.2s',
                      animationFillMode: 'both',
                    }}
                  >
                    <SafeHTML html={(item.description)} />
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Carousel>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Link href="/products" variant="body2" color="warning" mb={1} underline="hover" pl={3}>See all Products →</Link>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid2 container spacing={3}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Grid2 item size={4} key={index}>
                  <Skeleton 
                    variant="rectangular" 
                    height={200} 
                    sx={{ 
                      borderRadius: '12px',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.6 },
                        '50%': { opacity: 0.8 },
                        '100%': { opacity: 0.6 }
                      }
                    }} 
                  />
                  <Skeleton width="80%" sx={{ mt: 1 }} />
                  <Skeleton width="50%" sx={{ mt: 1 }} />
                </Grid2>
              ))
            ) : (
              products.map((product) => (
                <Grid2 item size={{ xs: 12, md: 4, lg: 3 }} key={product.id}>
                  <Card 
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translateY(0)',
                      animation: 'fadeInUp 0.5s ease-out',
                      '@keyframes fadeInUp': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                      },
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        '& .MuiCardMedia-root': {
                          transform: 'scale(1.05)',
                        }
                      }
                    }}
                  >
                    <Grid2 container sx={{ px: 1, py: 0.5 }}>
                      <Grid2 item size={6} textAlign="left">
                        <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                          Sold by <Link href={`/profile/${product?.store_name}`} underline="hover" color="primary">{product.store_name}</Link>
                        </Typography>
                      </Grid2>
                      <Grid2 item size={6} textAlign="right">
                        <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                          {(product.verification_status === "Pending") ? "Not Yet Verified" : "Verified Seller ✅"}
                        </Typography>
                      </Grid2>
                    </Grid2>
                    <CardMedia
                      component="img"
                      height="200"
                      sx={{
                        my: 1,
                        px: 1,
                        objectFit: "contain",
                        borderRadius: '8px',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                      image={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Tooltip title={product.name} arrow>
                        <Link
                          href={"/product/" + product.id}
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            color: "rgb(143, 143, 255)",
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: "rgb(173, 173, 255)",
                            }
                          }}
                        >
                          {product.name}
                        </Link>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            my: 1,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {product.description}
                        </Typography>
                      </Tooltip>
                      <Grid2 container sx={{ mb: 1 }}>
                        <Grid2 item size={6} textAlign="left">
                          <Typography variant="body2" color="text.secondary">
                            Category: <Typography variant="body2" color="info" display={'inline'}>{product.category}</Typography>
                          </Typography>
                        </Grid2>
                        <Grid2 item size={6} textAlign="right">
                          <Typography variant="body2" color="text.secondary">
                            {product.quantity_in_stock} in stock
                          </Typography>
                        </Grid2>
                      </Grid2>
                      <Grid2 container sx={{ mb: 1 }}>
                          <Grid2 item size={6} textAlign="left">
                            <Typography 
                              variant="body2" 
                              color="warning"
                              sx={{
                                fontWeight: 'bold',
                              }}
                            >
                              {Number(product.price / 1.3701710).toFixed(2)} JOD
                            </Typography>
                          </Grid2>
                          <Grid2 item size={6} textAlign="right">
                            {(product.average_rating == 0) ? (
                              <Typography variant="caption">Be the first to review 🎈</Typography>
                            ) : (
                              <Rating size="small" value={product.average_rating} />
                            )}
                          </Grid2>
                      </Grid2>
                    </CardContent>
                  </Card>
                </Grid2>
              ))
            )}
          </Grid2>
        </Box>
        <Footer />
      </MainLayout>
    </ThemeProvider>
  );
}