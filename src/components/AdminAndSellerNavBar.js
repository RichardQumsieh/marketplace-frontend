import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import axios from 'axios';

const AdminAndSellerNavBar = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [email, setEmail] = useState(null);
  const [type, setType] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/sign-in');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('type');
    window.location.href = '/sign-in';
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/isAuthenticated", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        if (!response.data.user.email) throw Error;
        setEmail(response.data.user.email);
        setType(response.data.user.user_type);
        localStorage.setItem('type', response.data.user.user_type);
        if (response.data.user.encode) setProfilePhoto(`data:image/jpeg;base64,${response.data.user.encode}`);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
        localStorage.removeItem('email');
      }
    };

    fetchProfilePhoto();
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 , display: {xs: 'initial', lg: 'none'}}}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => { navigate('/'); }}
        >
          GoPrime Marketplace
        </Typography>

        {authToken ? (
          <>
            <Typography>{email}</Typography>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar src={profilePhoto ? profilePhoto : null} alt="User Avatar" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {(type === "Seller") && (
                <>
                  <MenuItem
                    onClick={() => {
                      navigate('/seller-settings');
                      handleMenuClose();
                    }}
                  >
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Go to Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/seller-profile');
                      handleMenuClose();
                    }}
                  >
                    <StoreIcon fontSize="small" sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                </>
              )}
              {(type === "Admin") && (
                <>
                  <MenuItem
                    onClick={() => {
                      navigate('/admin-settings');
                      handleMenuClose();
                    }}
                  >
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Go to Settings
                  </MenuItem>
                </>
              )}
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            onClick={handleLogin}
            startIcon={<LoginIcon />}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminAndSellerNavBar;