import React, { useState, useEffect } from "react";
import { 
  Container, Grid2, Typography, Button, Divider, Box, 
  Checkbox, FormControlLabel,
  Stepper, Step, StepLabel, Alert, CircularProgress, TextField,
  createTheme,
  CssBaseline,
  ThemeProvider,
  StepContent,
  Radio
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from "axios";
import formatExpiry from "./utils/formatExpiry";
import OrderSuccessAnimation from "./components/OrderSuccessAnimation";

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
  
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState([]);

  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tempShippingDetails, setTempShippingDetails] = useState({
    street: '',
    city: '',
    country: '',
    zipCode: '',
    state: ''
  });

  const [tempPaymentDetails, setTempPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const [useSavedShipping, setUseSavedShipping] = useState(true);
  const [useSavedPayment, setUseSavedPayment] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
      if (!buyerResponse.data.buyer.street) setUseSavedShipping(false);
      if (buyerResponse.data.paymentMethods[0]) {
        setPaymentInfo(buyerResponse.data.paymentMethods);
      } else setUseSavedPayment(false);
    } catch (err) {
      setError("Failed to load checkout information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreation = async () => {
    try {
      setLoading(true);
      
      const shippingDetails = useSavedShipping ? {
        country: buyer.country,
        city: buyer.city,
        street: buyer.street,
        postal_code: buyer.postal_code,
        state: buyer.state
      } : {
        country: tempShippingDetails.country,
        city: tempShippingDetails.city,
        street: tempShippingDetails.street,
        postal_code: tempShippingDetails.zipCode,
        state: tempShippingDetails.state
      };

      const paymentDetails = useSavedPayment ? {
        payment_method_id: paymentMethodId,
        save_payment_method: false
      } : {
        card_number: tempPaymentDetails.cardNumber,
        expiry_date: tempPaymentDetails.expiryDate,
        card_holder_name: tempPaymentDetails.cardHolderName,
        save_payment_method: savePaymentMethod
      };

      const res = await axios.post(
        "http://localhost:5000/api/create-order",
        {
          finalPrice,
          ...shippingDetails,
          ...paymentDetails
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
      );

      setOrderId(res.data.orderId);
      setOrderSuccess(true);
    } catch (error) {
      setError("Failed to create order. Please try again.");
      console.error("Order creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0) / 1.3701710;
  const serviceFee = totalPrice * 0.065;
  const finalPrice = totalPrice + serviceFee;

  const validateShippingDetails = () => {
    if (useSavedShipping) {
      return buyer.street && buyer.city && buyer.country;
    } else {
      return (
        tempShippingDetails.street &&
        tempShippingDetails.city &&
        tempShippingDetails.country &&
        tempShippingDetails.zipCode &&
        (tempShippingDetails.country.toLowerCase() !== 'usa' || tempShippingDetails.state)
      );
    }
  };

  const validatePaymentDetails = () => {
    if (useSavedPayment) {
      return paymentMethodId !== null;
    } else {
      const cardNumber = tempPaymentDetails.cardNumber.replace(/\s/g, '');
      return (
        cardNumber.length >= 15 &&
        tempPaymentDetails.expiryDate &&
        tempPaymentDetails.cardHolderName
      );
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0: // Cart Review
        return cart.length > 0;
      case 1: // Shipping Details
        return validateShippingDetails();
      case 2: // Payment Details
        return validatePaymentDetails();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingDetailsChange = (field) => (event) => {
    setTempShippingDetails({
      ...tempShippingDetails,
      [field]: event.target.value
    });
  };

  const handlePaymentDetailsChange = (field) => (event) => {
    setTempPaymentDetails({
      ...tempPaymentDetails,
      [field]: event.target.value
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Order Summary
            </Typography>
            {cart.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Your cart is empty
              </Typography>
            ) : (
              <>
                {cart.map((item) => (
                  <Box key={item.id} sx={styles.itemCard}>
                    <Typography fontWeight={550}>{item.name}</Typography>
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
              </>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Shipping Details
            </Typography>
            
            {buyer.street ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useSavedShipping}
                      onChange={(e) => setUseSavedShipping(e.target.checked)}
                      value="saved"
                      name="shipping-option"
                    />
                  }
                  label="Use saved shipping address"
                  sx={{ mb: 2 }}
                />
                <Typography variant="subtitle1">
                  {buyer.country} - {buyer.city}, {buyer.street} {buyer.postal_code} {buyer.state}
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                No saved shipping address
              </Typography>
            )}
            
            {!useSavedShipping && (
              <Grid2 container spacing={2} sx={{ mt: 2 }}>
                <Grid2 item size={12}>
                  <TextField
                    fullWidth
                    required
                    label="Street Address"
                    value={tempShippingDetails.street}
                    onChange={handleShippingDetailsChange('street')}
                    error={!tempShippingDetails.street}
                    helperText={!tempShippingDetails.street ? "Street address is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    required
                    label="City"
                    value={tempShippingDetails.city}
                    onChange={handleShippingDetailsChange('city')}
                    error={!tempShippingDetails.city}
                    helperText={!tempShippingDetails.city ? "City is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    required
                    label="Country"
                    value={tempShippingDetails.country}
                    onChange={handleShippingDetailsChange('country')}
                    error={!tempShippingDetails.country}
                    helperText={!tempShippingDetails.country ? "Country is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    required
                    label="ZIP Code"
                    value={tempShippingDetails.zipCode}
                    onChange={handleShippingDetailsChange('zipCode')}
                    error={!tempShippingDetails.zipCode}
                    helperText={!tempShippingDetails.zipCode ? "ZIP code is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    label="State (Only in USA)"
                    value={tempShippingDetails.state}
                    onChange={handleShippingDetailsChange('state')}
                    error={tempShippingDetails.country.toLowerCase() === 'usa' && !tempShippingDetails.state}
                    helperText={tempShippingDetails.country.toLowerCase() === 'usa' && !tempShippingDetails.state ? "State is required for USA" : ""}
                  />
                </Grid2>
              </Grid2>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Details
            </Typography>

            {paymentInfo[0] ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useSavedPayment}
                    onChange={(e) => setUseSavedPayment(e.target.checked)}
                    value="saved"
                    name="payment-option"
                  />
                }
                label="Use saved payment method"
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography color="text.secondary">
                No saved payment methods available
              </Typography>
            )}

            {useSavedPayment ? (
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Saved Payment Methods
                </Typography>
                {paymentInfo.map((card) => (
                  <Box key={card.id} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={paymentMethodId === card.id}
                          onChange={(e) => setPaymentMethodId(card.id)}
                          value={card.id}
                          name="saved-payment"
                          color="primary"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 24,
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <PaymentIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            •••• {card.card_number.slice(-4)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              ml: 1.5,
                              color: 'text.secondary',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            (Expires {formatExpiry(card.card_expiry)})
                          </Typography>
                        </Box>
                      }
                      sx={{
                        width: '100%',
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        bgcolor: paymentMethodId === card.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Grid2 container spacing={2}>
                <Grid2 item size={12}>
                  <TextField
                    fullWidth
                    required
                    label="Card Number"
                    value={tempPaymentDetails.cardNumber}
                    onChange={handlePaymentDetailsChange('cardNumber')}
                    inputProps={{ maxLength: 19 }}
                    error={tempPaymentDetails.cardNumber.replace(/\s/g, '').length < 15}
                    helperText={tempPaymentDetails.cardNumber.replace(/\s/g, '').length < 15 ? "Valid card number is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    required
                    label="Expiry Date"
                    type="month"
                    value={tempPaymentDetails.expiryDate}
                    onChange={handlePaymentDetailsChange('expiryDate')}
                    error={!tempPaymentDetails.expiryDate}
                    helperText={!tempPaymentDetails.expiryDate ? "Expiry date is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={6}>
                  <TextField
                    fullWidth
                    required
                    label="CVV"
                    value={tempPaymentDetails.cvv}
                    onChange={handlePaymentDetailsChange('cvv')}
                    inputProps={{ maxLength: 3 }}
                    error={!tempPaymentDetails.cvv}
                    helperText={!tempPaymentDetails.cvv ? "CVV is required" : ""}
                  />
                </Grid2>
                <Grid2 item size={12}>
                  <TextField
                    fullWidth
                    required
                    label="Card Holder Name"
                    value={tempPaymentDetails.cardHolderName}
                    onChange={handlePaymentDetailsChange('cardHolderName')}
                    error={!tempPaymentDetails.cardHolderName}
                    helperText={!tempPaymentDetails.cardHolderName ? "Card holder name is required" : ""}
                  />
                </Grid2>
              </Grid2>
            )}

            {!useSavedPayment && (
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!savePaymentMethod}
                    onChange={(e) => setSavePaymentMethod(!e.target.checked)}
                  />
                }
                label="Save for future payments"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        );
      default:
        return null;
    }
  };

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

          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleOrderCreation : handleNext}
                        disabled={!isStepValid(index)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Complete Order' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {orderSuccess && (
            <OrderSuccessAnimation onClose={() => {setOrderSuccess(false); window.location.href = '/';}} order_id={orderId}/>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Checkout;