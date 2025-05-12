import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, TextField, Button, Typography, IconButton,
  ThemeProvider, createTheme, Grid2, Fade, Zoom, Tabs, Tab,
  CircularProgress
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ProfileAvatar from "./components/ProfileAvatar";
import ConfirmationDrawer from "./components/ConfirmationDrawer";
import Footer from "./components/Footer";
import GovernorateSelector from "./components/GovernorateSelector";

const BuyerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [buyer, setBuyer] = useState({ first_name: "", last_name: "", street: "", city: "", state: "", country: "", postal_code: null, governorate_id: null });
  const [newCard, setNewCard] = useState({ card_number: "", card_expiry: "", card_holder_name: "" });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/buyer/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setUserEmail(data.user.email);
        if (data.user?.encode) setPreview(`data:image/jpeg;base64,${data.user.encode}`);
        setBuyer({
          ...data.buyer,
          governorate_id: data.buyer.governorate_id ?? null,
        });
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
    
    setOpenEdit(true);
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", buyer.first_name);
      formData.append("last_name", buyer.last_name);
      formData.append("street", buyer.street);
      formData.append("city", buyer.city);
      formData.append("state", buyer.state);
      formData.append("country", buyer.country);
      formData.append("postal_code", buyer.postal_code);
      formData.append("governorate_id", buyer.governorate_id);
      formData.append("email", userEmail);
      if (profilePhoto) formData.append("profile_photo", profilePhoto);
      
      const response = await axios.put("http://localhost:5000/api/buyer/profile", formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (response.status === 200) {
        alert("Profile updated successfully");
        // Optionally refresh the page or update the state
        window.location.reload();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
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

      window.location.reload();
    } catch (err) {
      setError(`Failed to add payment method: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/buyer/payment", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        data: { id }
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
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: '#0f172a',
        paper: 'rgba(30, 41, 59, 0.8)',
      },
    },
    typography: {
      allVariants: {
        fontFamily: '"Lora", serif',
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.3s ease',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
          },
        },
      },
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth='md' 
        sx={{ 
          position: 'relative', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: 4
        }}
      >
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, #6366f1 0%, transparent 50%)'
        }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0,0 L100,100 C150,200 200,150 300,200 S500,100 600,200 S800,50 900,150 L1000,50"
              stroke="#6366f1" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M0,100 L100,0 C150,-50 200,0 300,-50 S500,50 600,0 S800,100 900,50 L1000,100"
              stroke="#6366f1" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </Box>

        <Fade in timeout={1000}>
          <Container 
            sx={{ 
              my: 5, 
              p: 4, 
              borderRadius: 2, 
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
              flex: 1
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  mb: 1
                }}
              >
                Personal Profile
              </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-selected': {
                      color: '#6366f1',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#6366f1',
                  },
                }}
              >
                <Tab label="Profile Information" />
                <Tab label="Payment Methods" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Box component={'form'} onSubmit={handleProfileUpdate} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid2 container spacing={4} sx={{ width: '100%', justifyContent: 'center' }}>
                  <Grid2 item size={{ xs: 12, md: 4 }}>
                    <Zoom in timeout={1000}>
                      <Box
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          p: 3,
                          borderRadius: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          width: '100%',
                          minHeight: '400px',
                          overflowY: 'auto',
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '3px',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)',
                            },
                          },
                        }}
                      >
                        <Box sx={{ 
                          position: 'relative', 
                          mb: 3, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          width: '100%',
                          flex: 1,
                          justifyContent: 'center'
                        }}>
                          <ProfileAvatar profilePhoto={preview} />
                          <Button 
                            variant="contained" 
                            component="label" 
                            sx={{ 
                              mt: 2,
                              backgroundColor: '#ec4899',
                              color: '#fff',
                              '&:hover': { 
                                backgroundColor: '#db2777',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                              }
                            }}
                          >
                            Change Photo
                            <input type="file" hidden onChange={handleFileChange} />
                          </Button>
                        </Box>
                      </Box>
                    </Zoom>
                  </Grid2>

                  <Grid2 item size={{ xs: 12, md: 8 }}>
                    <Fade in timeout={1500}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 2,
                          p: 3,
                          borderRadius: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          width: '100%'
                        }}
                      >
                        <TextField 
                          label="Email" 
                          value={userEmail} 
                          onChange={(e) => setUserEmail(e.target.value)} 
                          fullWidth 
                          required
                        />

                        <TextField 
                          label="First Name" 
                          value={buyer.first_name} 
                          onChange={(e) => setBuyer({ ...buyer, first_name: e.target.value })} 
                          fullWidth 
                          required
                        />

                        <TextField 
                          label="Last Name" 
                          value={buyer.last_name} 
                          onChange={(e) => setBuyer({ ...buyer, last_name: e.target.value })} 
                          fullWidth 
                          required
                        />

                        <TextField 
                          label="Street" 
                          value={buyer.street} 
                          onChange={(e) => setBuyer({ ...buyer, street: e.target.value })} 
                          fullWidth 
                          required
                        />

                        <TextField 
                          label="Country" 
                          value={buyer.country} 
                          onChange={(e) => setBuyer({ ...buyer, country: e.target.value })} 
                          fullWidth 
                          required
                        />

                        <TextField 
                          label="City" 
                          value={buyer.city} 
                          onChange={(e) => setBuyer({ ...buyer, city: e.target.value })} 
                          fullWidth 
                          required
                        />

                        {(String(buyer.country).toLowerCase() === 'US' || String(buyer.country).toLowerCase() === 'united states')  && (
                          <TextField 
                            label="State" 
                            value={buyer.state} 
                            onChange={(e) => setBuyer({ ...buyer, state: e.target.value })} 
                            fullWidth 
                          />
                        )}

                        <TextField 
                          label="Postal Code" 
                          value={(buyer.postal_code)?buyer.postal_code:""} 
                          onChange={(e) => setBuyer({ ...buyer, postal_code: e.target.value })} 
                          fullWidth 
                          required
                        />
                        {(String(buyer.country).toLowerCase() === 'jordan' || String(buyer.country).toLowerCase() === 'jo') && (
                          <GovernorateSelector 
                            value={buyer.governorate_id}
                            onChange={(value) => setBuyer({...buyer, governorate_id: value})}
                          />
                        )}
                      </Box>
                    </Fade>
                  </Grid2>
                </Grid2>
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ 
                    mt: 4,
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    width: '200px',
                    '&:hover': { 
                      backgroundColor: '#4f46e5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }
                  }}
                >
                  Save Profile
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                {error && (
                  <Typography 
                    color="error" 
                    align="center"
                    sx={{ 
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    {error}
                  </Typography>
                )}

                {openEdit && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleSaveChanges}
                      sx={{ 
                        backgroundColor: '#6366f1',
                        color: '#fff',
                        '&:hover': { 
                          backgroundColor: '#4f46e5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}

                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                        <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>Card Number</TableCell>
                        <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>Expiry Date</TableCell>
                        <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>Card Holder</TableCell>
                        <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentInfo.map((card, index) => (
                        <TableRow 
                          key={card.id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <TableCell>
                            <TextField 
                              fullWidth 
                              name="card_number" 
                              value={card.card_number} 
                              onChange={(e) => handleChangeForCardNumber(e, index)} 
                              slotProps={{ htmlInput: { maxLength: 19 } }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField 
                              fullWidth 
                              name="card_expiry" 
                              type="month" 
                              value={card.card_expiry} 
                              onChange={(e) => handleChange(e, index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField 
                              fullWidth 
                              name="card_holder_name" 
                              value={card.card_holder_name} 
                              onChange={(e) => handleChange(e, index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => {
                                console.log(card.id);
                                setCardToDelete(card.id);
                                setConfirmOpen(true);
                              }}
                              sx={{ 
                                color: '#ec4899',
                                '&:hover': { 
                                  backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <ConfirmationDrawer
                              open={confirmOpen}
                              onClose={() => {
                                setConfirmOpen(false);
                                setCardToDelete(null);
                              }}
                              message="Do you really want to delete this credit card?"
                              confirmText="Delete"
                              onConfirm={() => {
                                if (cardToDelete) {
                                  handleDeleteCard(cardToDelete);
                                  setConfirmOpen(false);
                                  setCardToDelete(null);
                                }
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
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            label="Expiry Date" 
                            type="month" 
                            value={newCard.card_expiry} 
                            onChange={(e) => setNewCard({ ...newCard, card_expiry: e.target.value })} 
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            label="Card Holder Name" 
                            value={newCard.card_holder_name} 
                            onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value.toUpperCase() })} 
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              backgroundColor: '#ec4899',
                              color: '#fff',
                              '&:hover': { 
                                backgroundColor: '#db2777',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                              }
                            }} 
                            onClick={async()=> { await handleAddCard(); }}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Container>
        </Fade>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default BuyerProfile;