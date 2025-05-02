import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, CircularProgress, Container, Tooltip, Alert, Grid2 } from '@mui/material';
import axios from 'axios';
import AdminNavBar from './components/AdminNav';
import Footer from './components/Footer';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/orders', {
      headers: {
        Authorization : `Bearer ${localStorage.getItem('authToken')}`
      }
    }).then((res) => {
      setOrders(res.data.rows);
      setLoading(false);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", width: 90 },
    { field: "buyer_id", headerName: "Buyer ID", width: 90 },
    { field: "total_amount", headerName: "Total (JOD)", width: 100, type: "number", valueForamtter: (params) => { (params.value / 1.3701710).toFixed(2) }},
    { field: "status", headerName: "Status", width: 160,
      renderCell: (params) => {
        const createdAt = new Date(params.row.created_at);
        const now = new Date();
        const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24);

        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {(params.value === "Pending" && diffInDays > 3) ? (
              <Tooltip title="Requires Attention" arrow>
                <Typography color="error" variant='body2' fontWeight="bold">
                  {params.value}
                </Typography>
              </Tooltip>
            ) : (params.value)}
          </Box>
        );
      }
    },
    { field: "created_at", headerName: "Time Ordered", type: "dateTime", width: 180,
      valueFormatter: (params) => new Date(params).toISOString().slice(0, 10) + ' ' + new Date(params).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ];

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/orders/${id}`, { status }).then(() => {
      setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
    });
  };

  const deleteOrder = (id) => {
    axios.delete(`http://localhost:5000/api/orders/${id}`).then(() => {
      setOrders(orders.filter((order) => order.id !== id));
    });
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', left: '50%', top: 0, mt:'25%', translate: '-50%' }} />;

  return (
        <AdminNavBar>
          <Container maxWidth='xl' sx={{ minHeight: '53vh', p: 2 }}>
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2 item size={{ xs: 12, md: 6 }}>
                <DataGrid rows={orders} columns={columns} pageSize={5} getRowId={(row) => row.id} />
              </Grid2>
            </Grid2>
          </Container>
          <Footer />
      </AdminNavBar>
  );
};

export default AdminOrders;