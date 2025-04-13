import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Button } from "@mui/material";

export const AdminDeliveryRequests = () => {
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
      { field: "id", headerName: "ID", width: 90 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone_number", headerName: "Phone", width: 150 },
      { field: "vehicle_type", headerName: "Vehicle Type", width: 150 },
      { field: "status", headerName: "Status", width: 150 },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
          <>
          {params.row.status !== 'Active' ? (
            <>
              <Button onClick={() => handleApproval(params.row.id)} color="success">Approve</Button>
              <Button onClick={() => handleReject(params.row.id)} color="error">Reject</Button>
            </>
          ):(
            <Button onClick={() => handleReject(params.row.id)} color="error">Delete</Button>
          )}
          </>
        ),
      },
    ];
  
    return (
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography variant="h5" mb={1}>Delivery Requests</Typography>
        <DataGrid rows={requests} columns={columns} pageSize={5} />
      </Box>
    );
  };