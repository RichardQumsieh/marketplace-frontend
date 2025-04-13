import React, { useState } from "react";
import { TextField, Button, Typography, Box, MenuItem, Alert } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

const passRules = [
  '• at least one lowercase letter.',
  '• at least one digit.',
  '• at least one special character.',
  '• at least 8 characters long.'
];

const AdminAuthPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errorRegexPassword, setErrorRegexPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    userType: "Admin"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");
      
      if (error || errorConfirmPassword || errorRegexPassword) return;

      let response = await axios.post("http://localhost:5000/api/signup", formData);
      if (response.status === 201) {
        
        localStorage.setItem('authToken', response.data.token);
        setSuccess("Signup successful!");
        setTimeout(() => { window.location.href = "/"; } , 2000);
      };
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
      bgcolor="#f5f5f5"
    >
      <Box
        width={500}
        p={4}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        sx={{ my: 3 }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
        >
          Admin Portal
        </Typography>
        <Box component={'form'} onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        {error && <Alert severity="info">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => {
            handleInputChange(e);
            let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(e.target.value)) setError('Email should be like: johndoe@yourmailprovider.com');
            else setError('');
          }}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => {
            handleInputChange(e);
            let regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;
            if (!regex.test(e.target.value)) setErrorRegexPassword('Password must abide rules');
            else setErrorRegexPassword('');
          }}
          fullWidth
          margin="normal"
          required
        />
        {errorRegexPassword && <Alert severity="error">{errorRegexPassword}</Alert>}
        <Typography>Password must have:</Typography>
        <Box boxShadow={1} padding={2} bgcolor={'rgba(225,225,225,0.2)'}>
          {passRules.map((rule) => (
            <Typography sx={{ color: 'rgb(80,80,80)' }} fontSize='14px'>{rule}</Typography>
          ))}
        </Box>
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
        />
        {errorConfirmPassword && <Alert severity="error">{errorConfirmPassword}</Alert>}
          <TextField
            select
            label="User Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Support">Support</MenuItem>
          </TextField>
          <TextField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#3f51b5",
              color: "#f5f5f5",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAuthPage;