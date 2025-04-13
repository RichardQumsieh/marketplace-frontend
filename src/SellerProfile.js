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
  Divider,
  Tooltip,
  TextField,
  MenuItem,
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import LaunchIcon from '@mui/icons-material/Launch';
import axios from 'axios';
import ProfileAvatar from './components/ProfileAvatar';

const SellerProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(null);

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
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', left: '50%', top: 0, mt:'25%', translate: '-50%' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <AppBar position="sticky" sx={{ mb: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', backgroundColor: 'rgba(30, 30, 30, 0.1)', backdropFilter: 'blur(10px)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" icon={<AnalyticsIcon />} />
          <Tab label="Products" icon={<InventoryIcon />} />
          <Tab label="Add Product" icon={<AddIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>
      </AppBar>

      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {activeTab === 0 && <DashboardPanel seller={seller} />}
        {activeTab === 1 && <ProductsPanel seller={seller} />}
        {activeTab === 2 && <AddProductPanel />}
        {activeTab === 3 && <SettingsPanel seller={seller} />}
      </Box>
    </Box>
  );
};

const DashboardPanel = ({ seller }) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4" color="primary">
              ${seller?.totalSales || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Pending Orders</Typography>
            <Typography variant="h4" color="error">
              {seller?.pendingOrders || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

const ProductsPanel = ({ seller }) => {
  const [view, setView] = useState(3);
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Products
            <TextField
            label="Items per Row"
            name="Items"
            value={view}
            onChange={(e)=>{setView(e.target.value);}}
            select
            sx = {{ width: 'fit-content', verticalAlign: 'middle', ml:2}}
            margin="normal"
            required
            >
              <MenuItem key={1} value={12}>
              1 per Row
              </MenuItem>
              <MenuItem key={2} value={6}>
              2 per Row
              </MenuItem>
              <MenuItem key={3} value={4}>
              3 per Row
              </MenuItem>
              <MenuItem key={4} value={3}>
              4 per Row
              </MenuItem>
            </TextField>
      </Typography>
      {seller?.products?.length > 0 ? (
        <Grid2 container spacing={2}>
          {seller.products.map((product) => (
            <Grid2 item size={view} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {product.images[0] && (
                  <>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`data:image/jpeg;base64,${product.images[0]}`}
                      alt={product.name}
                      sx={{ my: 1, px: 1, objectFit: "contain" }}
                    />
                    <Divider />
                  </>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Tooltip title={product.name} arrow>
                    <Link href = {"/seller/product/" + product.id}
                      sx = {{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {product.name}
                    </Link>
                  </Tooltip>
                  <Typography sx = {{fontWeight: 'bold', color: 'rgb(115, 185, 11)'}}>{(product.price / 1.3701710  - product.price / 1.3701710 * 0.065).toFixed(2)} JOD</Typography>
                  <Typography>Stock: {product.quantity_in_stock}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography>No products yet!</Typography>
      )}
    </Box>
  );
};

const AddProductPanel = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate(`/add-product`);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add a New Product
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        endIcon={<LaunchIcon />}
        onClick={handleAddProduct}
      >
        Add Product
      </Button>
    </Box>
  );
};

const SettingsPanel = ({ seller }) => {
  const navigate = useNavigate();
  return (
    <Box textAlign={'center'}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Account Settings
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
        <ProfileAvatar profilePhoto={`data:image/jpeg;base64,${seller?.profile_photo}` || ''}/>
      </Box>
      <Typography>Email: {seller?.email}</Typography>
      <Typography>Phone: {seller?.phone_number}</Typography>
      <Typography sx={{ fontStyle: 'italic', my: 3, whiteSpace: 'pre-line'}}>{seller?.store_description}</Typography>
      <Button endIcon={<LaunchIcon />} onClick={() => { navigate('/seller-settings'); }}> Go to Settings </Button>
    </Box>
  );
};

export default SellerProfilePage;