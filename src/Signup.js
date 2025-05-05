import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Alert, MenuItem, Link, ThemeProvider, createTheme, CssBaseline, Accordion, AccordionSummary, AccordionDetails, Container, Tooltip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const passRules = [
  '• at least one lowercase letter.',
  '• at least one digit.',
  '• at least one special character.',
  '• at least 8 characters long.'
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    userType: "Buyer", // Default selection
    firstName: "",
    lastName: "",
    address: "",
    storeName: "",
    storeDescription: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorRegexPassword, setErrorRegexPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setError("");
      setSuccess("");

      if (error || errorConfirmPassword || errorRegexPassword) return;
      let response = await axios.post("http://localhost:5000/api/signup", formData);

      localStorage.setItem('authToken', response.data.token);
      setSuccess("Signup successful!");
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
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
        color: 'rgba(0, 0, 0, 0.7)'
      },
      h1: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 1)'
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 1)'
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #1a1f25 0%, #2d353f 100%)',
          backgroundSize: 'cover',
          position: 'relative',
        }}
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
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
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
              d="M0,0 L50,70 C150,100 170,150 250,200 S300,70 600,140 S450,50 700,150 L500,0"
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
          height: '150px', // Adjust height as needed
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <svg 
            viewBox="0 0 1200 150" 
            preserveAspectRatio="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            <path 
              d="M0,96 C150,36 350,156 500,96 C650,36 750,126 900,66 C1050,6 1200,96 1200,96 L1200,150 L0,150 Z"
              fill="rgba(144, 202, 249, 0.15)" // Primary color with opacity
            />
            <path 
              d="M0,126 C150,96 300,66 450,126 C600,186 750,96 900,126 C1050,156 1200,96 1200,96 L1200,150 L0,150 Z"
              fill="rgba(144, 202, 249, 0.08)" // Lighter secondary wave
            />
          </svg>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Container maxWidth="sm">
            <Box
              p={4}
              borderRadius={2}
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(30, 30, 30, 0.7)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                my: 4
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{
                  color: '#ffffff',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                Create Account
              </Typography>
              {error && <Alert severity="info" variant="filled" sx={{ opacity: 0.85 }}>{error}</Alert>}
              {success && <Alert severity="success" variant="filled" sx={{ opacity: 0.85 }}>{success}</Alert>}
              <TextField
                autoFocus
                label="Email"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  if (!regex.test(e.target.value)) setError('Email should be like: johndoe@yourmailprovider.com');
                  else setError('');
                }}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4a90e2',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4a90e2',
                  },
                }}
              />
              {errorRegexPassword && <Alert severity="error" variant="filled" sx={{ opacity: 0.85 }}>{errorRegexPassword}</Alert>}
              
              <Accordion sx={{ textAlign: 'left', alignSelf: 'baseline', mt: 1, boxShadow: 1,  bgcolor: 'rgba(225,225,225,0.2)'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel-header"
                >
                  <Typography component="span" sx={{ color: 'rgb(255,255,255)' }}>Password must have:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {passRules.map((rule) => (
                    <Typography sx={{ color: 'rgb(255,255,255)' }} fontSize='14px'>{rule}</Typography>
                  ))}
                </AccordionDetails>
              </Accordion>

              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  let regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;
                  if (!regex.test(e.target.value)) setErrorRegexPassword('Password must abide rules');
                  else setErrorRegexPassword('');
                }}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4a90e2',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4a90e2',
                  },
                }}
              />
              {errorConfirmPassword && <Alert severity="error" variant="filled" sx={{ opacity: 0.85 }}>{errorConfirmPassword}</Alert>}
              <TextField
                label="Password Confirmation"
                name="password_confirmation"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e)=>{ setConfirmPassword(e.target.value);
                  if (e.target.value !== formData.password) setErrorConfirmPassword("Passwords do not match");
                  else setErrorConfirmPassword('');
                }}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4a90e2',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4a90e2',
                  }
                }}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                variant="outlined"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4a90e2',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4a90e2',
                  },
                }}
              />
              <TextField
                select
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                      color: 'white'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4a90e2',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <MenuItem value="Buyer">Buyer</MenuItem>
                <MenuItem value="Seller">Seller</MenuItem>
              </TextField>
              {formData.userType === "Buyer" && (
                <>
                  <TextField
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4a90e2',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: '#4a90e2',
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4a90e2',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: '#4a90e2',
                      },
                    }}
                  />
                  <TextField
                    label="Address"
                    name="address"
                    variant="outlined"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4a90e2',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: '#4a90e2',
                      },
                    }}
                  />
                </>
              )}
              {formData.userType === "Seller" && (
                <>
                  <TextField
                    label="Store Name"
                    name="storeName"
                    variant="outlined"
                    value={formData.storeName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4a90e2',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: '#4a90e2',
                      },
                    }}
                  />
                  <TextField
                    label="Store Description"
                    name="storeDescription"
                    variant="outlined"
                    value={formData.storeDescription}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4a90e2',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: '#4a90e2',
                      },
                    }}
                  />
                </>
              )}
              <Button 
                variant="contained" 
                onClick={handleSignup} 
                fullWidth
                sx={{
                  background: '#4a90e2',
                  color: '#ffffff',
                  fontWeight: '500',
                  textTransform: 'none',
                  fontSize: '1rem',
                  mt: 2,
                  py: 1.5,
                  '&:hover': {
                    background: '#357abd',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
                  }
                }}
              >
                Create Account
              </Button>
              <Box display="flex" justifyContent="center" mt={2}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account? <Link href="/sign-in" underline="hover">Sign in</Link>
                </Typography>
              </Box>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => { navigate('/'); }} 
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    textAlign: 'center',
                    width: '100%',
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textShadow: '0 0 10px rgba(72, 191, 227, 0.5)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  GoPrime
                </Button>
              </Box>
            </Box>
          </Container>
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
          }}>
            <ShoppingCartIcon sx={{ verticalAlign: 'middle' }} />
          </Link>
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;