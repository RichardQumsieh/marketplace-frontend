import { Analytics, Close, Inventory, Logout, Settings } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import { alpha, AppBar, Avatar, Box, createTheme, CssBaseline, Drawer, IconButton, Menu, MenuItem, Tab, Tabs, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SellerNav({children}) {
    const { pathname } = useLocation();
    const [seller, setSeller] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
    setDrawerOpen(false);
    };
    
    const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('type');
        window.location.href = '/sign-in';
    };
    
    useEffect(() => {
        const fetchSellerDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/seller/basic`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token
              },
            });
            setSeller(response.data);
          } catch (err) {
            console.error(err);
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
      
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const tabs = (
        <Tabs
            value={pathname.includes('Dashboard') ? 0 : pathname.includes('Products') ? 1 : 2}
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
            <Tab label="Dashboard" icon={<Analytics />} iconPosition="start" onClick={()=>{window.location.href= '/seller-profile/Dashboard';}}/>
            <Tab label="Products" icon={<Inventory />} iconPosition="start" onClick={()=>{window.location.href= '/seller-profile/Products';}}/>
            <Tab label="Settings" icon={<Settings />} iconPosition="start" onClick={()=>{window.location.href= '/seller-profile/Settings';}}/>
        </Tabs>
    );

    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            BackdropProps: {
              sx: {
                '& .MuiDrawer-paper': {
                  width: 300,
                  borderRight: 'none',
                  boxShadow: theme.shadows[16],
                  background: `linear-gradient(195deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  backdropFilter: 'blur(12px)'
                },
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
              <Close sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Box>
          {tabs}
        </Drawer>

        <AppBar
          position="sticky"
          className={scrolled ? 'scrolled' : ''}
          sx={{
            backdropFilter: 'blur(12px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: theme.shadows[1],
            transition: 'all 0.3s ease',
            '&.scrolled': {
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: theme.shadows[4]
            },
            zIndex: theme.zIndex.drawer - 1,
            minHeight: 45
          }}
        >
          <Box sx={{ 
            maxWidth: 1280, 
            mx: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                  {['Dashboard', 'Products', 'Settings'][pathname]}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700
                }}>
                  GoPrime
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  {tabs}
                  
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
                      <MenuItem onClick={handleLogout}>
                        <Logout fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </AppBar>
        <main>{children}</main>
        </ThemeProvider>
    );
};