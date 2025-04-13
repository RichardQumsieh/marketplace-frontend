import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Orders = () => {
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
    { field: "id", headerName: "Order ID", width: 150 },
    { field: "buyer_id", headerName: "Buyer ID", width: 120 },
    { field: "total_amount", headerName: "Total (JOD)", width: 120, type: "number" },
    { field: "status", headerName: "Status", width: 140 },
    { field: "created_at", headerName: "Order Date", width: 180 },
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
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h5" mb={1}>Order Management</Typography>
      <DataGrid rows={orders} columns={columns} pageSize={5} getRowId={(row) => row.id} />
    </Box>
  );
};

export default Orders;