import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import BusinessNavBar from "./components/BusinessNavBar";

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/delivery/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClaimOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/delivery/claim-order", { orderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setOrders(orders.filter(order => order.id !== orderId)); // Remove claimed order from UI
    } catch (error) {
      console.error("Error claiming order:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", width: 100 },
    { field: "buyer_id", headerName: "Buyer ID", width: 100 },
    { field: "total_amount", headerName: "Total (JOD)", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "created_at", headerName: "Created At", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={loading}
          onClick={() => handleClaimOrder(params.row.id)}
        >
          Claim Order
        </Button>
      ),
    },
  ];

  return (
    <BusinessNavBar>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Available Orders for Delivery
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        </Box>
      </Container>
    </BusinessNavBar>
  );
};

export default DeliveryOrders;