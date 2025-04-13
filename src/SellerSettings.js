import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileAvatar from "./components/ProfileAvatar";

export default function SellerSettings() {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [bankAccountInfo, setBankAccountInfo] = useState("");
  const [paypalMerchantId, setPaypalMerchantId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Fetch seller info
  useEffect(() => {
    axios.get(`http://localhost:5000/api/seller/${localStorage.getItem('id')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    })
    .then((res) => {
      const { store_name, store_description, bank_account_info, profile_photo, paypal_merchant_id } = res.data.seller;
      setStoreName(store_name);
      setStoreDescription(store_description);
      setBankAccountInfo(bank_account_info);
      setPaypalMerchantId(paypal_merchant_id);
      if (profile_photo) setPreview(`data:image/jpeg;base64,${profile_photo}`);
    })
    .catch((err) => console.error("Error fetching seller data:", err));
  }, []);

  // Handle Profile Photo Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submission
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
      navigate("/seller-profile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
        <Button
            variant="outlined"
            color="primary"
            sx={{ mb: 3 }}
            startIcon={<ArrowBackIcon />}
            onClick={() => { navigate('/seller-profile') }}
        >
            Back to Profile
        </Button>
        <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
            Seller Settings
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <ProfileAvatar profilePhoto={preview}/>
            <Button variant="contained" component="label" sx={{mt:1}}>
            Change Profile Photo
            <input type="file" hidden onChange={handleFileChange} />
            </Button>
        </Box>

        <TextField
            label="Store Name"
            fullWidth
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            sx={{ mb: 2 }}
        />

        <TextField
            label="Store Description"
            fullWidth
            multiline
            rows={3}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            sx={{ mb: 2 }}
        />

        <TextField
            label="PayPal Email Address"
            fullWidth
            value={bankAccountInfo}
            onChange={(e) => setBankAccountInfo(e.target.value)}
            sx={{ mb: 1 }}
        />

        <TextField
            label="PayPal Merchant ID"
            fullWidth
            value={paypalMerchantId}
            onChange={(e) => setPaypalMerchantId(e.target.value)}
            sx={{ mb: 1 }}
        />

        <Typography variant="caption" color="text.secondary">
            Important: To receive payments, please ensure you have entered a valid PayPal email address
        </Typography>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
            Save Changes
        </Button>
        </Paper>
    </>
  );
}