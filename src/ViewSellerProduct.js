import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid2,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "react-material-ui-carousel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';

const Image = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "contain",
  borderRadius: "10px",
});

const ViewSellerProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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
    <Box sx={{ margin: "auto" }}>
      <Grid2 container spacing={3}>
        <Grid2 item size = {4}>
          {product.images.length > 0 ? (
            <>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mb: 3 }}
                startIcon={<ArrowBackIcon />}
                onClick={() => { navigate('/seller-profile') }}
              >
                Back to Profile
              </Button>
              <Carousel>
                {product.images.map((image, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpeg;base64,${image.base64}`}
                    alt={`Product Image ${index + 1}`}
                  />
                ))}
              </Carousel>
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
            </>
          ) : (
            <Typography>No images available</Typography>
          )}
        </Grid2>

        <Grid2 item size={8}>
          <Paper sx={{ padding: "20px", borderRadius: "10px" }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">
              {product.name}
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
            <Typography variant="body2" sx={{ mt: 1 }}>
              In Stock: {product.quantity_in_stock}
            </Typography>

            {!['Admin', 'Seller'].includes(localStorage.getItem('type')) && (
              <Button
              variant="contained"
              color="success"
              sx={{ mt: 3, width: "100%" }}
              >
                Add to Cart
              </Button>
            )}
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ViewSellerProduct;