import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
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
      <Box
        component="form"
        onSubmit={handleForgotPassword}
        width={500}
        p={4}
        borderRadius={2}
        sx={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography 
          variant="h4" 
          textAlign="center" 
          sx={{
            color: '#ffffff',
            fontWeight: '500',
            letterSpacing: '0.5px',
            mb: 3
          }}
        >
          Reset Password
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 3,
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            background: '#4a90e2',
            color: '#ffffff',
            fontWeight: '500',
            textTransform: 'none',
            fontSize: '1rem',
            py: 1.5,
            '&:hover': {
              background: '#357abd',
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
            }
          }}
        >
          Send Reset Instructions
        </Button>
        
        <Box textAlign="center" mt={2}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/signup")}
            sx={{
              color: '#4a90e2',
              textDecoration: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                color: '#357abd',
                textDecoration: 'underline',
              }
            }}
          >
            Don't have an account? Sign up
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;