import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Button, Container } from "@mui/material";
import AdminNavBar from "./components/AdminNav";
import Footer from "./components/Footer";

const AdminDeliveryRequests = () => {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/admin/delivery-personnel", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        .then((res) => setRequests(res.data));
    }, []);
  
    const handleApproval = (id) => {
      axios.put(`http://localhost:5000/api/admin/delivery/approve/${id}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setRequests((prev) => prev.filter((req) => req.id !== id));
      });
    };

    const handleReject = (id) => {
      axios.delete(`http://localhost:5000/api/admin/delivery/reject/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`}
      }).then(() => {
        setRequests((prev) => prev.filter((req) => req.id !== id));
      });
    };
  
    const columns = [
      { field: "id", headerName: "ID", width: 60 },
      { field: "email", headerName: "Email", width: 250 },
      { field: "phone_number", headerName: "Phone", width: 140 },
      { field: "vehicle_type", headerName: "Vehicle Type", width: 150 },
      { field: "status", headerName: "Status", width: 90 },
      { field: "created_at", headerName: "Joined", type: "dateTime", width: 180,
        valueFormatter: (params) => new Date(params).toISOString().slice(0, 10) + ' ' + new Date(params).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
          <>
          {params.row.status !== 'Active' ? (
            <>
              <Button onClick={() => handleApproval(params.row.id)} color="success" variant="contained">Approve</Button>
              <Button onClick={() => handleReject(params.row.id)} color="error" variant="contained">Reject</Button>
            </>
          ):(
            <Button onClick={() => handleReject(params.row.id)} color="error" variant="contained">Delete</Button>
          )}
          </>
        ),
      },
    ];
  
    return (
      <AdminNavBar>
        <Container maxWidth='xl' sx={{ minHeight: '53vh', p: 2 }}>
            <DataGrid rows={requests} columns={columns} pageSize={5} />
        </Container>
        <Footer />
      </AdminNavBar>
    );
  };

export default AdminDeliveryRequests;