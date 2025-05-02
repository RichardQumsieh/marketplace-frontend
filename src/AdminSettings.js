import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, MenuItem, Avatar, Alert, Container } from "@mui/material";
import ProfileAvatar from "./components/ProfileAvatar";
import { motion } from "framer-motion";
import Footer from "./components/Footer";
import AdminNavBar from "./components/AdminNav";

const AdminSettings = () => {
  const [admin, setAdmin] = useState({
    email: "",
    phone_number: "",
    profile_photo: "",
    role: "",
  });
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState({ oldPassword: "", newPassword: "" });
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/settings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      console.log(response.data);
      if (response.data.email) {
        setAdmin(response.data);
        if (response.data.profile_photo) setPreview(`data:image/jpeg;base64,${response.data.profile_photo}`);
      } else setError("Can't fetch details now");
    } catch (error) {
      console.error("Error fetching admin settings:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/admin/settings", admin,
        { headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        }
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:5000/api/admin/settings/password", newPassword, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      alert("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/admin/settings/role",
        { newRole: admin.role },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      alert("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdmin({...admin, profile_photo: file});
      setPreview(URL.createObjectURL(file));
    }
  };

  if (error) return (<Alert color="error">{error}</Alert>);

  else return (
    <AdminNavBar>
      <Container maxWidth="md" sx={{ minHeight: "53vh", py: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{
            margin: "auto",
            p: 3,
            textAlign: 'center',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(30, 30, 30, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <Typography variant="h5" gutterBottom>
              Admin Settings
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ProfileAvatar profilePhoto={preview ? preview : null} />
            </Box>
            <Button variant="contained" component="label" sx={{mt:1}}>
              Change Profile Photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            <TextField
              fullWidth
              label="Email"
              value={admin.email}
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={admin.phone_number}
              onChange={(e) => setAdmin({ ...admin, phone_number: e.target.value })}
              margin="normal"
            />

            <Button variant="contained" color="primary" onClick={handleProfileUpdate} sx={{ mt: 2 }}>
              Update Profile
            </Button>

            <Typography variant="h6" sx={{ mt: 4 }}>
              Change Password
            </Typography>

            <TextField
              fullWidth
              label="Old Password"
              type="password"
              onChange={(e) => setNewPassword({ ...newPassword, oldPassword: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
              margin="normal"
            />

            <Button variant="contained" color="secondary" onClick={handlePasswordChange} sx={{ mt: 2 }}>
              Change Password
            </Button>

            {admin.role === "Manager" && (
              <>
                <Typography variant="h6" sx={{ mt: 4 }}>
                  Update Role
                </Typography>

                <TextField
                  fullWidth
                  select
                  value={admin.role}
                  onChange={(e) => setAdmin({ ...admin, role: e.target.value })}
                  margin="normal"
                >
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Moderator">Moderator</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                </TextField>

                <Button variant="contained" color="warning" onClick={handleRoleUpdate} sx={{ mt: 2 }}>
                  Update Role
                </Button>
              </>
            )}
          </Box>
        </motion.div>
      </Container>
      <Footer />
    </AdminNavBar>
  );
};

export default AdminSettings;