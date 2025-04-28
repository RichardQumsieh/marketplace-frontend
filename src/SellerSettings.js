import { alpha, Box, Button, CircularProgress, Container, CssBaseline, Grow, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileAvatar from "./components/ProfileAvatar";
import axios from "axios";
import SellerNav from "./components/SellerNav";

const SellerSettings = () => {
  const theme = useTheme();
  const [seller, setSeller] = useState({});
  const [loading, setLoading] = useState(true);

  const [preview, setPreview] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [bankAccountInfo, setBankAccountInfo] = useState("");
  const [paypalMerchantId, setPaypalMerchantId] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/seller/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setSeller(response.data);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  useEffect(() => {
    if (seller) {
      setPreview(seller.profile_photo ? `data:image/jpeg;base64,${seller.profile_photo}` : null);
      setStoreName(seller.store_name || "");
      setStoreDescription(seller.store_description || "");
      setBankAccountInfo(seller.bank_account_info || "");
      setPaypalMerchantId(seller.paypal_merchant_id || "");
    }
  }, [seller]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("store_name", storeName);
    formData.append("store_description", storeDescription);
    formData.append("paypal_merchant_id", paypalMerchantId);
    formData.append("bank_account_info", bankAccountInfo);
    if (profilePhoto) formData.append("profile_photo", profilePhoto);

    try {
      await axios.put("http://localhost:5000/api/seller/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SellerNav>
      <CssBaseline />
      <Grow in timeout={500}>
        <Container maxWidth='md' sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: 'primary.main'
            }}
          >
            Account Settings
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <ProfileAvatar profilePhoto={preview}/>
            <Button variant="contained" component="label" sx={{mt:1}}>
              Change Profile Photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          <Box sx={{
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            p: 3,
            borderRadius: 2,
            mb: 3,
            textAlign: 'left',
          }}>
            <TextField
              label="Store Name"
              fullWidth
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {seller?.email || 'Not provided'}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {seller?.phone_number || 'Not provided'}
            </Typography>
          </Box>

          <TextField
            label="Store Description"
            fullWidth
            multiline
            rows={6}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            sx={{ 
              p: 3,
              mb: 3,
              borderLeft: '4px solid',
              borderColor: 'primary.light',
              bgcolor: 'rgba(144, 202, 249, 0.05)',
              borderRadius: '0 8px 8px 0'
            }}
          />

          <TextField
            label="PayPal Email Address"
            fullWidth
            value={bankAccountInfo}
            onChange={(e) => setBankAccountInfo(e.target.value)}
            sx={{ my: 2 }}
          />

          <TextField
            label="PayPal Merchant ID"
            fullWidth
            value={paypalMerchantId}
            onChange={(e) => setPaypalMerchantId(e.target.value)}
            sx={{ my: 2 }}
          />

          <Typography variant="caption" color="text.secondary" my={1}>
            Important: To receive payments, please ensure you have entered a valid PayPal email address
          </Typography>

          <Button variant="contained" fullWidth onClick={handleSubmit}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
              boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
            }
          }}>
            Save Changes
          </Button>
        </Container>
      </Grow>
    </SellerNav>
  );
};

export default SellerSettings;