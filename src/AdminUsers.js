import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Container } from "@mui/material";
import AdminNavBar from "./components/AdminNav";
import Footer from "./components/Footer";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "email", headerName: "Email" , width: 250},
    { field: "phone_number", headerName: "Phone", width: 140 },
    { field: "user_type", headerName: "Type", width: 90 },
    { field: "status", headerName: "Status", width: 90 },
    { field: "created_at", headerName: "Joined", type: "dateTime", width: 180,
      valueFormatter: (params) => new Date(params).toISOString().slice(0, 10) + ' ' + new Date(params).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Button variant="contained" color="error" onClick={() => handleDeleteUser(params.row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <AdminNavBar>
      <Container maxWidth='xl' sx={{ minHeight: '53vh', p: 2 }}>
        <DataGrid rows={users} columns={columns} pageSize={5} loading={loading} disableSelectionOnClick />
      </Container>
      <Footer />
    </AdminNavBar>
  );
};

export default AdminUsers;