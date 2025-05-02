import { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Box, CssBaseline, Avatar, Menu, MenuItem, Tooltip, ThemeProvider, createTheme, Accordion, AccordionSummary, AccordionDetails, Divider, Drawer, Grid2, Link } from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon, Login as LoginIcon, Close} from "@mui/icons-material";
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchNavbar from "./SearchPage";

export default function MainLayout ({ children }) {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [email, setEmail] = useState(null);
    const [type, setType] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

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
                        <IconButton onClick={()=>{ setOpenDrawer(true); }}>
                            <MenuIcon sx={{ color: '#fff' }} />
                        </IconButton>
                        <Typography 
                            component={Link} 
                            href={'/'} 
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
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', width: '100%', maxWidth: 600, mx: 'auto' }} >
                            <SearchNavbar />
                        </Box>

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
                                                Go href Settings
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
                                            Go href Settings
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

                <Drawer
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                anchor="left"
                sx={{
                    width: 500,
                    '& .MuiDrawer-paper': {
                        width: 500,
                        backgroundColor: 'rgba(13, 17, 23, 0.2)',
                        padding: 2,
                        backdropFilter: 'blur(15px)',
                        zIndex: 1200,
                        borderRight: '1px solid rgba(72, 191, 227, 0.2)',
                    },
                }}>
                    <Grid2 container sx={{ mb: 2 }} justifyContent="space-between" alignItems="center">
                        <Grid2 item>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Explore More
                            </Typography>
                        </Grid2>
                        <Grid2 item>
                            <IconButton onClick={() => setOpenDrawer(false)} sx={{ color: '#fff' }}>
                                <Close fontSize="small" />
                            </IconButton>
                        </Grid2>
                    </Grid2>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }} >
                        <SearchNavbar />
                    </Box>
                    <Accordion variant="outlined" sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#48BFE3' }} />}>
                            <Typography sx={{ fontWeight: 500 }}>Products</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="ul" sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                <li>
                                    - <Link href="/products?category=Electronics" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Electronics
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/products?category=Fashion" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Fashion
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/products?category=Home-appliances" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Home Appliances
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/products?category=Books" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Books
                                    </Link>
                                </li>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion variant="outlined">
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#48BFE3' }} />}>
                            <Typography sx={{ fontWeight: 500 }}>Quick Links</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="ul" sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                <li>
                                    - <Link href="/about" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/business" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Business Page
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/contact" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/privacy-policy" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    - <Link href="/orders-history" underline="hover" sx={{ color: '#48BFE3', textDecoration: 'none', display: 'inline-block', mb: 1 }}>
                                        Orders History
                                    </Link>
                                </li>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Divider sx={{ my: 3, borderColor: 'rgba(72, 191, 227, 0.3)' }} />
                    <Typography variant="caption" color="text.secondary">
                        Cookies
                    </Typography>
                </Drawer>
            </Box>
        </ThemeProvider>
    );
};