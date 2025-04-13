import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Box, Typography, createTheme, ThemeProvider, Alert, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "@fontsource/oswald";
import "@fontsource/yeseva-one";
import "@fontsource/exo-2";

const vehicleTypes = ["Motorbike", "Car", "Truck"];
const passRules = [
  '• at least one lowercase letter.',
  '• at least one digit.',
  '• at least one special character.',
  '• at least 8 characters long.'
];

const DeliverySignup = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorRegexPassword, setErrorRegexPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone_number: "",
    vehicle_type: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (error || errorConfirmPassword || errorRegexPassword) return;
      const response = await axios.post("http://localhost:5000/api/delivery/signup", form);
      if (response.status === 201) {
        localStorage.setItem('authToken', response.data.token);
        window.location.href = '/delivery/profile';
      };
    } catch (error) {
      setError(error);
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: "'Oswald', 'Exo 2', sans-serif",
      h4: { fontFamily: "'Yeseva One', system-ui", fontWeight: 700 },
      subtitle1: { fontFamily: "'Exo 2', sans-serif", fontStyle: "italic" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "linear-gradient(135deg, #f5f7fa, #ffdde1,rgb(253, 160, 174))",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: "url('/Delivery-Car.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "70%",
            color: "white",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 4,
            position: 'relative',
            boxShadow: '3px 0 3px rgba(0,0,0,0.4)'
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ position:'absolute', left: '50%', translate: '-50%', top: '40px' }}>
            GoPrime Business
          </Typography>
          <Typography noWrap variant="subtitle1" sx={{ position:'absolute', left: '50%', translate: '-50%', bottom: '20px', opacity: 0.8 }}>
            "When applying, you shall wait for managers to accept your form."
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={300}>
            Delivery Personnel Signup
          </Typography>

          {error && <Alert color="error">{error}</Alert>}
          
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            value={form.email}
            onChange={(e) => {
              handleChange(e);
              let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (!regex.test(e.target.value)) setError('Email should be like: johndoe@yourmailprovider.com');
              else setError('');
            }}
            fullWidth
            margin="normal"
            sx={{ mt:1 }}
            slotProps={{ htmlInput: { borderRadius: 1 } }}
            required
          />

          <Accordion sx={{ textAlign: 'left', alignSelf: 'baseline', mt: 1, boxShadow: 1,  bgcolor: 'rgba(225,225,225,0.2)'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel-header"
            >
              <Typography component="span">Password must have:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {passRules.map((rule) => (
                <Typography sx={{ color: 'rgb(80,80,80)' }} fontSize='14px'>{rule}</Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {errorRegexPassword && <Alert severity="error">{errorRegexPassword}</Alert>}

          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={form.password}
            onChange={(e) => {
              handleChange(e);
              let regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;
              if (!regex.test(e.target.value)) setErrorRegexPassword('Password must abide rules');
              else setErrorRegexPassword('');
            }}
            fullWidth
            margin="normal"
            slotProps={{ htmlInput: { borderRadius: 1 } }}
            required
          />

          {errorConfirmPassword && <Alert severity="error">{errorConfirmPassword}</Alert>}

          <TextField
            label="Password Confirmation"
            name="password_confirmation"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e)=>{ setConfirmPassword(e.target.value);
              if (e.target.value !== form.password) setErrorConfirmPassword("Passwords do not match");
              else setErrorConfirmPassword('');
            }}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            margin="normal"
            slotProps={{ htmlInput: { borderRadius: 1 } }}
          />

          <TextField
            fullWidth
            select
            label="Vehicle Type"
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            margin="normal"
            slotProps={{ htmlInput: { borderRadius: 1 } }}
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2, width: "100%", backgroundColor: "#FF9800" }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DeliverySignup;