import { Add, Delete, FilterList, MoreVert, Star, ViewList, ViewModule } from "@mui/icons-material"; // Add Delete and MoreVert icons
import { alpha, Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress, Container, Grid2, Grow, IconButton, Link, Menu, MenuItem, Paper, Stack, TextField, ThemeProvider, Tooltip, Typography, useTheme, Zoom } from "@mui/material"; // Add Menu and MenuItem
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerNav from "./components/SellerNav";
import axios from "axios";
import Footer from "./components/Footer";
import ConfirmationDrawer from "./components/ConfirmationDrawer"; // Import ConfirmationDrawer

const SellerProducts = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [view, setView] = useState(3);
    const [viewMode, setViewMode] = useState('grid');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState(null); // State for menu anchor
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [confirmationOpen, setConfirmationOpen] = useState(false); // State for ConfirmationDrawer

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const { data } = await axios.get('http://localhost:5000/api/seller/products', {
              params: { page },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            setProducts(data);
          } catch (error) {
            console.error('Error fetching insights:', error);
          } finally {
            setLoading(false);
          }
        };
        
        fetchData();
    }, []);

    const handleMenuOpen = (event, product) => {
        setMenuAnchor(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedProduct(null);
    };

    const handleDeleteClick = () => {
        handleMenuClose(); // Close the menu first
        setConfirmationOpen(true); // Open the confirmation drawer
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${selectedProduct.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setProducts(products.filter(product => product.id !== selectedProduct.id));
            } catch (error) {
                console.error('Error deleting product:', error);
            } finally {
                setConfirmationOpen(false); // Close the confirmation drawer
                handleMenuClose();
            }
        }
    };

    if (loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        );
    }

    return (
      <SellerNav>
        <Container maxWidth="xl" position="relative" sx={{ minHeight: `52vh`, py: 2}}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Your Products
            </Typography>
            <Stack direction="row" spacing={2} display={{ xs: 'none', md: 'block' }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="small"
              >
                Filter
              </Button>
              <IconButton
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                {viewMode === 'grid' ? <ViewModule /> : <ViewList />}
              </IconButton>
              <TextField
                select
                value={view}
                onChange={(e) => setView(e.target.value)}
                size="small"
                sx={{ width: 120 }}
              >
                <MenuItem value={12}>1 per Row</MenuItem>
                <MenuItem value={6}>2 per Row</MenuItem>
                <MenuItem value={4}>3 per Row</MenuItem>
                <MenuItem value={3}>4 per Row</MenuItem>
              </TextField>
            </Stack>
          </Stack>
  
        {products?.length > 0 ? (
            <>
              <Zoom in timeout={500}>
                <Tooltip title='Add Product' placement='right' arrow>
                  <Link
                    href='/add-product'
                    underline='none'
                    onClick={() => navigate('/add-product')}
                    sx={{
                      position: 'fixed',
                      left: 30,
                      bottom: 40,
                      width: 40,
                      height: 40,
                      zIndex: 99,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'black',
                      textShadow: '0 0 10px rgba(72, 191, 227, 0.5)',
                      boxShadow: '0 1px 5px rgba(72, 191, 227, 0.5)',
                      '&:hover': { 
                        backgroundColor: 'rgba(72, 191, 227, 0.5)',
                        transform: 'scale(1.1)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Add sx={{ mt: '50%', ml: '50%', transform: 'translate(-50%,-50%)' }}/>
                  </Link>
                </Tooltip>
              </Zoom>
              <Grid2 container spacing={3}>
                {products.map((product, index) => (
                  <Grid2 item size={{ xs: 12, md: view }} key={product.id}>
                    <Grow in timeout={500 + index * 100}>
                      <Card sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            '& .MuiCardMedia-root': {
                            transform: 'scale(1.05)'
                            }
                        },
                        '& .MuiCardMedia-root': {
                            transition: 'transform 0.3s ease'
                        }
                      }}>
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                          onClick={(e) => handleMenuOpen(e, product)}
                        >
                          <MoreVert />
                        </IconButton>
                        {product.images && (
                          <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.2)' }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={`data:image/jpeg;base64,${product.images[0].image}`}
                              alt={product.name}
                              sx={{
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}
                        <CardContent>
                          <Stack spacing={1}>
                            <Tooltip title={product.name} arrow>
                              <Link 
                                href={`/edit-product/${product.id}`}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    '&:hover': {
                                    color: 'primary.main'
                                    }
                                }}
                              >
                                {product.name}
                              </Link>
                            </Tooltip>
                            <Typography 
                              sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                fontSize: '1.1rem'
                              }}
                            >
                              {(product.price / 1.3701710 - product.price / 1.3701710 * 0.065).toFixed(2)} JOD
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip 
                                label={`Stock: ${product.quantity_in_stock}`}
                                size="small"
                                color={product.quantity_in_stock > 0 ? 'warning' : 'error'}
                                variant="outlined"
                              />
                              {product.average_rating && (
                                <Chip
                                  icon={<Star sx={{ fontSize: 16 }} />}
                                  label={Number(product.average_rating).toFixed(1)}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid2>
                ))}
              </Grid2>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDeleteClick}>
                  <Delete fontSize="small" color="error" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>

              {/* ConfirmationDrawer for delete confirmation */}
              <ConfirmationDrawer
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                message="Are you sure you want to delete this product?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
              />
            </>
          ) : (
            <Grow in timeout={500}>
              <Paper sx={{ 
                p: 4, 
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No products yet!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => { navigate('/add-product'); }}
                  sx={{
                    mt: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`
                    }
                  }}
                >
                  Add Your First Product
                </Button>
              </Paper>
            </Grow>
          )}
        </Container>
        <Footer />
      </SellerNav>
    );
};

export default SellerProducts;