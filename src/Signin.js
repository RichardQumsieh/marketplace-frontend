import React, { useState } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Link,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { userPrevilegeCheck } from "./utils/abstraction";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      localStorage.setItem("authToken", response.data.token);
      const userType = response.data.type;
      localStorage.setItem("type", response.data.type);
      userPrevilegeCheck();
      window.location.href='/';
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      background: {
        default: '#121212',
        paper: 'rgba(30, 30, 30, 0.8)',
      },
    },
    typography: {
      allVariants: {
        fontFamily: '"Lora", serif',
      },
      h1: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      }}>

        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.15,
        }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0,0 L100,100 C150,200 200,150 300,200 S500,100 600,200 S800,50 900,150 L1000,50"
              stroke="#90caf9" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M0,100 L100,0 C150,-50 200,0 300,-50 S500,50 600,0 S800,100 900,50 L1000,100"
              stroke="#90caf9" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </Box>
        
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
          zIndex: 0,
        }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1200 200" 
            preserveAspectRatio="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 C1150,200 1350,0 1500,100 L1500,200 L0,200 Z"
              fill="rgba(144, 202, 249, 0.1)"
            />
            <path 
              d="M0,150 C150,50 350,250 500,150 C650,50 850,250 1000,150 C1150,50 1350,250 1500,150 L1500,200 L0,200 Z"
              fill="rgba(144, 202, 249, 0.05)"
            />
          </svg>
        </Box>

        <Container maxWidth={'sm'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

          <Typography
            variant="h1"
            sx={{
              position: 'fixed',
              display: { xs: 'none', sm: 'block' },
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              fontWeight: 700,
              textShadow: "0 0 10px rgba(66,220,255,0.5)",
              fontSize: '20vw',
              zIndex: 0,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            GoPrime
          </Typography>
            
            <Box sx={{
              position: 'relative',
              zIndex: 1,
              p: 4,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            component={'form'}
            onSubmit={handleSubmit}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                Welcome Back
              </Typography>
              
              {error && (
                <Alert color="error" variant="outlined">{error}</Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                slotProps={{ input: {
                  style: {
                    borderRadius: '8px',
                  }
                }}}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                sx={{ mt: 2 }}
                slotProps={{ input: {
                  style: {
                    borderRadius: '8px',
                  }
                }}}
              />
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 0%, #1976d2 100%)',
                  }
                }}
                type="submit"
              >
                Sign In
              </Button>
              
              <Typography variant="body2" sx={{ 
                mt: 2, 
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                Don't have an account? <Link href={'/signup'} underline="hover" sx={{ color: '#90caf9' }}>Sign up</Link>
              </Typography>
            </Box>
            
          </motion.div>
          
          <Tooltip title={'View products without signing in'} arrow placement="right">
            <Link href={'/'} underline="none" sx={{
              position: 'fixed',
              display: { xs: 'none', md: 'block' },
              bottom: 40,
              left: 30,
              fontSize: 10,
              p: 1.5,
              border: '1px solid white',
              borderRadius: '50%',
              color: '#fff',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textShadow: '0 0 10px rgba(72, 191, 227, 0.5)',
              boxShadow: '0 1px 5px rgba(72, 191, 227, 0.5)',
              '&:hover': { backgroundColor: 'rgba(72, 191, 227, 0.5)' }
              }}
            >
              <ShoppingCartIcon sx={{ verticalAlign: 'middle' }} />
            </Link>
          </Tooltip>

          <Button variant={'outlined'} onClick={() => { navigate('/'); }} sx={{
            position: 'absolute',
            display: { xs: 'block', sm: 'none' },
            bottom: 40,
            left: '50%',
            translate: '-50%',
            width: '90%',
            borderRadius: 12,
            fontSize: 12,
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textShadow: '0 0 10px rgba(72, 191, 227, 0.5)',
            }}
          >
            GoPrime
          </Button>
            
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signin;