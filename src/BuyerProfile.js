import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, TextField, Button, Typography, IconButton,
  ThemeProvider,
  createTheme
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useNavigate } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ProfileAvatar from "./components/ProfileAvatar";
import ConfirmationDrawer from "./components/ConfirmationDrawer";
import Footer from "./components/Footer";

const BuyerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [buyer, setBuyer] = useState({ first_name: "", last_name: "", street: "", city: "", state: "", country: "", postal_code: null });
  const [newCard, setNewCard] = useState({ card_number: "", card_expiry: "", card_holder_name: "" });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/buyer/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setUserEmail(data.user.email);
        if (data.user?.encode) setPreview(`data:image/jpeg;base64,${data.user.encode}`);
        setBuyer(data.buyer);
        if (data.paymentMethods) setPaymentInfo(data.paymentMethods);
      } catch (err) {
        setError("Failed to load payment information");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, []);

  const handleChangeForCardNumber = (e, index) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim();
  
    setPaymentInfo((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [e.target.name]: value } : card
      )
    );
  };  

  const handleChange = (e, index) => {
    setPaymentInfo((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [e.target.name]: e.target.value } : card
      )
    );
    setOpenEdit(true);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    };
    setOpenEdit(true);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", buyer.first_name);
    formData.append("last_name", buyer.last_name);
    formData.append("street", buyer.street);
    formData.append("city", buyer.city);
    formData.append("state", buyer.state);
    formData.append("country", buyer.country);
    formData.append("postal_code", buyer.postal_code);
    formData.append("email", userEmail);
    if (profilePhoto) formData.append("profile_photo", profilePhoto);
    
    axios.put("http://localhost:5000/api/buyer/profile", formData, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "multipart/form-data"
      },
    })
    .then(() => alert("Profile updated successfully"))
    .catch((err) => console.error("Error updating profile:", err));
  };

  const handleAddCard = async () => {
    // Validate all fields are filled
    if (!newCard.card_number || !newCard.card_expiry || !newCard.card_holder_name) {
      setError('Please fill all the required fields');
      return;
    }

    // Validate card number format (remove spaces for validation)
    const cleanCardNumber = newCard.card_number.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      setError('Card number must be between 13 and 19 digits');
      return;
    }

    try {
      setError('');
      // Make API call first
      await axios.post("http://localhost:5000/api/buyer/payment", {
        card_number: cleanCardNumber,
        card_expiry: newCard.card_expiry,
        card_holder_name: newCard.card_holder_name
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      // Only update UI after successful API call
      setPaymentInfo([...paymentInfo, {
        ...newCard,
        id: Date.now() // Temporary ID until we get the real one from the server
      }]);
      
      // Reset form
      setNewCard({ card_number: "", card_expiry: "", card_holder_name: "" });
      alert("Payment method has been added successfully!");
    } catch (err) {
      setError(`Failed to add payment method: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/buyer/payment", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        data: { id } // Send ID in request body
      });
      setPaymentInfo(paymentInfo.filter((card) => card.id !== id));
      setError('');
      alert("Payment method has been deleted successfully!");
    } catch (err) {
      setError(`Failed to delete payment method: ${err}`);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Find the card that was edited
      const editedCard = paymentInfo.find(card => 
        card.card_number !== newCard.card_number || 
        card.card_expiry !== newCard.card_expiry || 
        card.card_holder_name !== newCard.card_holder_name
      );

      if (editedCard) {
        await axios.post("http://localhost:5000/api/buyer/payment", {
          id: editedCard.id,
          card_number: editedCard.card_number.replace(/\s/g, ''),
          card_expiry: editedCard.card_expiry,
          card_holder_name: editedCard.card_holder_name
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        setOpenEdit(false);
        alert("Card information updated successfully!");
      }
    } catch (err) {
      setError(`Failed to update card information: ${err.response?.data?.message || err.message}`);
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
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      },
      h5: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        position: 'relative', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: 'none'
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

        <Container 
          maxWidth="md" 
          sx={{ 
            my: 5, 
            p: 4, 
            borderRadius: 2, 
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(30, 30, 30, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1,
            flex: 1
          }}
        >
          <Box sx={{ textAlign: 'center', color: '#00ffff', fontFamily: 'Orbitron, sans-serif' }}>
            <Typography variant="h4" gutterBottom sx={{ textShadow: '0px 0px 10px rgba(0, 255, 255, 0.8)' }}>
              Buyer Profile
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <ProfileAvatar profilePhoto={preview} />
            <Button 
              variant="contained" 
              component="label" 
              sx={{ mt: 1, backgroundColor: '#ff00ff', color: '#000', '&:hover': { backgroundColor: '#ff33ff' } }}
            >
              Change Profile Photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          <TextField label="Email (Required)" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />

          <TextField label="First Name (Required)" value={buyer.first_name} onChange={(e) => setBuyer({ ...buyer, first_name: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />

          <TextField label="Last Name (Required)" value={buyer.last_name} onChange={(e) => setBuyer({ ...buyer, last_name: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />

          <TextField label="Street (Required)" value={buyer.street} onChange={(e) => setBuyer({ ...buyer, street: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />

          <TextField label="City (Required)" value={buyer.city} onChange={(e) => setBuyer({ ...buyer, city: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />

          {buyer.country === 'US' && (
            <TextField label="State (Optional)" value={buyer.state} onChange={(e) => setBuyer({ ...buyer, state: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />
          )}

          <TextField label="Postal Code (Required)" value={(buyer.postal_code)?buyer.postal_code:""} onChange={(e) => setBuyer({ ...buyer, postal_code: e.target.value })} fullWidth margin="normal" slotProps={{ input: {sx: { color: '#fff', borderColor: '#00ffff' }} }} />
          
          <Button 
            variant="contained" 
            onClick={handleProfileUpdate} 
            sx={{ mt: 3, backgroundColor: '#00ffff', color: '#000', '&:hover': { backgroundColor: '#33ffff' } }}
          >
            Save Profile
          </Button>

          {/* Payment Section */}
          <Box mt={4} sx={{ color: '#00ffff' }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ textShadow: '0px 0px 10px rgba(0, 255, 255, 0.8)' }}>
              <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Payment Methods
            </Typography>
            
            {error && <Typography color="error" align="center">{error}</Typography>}

            {openEdit && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSaveChanges}
                  sx={{ 
                    backgroundColor: '#00ffff', 
                    color: '#000',
                    '&:hover': { 
                      backgroundColor: '#33ffff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 255, 255, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}

            <TableContainer component={Paper} sx={{ backgroundColor: '#121212', borderRadius: 2, border: '1px solid rgba(0, 255, 255, 0.2)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
                    <TableCell sx={{ color: '#00ffff' }}>Card Number</TableCell>
                    <TableCell sx={{ color: '#00ffff' }}>Expiry Date</TableCell>
                    <TableCell sx={{ color: '#00ffff' }}>Card Holder</TableCell>
                    <TableCell sx={{ color: '#00ffff' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentInfo.map((card, index) => (
                    <TableRow key={card.id}>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          name="card_number" 
                          value={card.card_number} 
                          onChange={(e) => handleChangeForCardNumber(e, index)} 
                          slotProps={{ htmlInput: { maxLength: 19 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField fullWidth name="card_expiry" type="month" value={card.card_expiry} onChange={(e) => handleChange(e, index)} />
                      </TableCell>
                      <TableCell>
                        <TextField fullWidth name="card_holder_name" value={card.card_holder_name} onChange={(e) => handleChange(e, index)} />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => setConfirmOpen(true)}>
                          <DeleteIcon sx={{ color: '#ff00ff' }} />
                        </IconButton>
                        <ConfirmationDrawer
                          open={confirmOpen}
                          onClose={() => setConfirmOpen(false)}
                          message="Do you really want to delete this credit card?"
                          confirmText="Delete"
                          onConfirm={() => {
                            handleDeleteCard(card.id);
                            setConfirmOpen(false);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <TextField 
                        label="Card Number" 
                        value={newCard.card_number} 
                        onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })} 
                        fullWidth 
                        slotProps={{ htmlInput: { maxLength: 19 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField label="Expiry Date" type="month" value={newCard.card_expiry} onChange={(e) => setNewCard({ ...newCard, card_expiry: e.target.value })} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField label="Card Holder Name" value={newCard.card_holder_name} onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value.toUpperCase() })} fullWidth />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" sx={{ backgroundColor: '#ff00ff', '&:hover': { backgroundColor: '#ff33ff' }}} onClick={async()=> { await handleAddCard(); }}>
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
        <Box sx={{ mt: 'auto' }}>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default BuyerProfile;