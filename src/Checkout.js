import React, { useState, useEffect } from "react";
import { 
  Container, Grid2, Paper, Typography, Button, Divider, Box, 
  Checkbox, FormControlLabel, TableContainer, Table, TableHead, 
  TableCell, TableBody, TableRow, Radio, RadioGroup, FormControl,
  Stepper, Step, StepLabel, Alert, CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider
} from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion } from "framer-motion";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from "axios";

const styles = {
  container: {
    py: 4,
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #f3f4f6, #ffffff)',
  },
  paper: {
    p: 3,
    borderRadius: 2,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    height: '100%',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  orderSummary: {
    p: 3,
    borderRadius: 2,
    background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  itemCard: {
    p: 2,
    my: 2,
    borderRadius: 1,
    border: '1px solid #e0e0e0',
    background: '#ffffff',
  },
  priceGrid2: {
    width: '100%',
    maxWidth: 400,
    mt: 3,
    p: 2,
    borderRadius: 1,
    background: '#f8f9fa',
  },
  paypalContainer: {
    mt: 3,
    p: 2,
    borderRadius: 1,
    border: '1px solid #e0e0e0',
    background: '#ffffff',
  },
  tableContainer: {
    mt: 2,
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      background: '#f5f5f5',
    },
  },
};

const steps = ['Cart Review', 'Shipping Details', 'Payment'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [buyer, setBuyer] = useState({});
  const [oneTimePay, setOneTimePay] = useState(true);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cartResponse, buyerResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }),
        axios.get("http://localhost:5000/api/buyer/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
      ]);

      setCart(cartResponse.data);
      setBuyer(buyerResponse.data.buyer);
      if (buyerResponse.data.paymentMethods) {
        setPaymentInfo(buyerResponse.data.paymentMethods);
      }
    } catch (err) {
      setError("Failed to load checkout information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreation = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/create-order", { cartItems: cart });
      setOrderId(res.data.orderId);
      setActiveStep(2); // Move to payment step
    } catch (error) {
      setError("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalCreateOrder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/create-paypal-order",
        { orderId, isVault: oneTimePay, id: paymentMethodId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      return res.data.orderId;
    } catch (error) {
      setError("PayPal order creation failed. Please try again.");
      return null;
    }
  };

  const handlePayPalCapturePayment = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/capture-payment", {
        paypalOrderId: data.orderID,
        orderId,
        id: paymentMethodId
      });
      setActiveStep(3); // Move to completion step
    } catch (error) {
      setError("Payment capture failed. Please try again.");
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0) / 1.3701710;
  const serviceFee = totalPrice * 0.065;
  const finalPrice = totalPrice + serviceFee;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const theme = createTheme({
    palette: {
      mode: 'light'
    },
    typography: {
      allVariants: {
        fontFamily: '"Playfair Display", serif'
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Checkout
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid2 container spacing={4}>
            <Grid2 item size={8}>
              <Paper sx={styles.paper}>
                <Typography variant="h6" gutterBottom>
                  <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Order Summary
                </Typography>
                
                {cart.map((item) => (
                  <Box key={item.id} sx={styles.itemCard}>
                    <Typography fontWeight={550}>
                      {item.name}
                    </Typography>
                    <Typography color="text.secondary">
                      Quantity: {item.quantity} x {Number(item.price/1.3701710).toFixed(2)} JOD
                    </Typography>
                  </Box>
                ))}

                <Box sx={styles.priceGrid2}>
                  <Grid2 container spacing={2}>
                    <Grid2 item size={8}>
                      <Typography>Subtotal:</Typography>
                    </Grid2>
                    <Grid2 item size={4}>
                      <Typography align="right">
                        {totalPrice.toFixed(2)} JOD
                      </Typography>
                    </Grid2>
                    
                    <Grid2 item size={8}>
                      <Typography>Service Fee:</Typography>
                    </Grid2>
                    <Grid2 item size={4}>
                      <Typography align="right">
                        {serviceFee.toFixed(2)} JOD
                      </Typography>
                    </Grid2>
                    
                    <Grid2 item size={12}>
                      <Divider />
                    </Grid2>
                    
                    <Grid2 item size={8}>
                      <Typography fontWeight="bold">Total:</Typography>
                    </Grid2>
                    <Grid2 item size={4}>
                      <Typography fontWeight="bold" align="right">
                        {finalPrice.toFixed(2)} JOD
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Box>

                {orderId && (
                  <Box sx={styles.paypalContainer}>
                    <PayPalScriptProvider 
                      options={{ 
                        clientId: "AUydRRaKzCIlZ4A-egmNzqE7g-ldEZXuioq7UpApKI1nP4gy9dd0MhodgcKpqClnj4n-Ggz72y-OKMVg",
                        vault: true 
                      }}
                    >
                      <PayPalButtons
                        style={{ color: 'blue', shape: 'pill' }}
                        createOrder={handlePayPalCreateOrder}
                        onApprove={handlePayPalCapturePayment}
                      />
                    </PayPalScriptProvider>
                  </Box>
                )}
              </Paper>
            </Grid2>

            <Grid2 item size={4}>
              <Paper sx={styles.paper}>
                {buyer.city && (
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom>
                      <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Shipping Address
                    </Typography>
                    <Typography>
                      {buyer.street}, {buyer.city} - {buyer.country}
                    </Typography>
                  </Box>
                )}

                {paymentInfo[0] && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Payment Method
                    </Typography>

                    <FormControl sx={styles.tableContainer}>
                      <RadioGroup name="payment-method">
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Card Number</TableCell>
                                <TableCell>Expiry</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paymentInfo.map((card) => (
                                <TableRow key={card.id}>
                                  <TableCell>{card.card_number}</TableCell>
                                  <TableCell>{card.card_expiry}</TableCell>
                                  <TableCell>
                                    <Radio 
                                      value={card.id}
                                      onChange={(e) => setPaymentMethodId(e.target.value)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </RadioGroup>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={!oneTimePay}
                          onChange={(e) => setOneTimePay(!e.target.checked)}
                        />
                      }
                      label="Save for future payments"
                      sx={{ mt: 2 }}
                    />
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleOrderCreation}
                  disabled={(!oneTimePay || paymentMethodId) ? false : true}
                  sx={{ mt: 3 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Confirm Order"}
                </Button>
              </Paper>
            </Grid2>
          </Grid2>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Checkout;