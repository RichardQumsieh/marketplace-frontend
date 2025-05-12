import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  ThemeProvider,
  CssBaseline,
  createTheme,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import "@fontsource/yeseva-one";
import axios from 'axios';

const BusinessNavBar = ({children}) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [email, setEmail] = useState(null);
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
        localStorage.setItem('type', response.data.user.user_type);
        if (response.data.user.encode) setProfilePhoto(`data:image/jpeg;base64,${response.data.user.encode}`);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
        localStorage.removeItem('email');
        navigate('/sign-in');
      }
    };

    fetchProfilePhoto();
  }, []);

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
          h6: {
            fontFamily: '"Playfair Display", serif',
            fontWeight: 500,
            color: 'white'
          },
        },
      });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AppBar
        position="static"
        sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        }}
        >
        <Toolbar>
            <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontFamily: "'Yeseva One', system-ui", fontWeight: 600, cursor: 'pointer' }}
            onClick={() => { navigate('/business'); }}
            >
                GoPrime Business
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
                    <MenuItem
                    onClick={() => {
                        navigate('/delivery/profile');
                        handleMenuClose();
                    }}
                    >
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Profile
                    </MenuItem>
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
        <main>{children}</main>
    </ThemeProvider>
  );
};

export default BusinessNavBar;