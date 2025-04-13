import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Grid2,
  Avatar,
  CircularProgress,
  Alert,
  CardMedia,
  Tooltip,
  TextField,
  MenuItem,
  Link,
  IconButton,
  Paper,
  Stack,
  Chip,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Drawer,
  styled,
  alpha,
  Fade,
  Grow,
  Zoom,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarIcon from '@mui/icons-material/Star';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import ProfileAvatar from './components/ProfileAvatar';
import BusinessNavBar from './components/BusinessNavBar';
import Footer from './components/Footer';

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

const StyledCard = styled(Card)(({ theme }) => ({
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
}));

const SellerProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setDrawerOpen(false);
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
  }, []);

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
      fontFamily: '"Inter", "Roboto", sans-serif',
      h5: {
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
  
  if (error) return <Alert severity="error">{error}</Alert>;

  const tabs = (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
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
      <Tab label="Dashboard" icon={<AnalyticsIcon />} iconPosition="start" />
      <Tab label="Products" icon={<InventoryIcon />} iconPosition="start" />
      <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
    </Tabs>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
      }}>
        <BusinessNavBar />
        
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
            minHeight: 72
          }}
        >
          <Box sx={{ 
            maxWidth: 1280, 
            mx: 'auto', 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
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
                  {['Dashboard', 'Products', 'Settings'][activeTab]}
                </Typography>
              </>
            ) : (
              tabs
            )}
          </Box>
        </GlassAppBar>

        <Box sx={{ py: 3 }}>
          <Container maxWidth='xl'>
            <Fade in timeout={500}>
              <Box>
                {activeTab === 0 && <DashboardPanel seller={seller} />}
                {activeTab === 1 && <ProductsPanel seller={seller} setActiveTab={setActiveTab} />}
                {activeTab === 2 && <SettingsPanel seller={seller} />}
              </Box>
            </Fade>
          </Container>
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

const DashboardPanel = ({ seller }) => {
  return (
    <Grid2 container spacing={3}>
      {[
        { icon: <TrendingUpIcon />, title: 'Total Sales', value: `${seller?.totalSales?.toLocaleString() || 0} JOD`, color: 'primary' },
        { icon: <LocalShippingIcon />, title: 'Pending Orders', value: seller?.pendingOrders || 0, color: 'error' },
        { icon: <InventoryIcon />, title: 'Total Products', value: seller?.products?.length || 0, color: 'success' },
        { icon: <StarIcon />, title: 'Average Rating', value: seller?.averageRating?.toFixed(1) || '0.0', color: 'warning' }
      ].map((stat, index) => (
        <Grid2 item size={{ xs: 12, md: 3 }} key={index}>
          <Grow in timeout={500 + index * 100}>
            <StyledCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: `${stat.color}.main`,
                    width: 48,
                    height: 48
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grow>
        </Grid2>
      ))}
    </Grid2>
  );
};

const ProductsPanel = ({ seller, setActiveTab }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState(3);
  const [viewMode, setViewMode] = useState('grid');
  
  return (
    <Box position="relative">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Your Products
        </Typography>
        <Stack direction="row" spacing={2} display={{ xs: 'none', md: 'block' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size="small"
          >
            Filter
          </Button>
          <IconButton
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            {viewMode === 'grid' ? <ViewModuleIcon /> : <ViewListIcon />}
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

      {seller?.products?.length > 0 ? (
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
                <AddIcon sx={{ mt: '50%', ml: '50%', transform: 'translate(-50%,-50%)' }}/>
              </Link>
            </Tooltip>
          </Zoom>
          <Grid2 container spacing={3}>
            {seller.products.map((product, index) => (
              <Grid2 item size={{ xs: 12, md: view }} key={product.id}>
                <Grow in timeout={500 + index * 100}>
                  <StyledCard>
                    {product.images[0] && (
                      <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.2)' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`data:image/jpeg;base64,${product.images[0]}`}
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
                            href={`/seller/product/${product.id}`}
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
                            color: 'success.main',
                            fontSize: '1.1rem'
                          }}
                        >
                          {(product.price / 1.3701710 - product.price / 1.3701710 * 0.065).toFixed(2)} JOD
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={`Stock: ${product.quantity_in_stock}`}
                            size="small"
                            color={product.quantity_in_stock > 0 ? 'success' : 'error'}
                            variant="outlined"
                          />
                          {product.rating && (
                            <Chip
                              icon={<StarIcon sx={{ fontSize: 16 }} />}
                              label={product.rating.toFixed(1)}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </Grow>
              </Grid2>
            ))}
          </Grid2>
        </>
      ) : (
        <Grow in timeout={500}>
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products yet!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setActiveTab(2)}
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
    </Box>
  );
};

const SettingsPanel = ({ seller }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Grow in timeout={500}>
      <Container maxWidth='md' sx={{
        textAlign: 'center',
        p: 4,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: 'primary.main'
          }}
        >
          Account Settings
        </Typography>
        
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          mb: 3 
        }}>
          <ProfileAvatar 
            profilePhoto={`data:image/jpeg;base64,${seller?.profile_photo}` || ''}
            sx={{
              width: 120,
              height: 120,
              border: '3px solid',
              borderColor: 'primary.light',
              mb: 2,
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          />
        </Box>
        
        <Box sx={{
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          p: 3,
          borderRadius: 2,
          mb: 3,
          textAlign: 'left',
        }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Store Name:</strong> {seller?.store_name || 'Not provided'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {seller?.email || 'Not provided'}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {seller?.phone_number || 'Not provided'}
          </Typography>
        </Box>
        
        {seller?.store_description && (
          <Box sx={{
            p: 3,
            mb: 3,
            borderLeft: '4px solid',
            borderColor: 'primary.light',
            bgcolor: 'rgba(144, 202, 249, 0.05)',
            borderRadius: '0 8px 8px 0'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontStyle: 'italic',
                whiteSpace: 'pre-line',
                lineHeight: 1.3,
                textAlign: 'left'
              }}
            >
              "{seller.store_description}"
            </Typography>
          </Box>
        )}
        
        <Button 
          variant="contained"
          endIcon={<LaunchIcon />} 
          onClick={() => navigate('/seller-settings')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
              boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Manage Account Settings
        </Button>
      </Container>
    </Grow>
  );
};

export default SellerProfilePage;