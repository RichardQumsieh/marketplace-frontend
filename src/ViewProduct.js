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
  Rating,
} from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "react-material-ui-carousel";
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Footer from "./components/Footer";
import FeaturedReviews from "./components/FeaturedReviews";
import ReviewSummary from "./components/ReviewSummary";
import ReviewForm from "./components/ReviewForm";

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
      h5: {
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
  const [reviews, setReviews] = useState(null);
  const [quantityForBuyer, setQuantityForBuyer] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
    const data = await res.json();
    setReviews(data);
  };

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
    fetchReviews();
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

  const formatDescription = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <div key={index} style={{ marginBottom: '8px' }}>
        • {line}
      </div>
    ));
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
          {product?.images.length > 0 ? (
            <>
              <Carousel stopAutoPlayOnHover animation="fade" swipe height={400} strictIndexing>
                {product?.images.map((image, index) => (
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
          <Paper sx={{
            padding: "20px",
            borderRadius: "10px", 
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(30, 30, 30, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">
              {product?.name}
            </Typography>
            <Box>
              {product?.average_rating == 0 ? (
                <Typography variant="caption">
                  Not yet rated - be the first one to rate it&nbsp;&nbsp;
                </Typography>
              ) : (
                <>
                  <Typography variant="caption">
                    Rating:&nbsp;&nbsp;
                  </Typography>
                  <ReviewSummary
                    averageRating={product?.rating_stats.average} 
                    reviewCount={product?.review_count} 
                  />
                </>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" mt={2} >
              This product is brought to you by:&nbsp;
              <Link href={`/profile/${product?.store_name}`} target="_blank" rel="noopener" variant="body1" fontWeight="bold" color="info" display={'inline-block'} underline="hover">
                {product?.store_name}
              </Link>
            </Typography>
            <Typography variant="h6" color="warning" sx={{ mt: 2 }}>
              {Number(product.price / 1.3701710).toFixed(2)} JOD
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {formatDescription(product?.description)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
              Category: {product?.category || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ my: 1 }}>
              In Stock: {product?.quantity_in_stock}
            </Typography>

            {!['Admin', 'Seller'].includes(localStorage.getItem('type')) && (
              <Grid2 container spacing={4} sx={{ mt: 2 }}>
                <Grid2 size={6}>
                  <TextField
                    size="small"
                    label="Quantity"
                    type="number"
                    value={quantityForBuyer}
                    sx={{ width: '100%' }}
                    onChange={(e) => setQuantityForBuyer(Math.min(product?.quantity_in_stock, Math.max(1, e.target.value)))}
                    slotProps={{ min: 1, max: product?.quantity_in_stock }}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ width: "100%", fontWeight: 600 }}
                    onClick={() => { addToCart(product?.id, quantityForBuyer); }}
                  >
                    Add to Cart
                  </Button>
                </Grid2>
              </Grid2>
            )}
          </Paper>
        </Grid2>
      </Grid2>
      
      <Box sx={{ mt: 2, borderTop: '1px solid rgba(255,255,255,0.08)', pt: 2 }}>
        <Typography variant="h5">Reviews</Typography>
        <FeaturedReviews reviews={reviews} />
        
        {product?.review_count > 3 && (
          <Button 
            component={Link}
            to={`/products/${id}/reviews`}
            variant="text"
            color="warning"
            sx={{ mt: 2 }}
          >
            See all reviews →
          </Button>
        )}
      </Box>

      <ReviewForm productId={id} onReviewSubmitted={fetchReviews}/>
    </Box>
    <Footer />
    </ThemeProvider>
  );
};

export default ViewProduct;