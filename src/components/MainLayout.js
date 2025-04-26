import { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Box, CssBaseline, Avatar, Menu, MenuItem, Tooltip, ThemeProvider, createTheme } from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon, Login as LoginIcon} from "@mui/icons-material";
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchNavbar from "./SearchPage";

export default function MainLayout ({ children }) {
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
        const getAuthInfo = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user/isAuthenticated", {
                    headers: { Authorization: `Bearer ${authToken}` }
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
                setAuthToken('');
            }
        };
        
        if (localStorage.getItem('authToken')) getAuthInfo();
    }, [])

    const theme = createTheme({
        palette: {mode:'dark'},
        typography: {
            allVariants: {
                fontFamily: '"Lora", serif',
                color: 'white'
            }
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                minHeight: "100vh", 
                background: 'linear-gradient(135deg, #0f1318, #1a1f25, #2a2f35)',  // Darker, more cyberpunk background
            }}>
                <AppBar position="fixed" sx={{ 
                    backgroundColor: 'rgba(13, 17, 23, 0.85)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid rgba(72, 191, 227, 0.15)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                }}>
                    <Toolbar>
                        <Typography 
                            component={Link} 
                            to={'/'} 
                            variant="h6" 
                            sx={{ 
                                flexGrow: 1, 
                                textDecoration: 'none', 
                                color: '#fff',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                textShadow: '0 0 10px rgba(72, 191, 227, 0.5)',
                                '&:hover': { color: '#48BFE3' }
                            }}
                        >
                            GoPrime
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                &nbsp;Marketplace
                            </Box>
                        </Typography>
                        <SearchNavbar />

                        {authToken ? (
                            <>
                                <IconButton 
                                    onClick={handleMenuOpen} 
                                    sx={{ 
                                        ml: 2,
                                        border: '2px solid rgba(72, 191, 227, 0.3)',
                                        '&:hover': { border: '2px solid rgba(72, 191, 227, 0.8)' }
                                    }}
                                >
                                    <Avatar 
                                        src={profilePhoto ? profilePhoto : null} 
                                        alt="User Avatar"
                                        sx={{ 
                                            width: 35, 
                                            height: 35,
                                            boxShadow: '0 0 10px rgba(72, 191, 227, 0.3)'
                                        }} 
                                    />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    slotProps={{ paper: {
                                        sx: {
                                            bgcolor: 'rgba(13, 17, 23, 0.95)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(72, 191, 227, 0.2)',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                            color: '#fff',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    bgcolor: 'rgba(72, 191, 227, 0.1)',
                                                }
                                            }
                                        }
                                    }
                                    }}
                                >
                                    <Tooltip title={email} arrow>
                                        <MenuItem sx={{ cursor: 'default' }}>
                                            <Typography noWrap sx={{
                                                maxWidth: 140,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}> {email} </Typography>
                                        </MenuItem>
                                    </Tooltip>
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
                                    {(type === 'Buyer') && (
                                        <>
                                            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                                Profile
                                            </MenuItem>
                                            <MenuItem onClick={() => { navigate('/cart'); handleMenuClose(); }}>
                                                <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />
                                                Cart
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
                                sx={{ 
                                    textTransform: 'none', 
                                    fontWeight: 500,
                                    ml: 2,
                                    border: '1px solid rgba(72, 191, 227, 0.3)',
                                    '&:hover': {
                                        border: '1px solid rgba(72, 191, 227, 0.8)',
                                        bgcolor: 'rgba(72, 191, 227, 0.1)'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <main>{children}</main>
            </Box>
        </ThemeProvider>
    );
};