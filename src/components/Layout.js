import { useState } from 'react';
import {ThemeProvider, CssBaseline, FormControlLabel, Switch, createTheme, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { People, ShoppingCart, Dashboard, LocalShipping } from '@mui/icons-material';
import AdminAndSellerNavBar from './AdminAndSellerNavBar';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('theme')) || false);
  const [userType, setUserType] = useState(['Admin', 'Seller', 'Delivery'].includes(localStorage.getItem('type')));
  
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Delivery Personnel', icon: <LocalShipping />, path: '/admin/delivery-personnel' },
  ];

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex' }}>
        <Drawer variant="permanent" sx={{ width: 210, display: {xs: 'none', lg: 'flex'}, '& .MuiDrawer-paper': { width: 210 } }}>
          <List>
            <ListItem key={"theme"} sx={{ cursor:'pointer' }} >
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={() => { setDarkMode(!darkMode); localStorage.setItem('theme', !darkMode); }} />}
                label = "Dark Mode"
              />
            </ListItem>
            {menuItems.map((item) => (
              <>
                {localStorage.getItem('type') === 'Admin' && (
                  <ListItem button sx={{ cursor:'pointer' }} key={item.text} onClick={() => navigate(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                )}
              </>
            ))}
          </List>
        </Drawer>
        <main style={{ flexGrow: 1 }}>
          <AdminAndSellerNavBar/>
          <div style={{ padding: 16, position: 'relative' }}>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;