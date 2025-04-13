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

const BuyerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const options = useMemo(() => countryList().getData(), []);
  const [userEmail, setUserEmail] = useState('');
  const [buyer, setBuyer] = useState({ first_name: "", last_name: "", street: "", city: "", state: "", country: "", postal_code: null });
  const [country, setCountry] = useState('');
  const [newCard, setNewCard] = useState({ card_number: "", card_expiry: "", card_holder_name: "" });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errorNewCard, setErrorNewCard] = useState("");

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/buyer/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setUserEmail(data.user.email);
        if (data.user?.encode) setPreview(`data:image/jpeg;base64,${data.user.encode}`);
        setBuyer(data.buyer);
        setCountry(countryList().getData().find((val) => (val.value === data.buyer.country)));
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
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    if ( !buyer.first_name || !buyer.last_name || !buyer.street || !buyer.city || !buyer.country || !buyer.postal_code) {
      setError('You shall fill all required fields');
      return;
    };

    try {
      await axios.put("http://localhost:5000/api/buyer/payment", {paymentMethods: paymentInfo}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setError('');
      alert("Payment method updated successfully!");
    } catch (err) {
      setError(`Failed to update payment method: ${err}`);
    } finally {
      setSaving(false);
    }
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

  const handleAddCard = () => {
    if (newCard.card_number || newCard.card_expiry || newCard.card_holder_name) {
      setPaymentInfo([...paymentInfo, newCard]);
      setNewCard({ card_number: "", card_expiry: "", card_holder_name: "" });
      setErrorNewCard('');
    } else {
      setErrorNewCard('You must fill all these new card fields');
    };
  };

  const handleDeleteCard = (id) => {
    setPaymentInfo(paymentInfo.filter((card) => card.id !== id));
  };
  
  return (
    <ThemeProvider theme={createTheme({palette: {mode:'dark'}})}>
      <Container maxWidth="md" 
        sx={{ 
          my: 5, 
          p: 4, 
          borderRadius: 2, 
          backgroundColor: '#0d0d0d', 
          boxShadow: '0px 0px 30px rgba(0, 255, 255, 0.3)', 
          border: '1px solid rgba(0, 255, 255, 0.2)'
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
                      <TextField fullWidth name="card_number" value={card.card_number} onChange={(e) => handleChangeForCardNumber(e, index)} slotProps={{ htmlInput: { maxLength: 19 } }} />
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth name="card_expiry" type="month" value={card.card_expiry} onChange={(e) => handleChange(e, index)} />
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth name="card_holder_name" value={card.card_holder_name} onChange={(e) => handleChange(e, index)} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteCard(card.id)}>
                        <DeleteIcon sx={{ color: '#ff00ff' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <TextField label="Card Number" value={newCard.card_number} onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })} fullWidth />
                  </TableCell>
                  <TableCell>
                    <TextField label="Expiry Date" type="month" value={newCard.card_expiry} onChange={(e) => setNewCard({ ...newCard, card_expiry: e.target.value })} fullWidth />
                  </TableCell>
                  <TableCell>
                    <TextField label="Card Holder Name" value={newCard.card_holder_name} onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value.toUpperCase() })} fullWidth />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" sx={{ backgroundColor: '#ff00ff', '&:hover': { backgroundColor: '#ff33ff' }}} onClick={handleAddCard}>
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSave} 
            disabled={saving} 
            sx={{ mt: 2, backgroundColor: '#00ffff', color: '#000', '&:hover': { backgroundColor: '#33ffff' } }}
          >
            {saving ? "Saving..." : "Save Payment Method"}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default BuyerProfile;