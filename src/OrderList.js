import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/1') // Replace with dynamic user ID
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  }, []);

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/order_items/${orderId}`);
      setOrderItems((prev) => ({ ...prev, [orderId]: response.data }));
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 150 },
    { field: 'total_amount', headerName: 'Total Amount', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'status', headerName: 'Status', width: 150 },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
      <div>
        {orders.map((order) => (
          <Accordion key={order.id} onChange={() => fetchOrderItems(order.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Order #{order.id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {orderItems[order.id] ? (
                <ul>
                  {orderItems[order.id].map((item) => (
                    <li key={item.id}>
                      {item.product_id}: {item.quantity} x ${item.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>Loading items...</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default OrderList;