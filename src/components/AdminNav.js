import { Analytics, Close, Inventory, Logout, Settings } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import { alpha, AppBar, Avatar, Box, createTheme, CssBaseline, Drawer, IconButton, Menu, MenuItem, Tab, Tabs, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavBar({children}) {
    const navigate = useNavigate();
    const pathname = String(useLocation().pathname).toLocaleLowerCase();
    const [admin, setAdmin] = useState(null);
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
        const fetchAdminDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/user/isAuthenticated`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token
              },
            });
            setAdmin(response.data.user);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchAdminDetails();
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
            value={pathname.includes('dashboard') ? 0 : pathname.includes('users') ? 1 : pathname.includes('orders') ? 2 : pathname.includes('delivery') ? 3 : null}
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
            <Tab label="Dashboard" icon={<Analytics />} iconPosition="start" onClick={()=>{navigate('/admin-control-panel/dashboard');}}/>
            <Tab label="Users" icon={<Inventory />} iconPosition="start" onClick={()=>{navigate('/admin-control-panel/users');}}/>
            <Tab label="Orders" icon={<Settings />} iconPosition="start" onClick={()=>{navigate('/admin-control-panel/orders');}}/>
            <Tab label="Delivery Personnel" icon={<Settings />} iconPosition="start" onClick={()=>{navigate('/admin-control-panel/delivery-Personnel');}}/>
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
            zIndex: theme.zIndex.drawer - 1
          }}
        >
            {isMobile ? (
              <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Ensures left and right alignment
                width: '100%',
                px: { xs: 2, sm: 4 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  edge="start"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  GoPrime
                </Typography>
              </Box>
            
              <Avatar
                src={`data:image/jpeg;base64,${admin?.encode}` || ''}
                alt="User Avatar"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                }}
              />
            </Box>
            ) : (
              <Box sx={{ 
                maxWidth: 1280, 
                mx: 'auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, sm: 4 }
              }}>
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
                      {admin?.email}
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
                        src={`data:image/jpeg;base64,${admin?.encode}` || ''} 
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
                        }
                        }}}
                    >
                      <MenuItem onClick={()=>{navigate('/admin-control-panel/Settings')}}>
                        <Settings fontSize="small" color="primary" sx={{ mr: 1 }} />
                        Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <Logout fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </Box>
            )}
        </AppBar>
        <main>{children}</main>
        </ThemeProvider>
    );
};