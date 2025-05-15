import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, CircularProgress, Container, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import AdminNavBar from './components/AdminNav';
import Footer from './components/Footer';
import { Error, EventNote } from '@mui/icons-material';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

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

  const handleRefundDialogOpen = (row) => {
    if (row.refund_id) {
      setSelectedRefund({
        id: row.refund_id,
        reason: row.refund_reason,
        details: row.refund_details,
        status: row.refund_status,
        created_at: row.refund_created_at
      });
      setRefundDialogOpen(true);
    } else {
      setSelectedRefund(null);
      setRefundDialogOpen(true);
    }
  };

  const handleRefundDialogClose = () => {
    setRefundDialogOpen(false);
    setSelectedRefund(null);
  };

  const columns = [
    { field: "id", headerName: "Order ID", width: 90 },
    { field: "buyer_id", headerName: "Buyer ID", width: 90 },
    { field: "total_amount", headerName: "Total (JOD)", width: 100, type: "number", valueFormatter: (params) => { (params.value / 1.3701710).toFixed(2) }},
    { field: "country", headerName: "Country", width: 90 },
    { field: "city", headerName: "City", width: 90 },
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
                  <Error fontSize='small' sx={{ verticalAlign: 'middle' }}/> {params.value}
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
    { field: "expires_at", headerName: "Expires at", type: "dateTime", width: 180,
      valueFormatter: (params) => new Date(params).toISOString().slice(0, 10) + ' ' + new Date(params).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    { field: "actions", headerName: "View & Update", width: 200,
      renderCell: (params) => (
        <Tooltip title={params.row.refund_id ? "View Refund Issue" : "No Refund Issue"}>
          <span>
            <IconButton
              color={params.row.refund_id ? "warning" : "success"}
              onClick={() => handleRefundDialogOpen(params.row)}
              disabled={!params.row.refund_id}
            >
              <EventNote />
            </IconButton>
          </span>
        </Tooltip>
      )
    },
    {
      field: "manage",
      headerName: "Manage",
      width: 260,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => updateStatus(params.row.id, "Delivered")}
          >
            Mark Delivered
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => deleteOrder(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/admin/orders/${id}`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).then(() => {
      setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
    });
  };

  const deleteOrder = (id) => {
    axios.delete(`http://localhost:5000/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).then(() => {
      setOrders(orders.filter((order) => order.id !== id));
    });
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', left: '50%', top: 0, mt:'25%', translate: '-50%' }} />;

  return (
      <AdminNavBar>
        <Container maxWidth='xl' sx={{ minHeight: '53vh', p: 2 }}>
              <DataGrid rows={orders} columns={columns} pageSize={5} getRowId={(row) => row.id} />
        </Container>
        <Dialog open={refundDialogOpen} onClose={handleRefundDialogClose}>
          <DialogTitle>Refund Request Details</DialogTitle>
          <DialogContent>
            {selectedRefund ? (
              <>
                <DialogContentText>
                  <strong>Reason:</strong> {selectedRefund.reason}
                </DialogContentText>
                <DialogContentText>
                  <strong>Details:</strong> {selectedRefund.details}
                </DialogContentText>
                <DialogContentText>
                  <strong>Status:</strong> {selectedRefund.status}
                </DialogContentText>
                <DialogContentText>
                  <strong>Requested At:</strong> {selectedRefund.created_at ? new Date(selectedRefund.created_at).toLocaleString() : ''}
                </DialogContentText>
              </>
            ) : (
              <DialogContentText>No refund request for this order.</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRefundDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </AdminNavBar>
  );
};

export default AdminOrders;