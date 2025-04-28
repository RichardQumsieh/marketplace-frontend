import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Backdrop,
  CssBaseline,
  ThemeProvider,
  useTheme,
  Container,
} from "@mui/material";
import axios from "axios";

const RefundForm = ({ order, isOpen, onClose, onSuccess }) => {
  const theme = useTheme();
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/orders/${order.id}/refunds`, {
      reason: category, details
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
    });
    onSuccess({ order, category, details });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Backdrop
        open={isOpen}
        sx={{
          zIndex: 1300,
          color: "#fff",
          backdropFilter: "blur(5px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            bgcolor: "rgba(50, 50, 70, 0.9)",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Refund Request</Typography>
            <Typography variant="h6" color="warning">Order ID: {order?.id}</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: "20px", textAlign: "left" }}>
              <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                Category:
              </Typography>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                <MenuItem value="wrong">Wrong Item</MenuItem>
                <MenuItem value="damaged">Damaged Item</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Box>
            <Box sx={{ marginBottom: "20px", textAlign: "left" }}>
              <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                Details:
              </Typography>
              <TextField
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide additional details..."
                multiline
                rows={6}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="button"
                variant="text"
                color="text.secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="outlined" color="warning">
                Submit
              </Button>
            </Box>
          </form>
        </Container>
      </Backdrop>
    </ThemeProvider>
  );
};

export default RefundForm;