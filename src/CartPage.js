import { useState, useEffect } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, CardMedia, Link, createTheme, ThemeProvider } from "@mui/material";
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios";
import Footer from "./components/Footer";

const CartPage = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      background: {
        default: '#121212',
        paper: 'rgba(30, 30, 30, 0.8)',
      },
    },
    typography: {
      allVariants: {
        fontFamily: '"Lora", serif',
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      },
      h6: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      }
    },
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
  
      const maxQuantity = response.data.maxQuantity; // Get updated max from backend
  
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };  

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <ThemeProvider theme={theme}>
    <Container sx={{ my: 3, minHeight: '92vh' }}>
      <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }} variant="h4" gutterBottom>
        <ShoppingCartIcon fontSize="large" sx={{ verticalAlign: 'middle' }}/> Shopping Cart
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                        <CardMedia component="img" height="100" sx={{ my: 1, px: 1, objectFit: "contain" }} image={`data:image/jpeg;base64,${item.image}`} alt={'name'} />
                    </TableCell>
                    <TableCell >
                        <Link href={'/product/'+item.product_id} sx={{ color: "rgb(143, 143, 255)", textDecoration: 'none' }}>{item.name}</Link>
                    </TableCell>
                    <TableCell>{Number(item.price/1.3701710).toFixed(2)} JOD</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Math.max(1, e.target.value))}
                        slotProps={{ min: 1, max: item.maxQuantity }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{(item.price * item.quantity / 1.3701710).toFixed(2)} JOD</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" align="right" sx={{ mt: 2, color: 'text.primary' }}>
            Total: {Number(totalPrice / 1.3701710).toFixed(2)} JOD
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => { window.location.href= '/checkout'; }}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
    <Footer />
    </ThemeProvider>
  );
};

export default CartPage;