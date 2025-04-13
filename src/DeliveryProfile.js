import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Container, 
  MenuItem, 
  TextField, 
  Typography, 
  Box,
  Alert,
  CircularProgress 
} from "@mui/material";
import BusinessNavBar from "./components/BusinessNavBar";

const styles = {
  container: {
    mt: 3,
    p: 4,
    borderRadius: 2,
    bgcolor: "white",
    boxShadow: 1,
    background: "linear-gradient(135deg, #f5f7fa, #ffdde1, rgb(253, 160, 174))"
  },
  loadingContainer: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2
  },
  buttonContainer: {
    mt: 3,
    display: 'flex',
    gap: 2
  }
};

const vehicleTypes = ["Motorbike", "Car", "Truck"];

export const DeliveryProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone_number: "",
    vehicle_type: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/delivery/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUser(response.data);
      setFormData({
        phone_number: response.data.phone_number,
        vehicle_type: response.data.vehicle_type
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/sign-in");
      } else {
        setError("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    
    try {
      const response = await axios.put(
        "http://localhost:5000/api/delivery/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      setUser(response.data);
      setError("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <BusinessNavBar>
      <Container maxWidth="md">
        <Box sx={styles.container}>
          <Typography variant="h5" gutterBottom>Delivery Profile</Typography>
          
          {error && (
            <Alert 
              severity={error.includes("successfully") ? "success" : "error"} 
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <TextField 
            label="Email" 
            value={user.email} 
            fullWidth 
            disabled 
            margin="normal" 
          />
          
          <TextField 
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth 
            margin="normal"
          />
          
          <TextField 
            select 
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            fullWidth 
            margin="normal"
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {user.status === "Inactive" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Your application is under review.
            </Alert>
          )}

          <Box sx={styles.buttonContainer}>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>

            {user.status === "Active" && (
              <Button 
                variant="contained" 
                color="success"
                onClick={() => navigate("/delivery/orders")}
              >
                Delivery Workspace
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </BusinessNavBar>
  );
};