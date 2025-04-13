import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid2,
  Button,
  Paper,
  TextField,
  ThemeProvider,
  createTheme,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "react-material-ui-carousel";
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Footer from "./components/Footer";

const Image = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "contain",
  borderRadius: "10px",
});

const ViewProduct = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2', // A more professional blue
      },
      background: {
        default: '#121212', // Dark background
        paper: '#1e1e1e', // Slightly lighter for cards and papers
      },
      text: {
        primary: '#ffffff', // White text
        secondary: '#b3b3b3', // Light grey for secondary text
      },
    },
    typography: {
      fontFamily: '"Lora", serif', // Default for body
      h3: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        color: 'white'
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
        color: 'white'
      },
    },
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantityForBuyer, setQuantityForBuyer] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async (productId, quantity) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/cart/add",
            { productId, quantity },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            }
        );
        navigate('/cart');
    } catch (error) {
        console.error("Failed to add to cart:", error);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ mx: 2, my: 2, mb: 3 }}>
      <Grid2 container spacing={3}>
        <Grid2 item size = {{ xs: 12, sm: 4 }}>
          {product.images.length > 0 ? (
            <>
              <Carousel>
                {product.images.map((image, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpeg;base64,${image.base64}`}
                    alt={`Product Image ${index + 1}`}
                  />
                ))}
              </Carousel>
              { ['Admin', 'Seller'].includes(localStorage.getItem('type')) && (
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mt: 3 }}
                  startIcon={<EditIcon />}
                  endIcon={<LaunchIcon />}
                  onClick={() => { navigate('/edit-product/'+id) }}
                  fullWidth
                >
                  Edit Product
                </Button>
              )}
            </>
          ) : (
            <Typography>No images available</Typography>
          )}
        </Grid2>

        <Grid2 item size = {{ xs: 12, sm: 8 }}>
          <Paper sx={{ padding: "20px", borderRadius: "10px" }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" mt={2} >
              This product is brought to you by:&nbsp;
              <Link href={`/profile/${product.store_name}`} target="_blank" rel="noopener" variant="body1" fontWeight="bold" color="info" display={'inline-block'} underline="hover">
                {product.store_name}
              </Link>
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              {Number(product.price / 1.3701710).toFixed(2)} JOD
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
              Category: {product.category || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ my: 1 }}>
              In Stock: {product.quantity_in_stock}
            </Typography>

            {!['Admin', 'Seller'].includes(localStorage.getItem('type')) && (
              <Grid2 container spacing={4} sx={{ mt: 2 }}>
                <Grid2 size={6}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantityForBuyer}
                    onChange={(e) => setQuantityForBuyer(Math.min(product.quantity_in_stock, Math.max(1, e.target.value)))}
                    slotProps={{ min: 1, max: product.quantity_in_stock }}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 3, width: "100%" }}
                    onClick={() => { addToCart(product.id, quantityForBuyer); }}
                  >
                    Add to Cart
                  </Button>
                </Grid2>
              </Grid2>
            )}
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
    <Footer />
    </ThemeProvider>
  );
};

export default ViewProduct;