import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid2,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
  Link,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Tooltip,
  CardContent,
  CardMedia,
  Card,
  Rating,
} from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import Footer from "./components/Footer";
import FeaturedReviews from "./components/FeaturedReviews";
import ReviewSummary from "./components/ReviewSummary";
import ReviewForm from "./components/ReviewForm";
import SafeHTML from "./components/SafeHTML";

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
      allVariants: {
        fontFamily: '"Lora", serif', // Default for body
      },
      h6: {
        fontFamily: '"Playfair Display", serif',
        color: 'white'
      },
    },
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedPage, setRelatedPage] = useState(1);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);
  
  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
    const data = await res.json();
    setReviews(data);
  };

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}/related?page=${relatedPage}&limit=10`
      );
      if (!response.ok) throw new Error("Failed to fetch related products");
      const data = await response.json();

      setRelatedProducts((prev) => {
        // Filter out duplicates by checking product IDs
        const existingIds = new Set(prev.map((product) => product.id));
        const newProducts = data.filter((product) => !existingIds.has(product.id));
        return [...prev, ...newProducts];
      });

      if (data.length < 10) setHasMoreRelated(false); // No more products to load
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  }, [id, relatedPage]);

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
    fetchRelatedProducts();
  }, [id, fetchRelatedProducts]);

  const addToCart = async (productId, quantity) => {
    try {
        await axios.post(
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
            {product?.images.length > 0 ? (
              <Carousel stopAutoPlayOnHover animation="fade" swipe height={400} strictIndexing>
                {product?.images.map((image, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpeg;base64,${image.base64}`}
                    alt={`Product Image ${index + 1}`}
                  />
                ))}
              </Carousel>
            ) : (
              <Typography>No images available</Typography>
            )}
          </Grid2>

          <Grid2 item size = {{ xs: 12, sm: 8 }}>
            <Paper sx={{
              padding: "20px",
              borderRadius: "10px", 
              borderRadius: 1,
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
                <SafeHTML html={product?.description} />
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
                Category: {product?.category || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ my: 1 }}>
                In Stock: {product?.quantity_in_stock}
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 item size={{ xs: 12, sm: 6 }} sx={{ pr: { xs: 2, sm: 0 }, pl: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Additional Information
          </Typography>
          <Table sx={{ minWidth: 300, p: 2 }} size="small" aria-label="additional product information">
            <TableBody>
              <TableRow>
                <TableCell><strong>Width</strong></TableCell>
                <TableCell>{product?.width_cm || "N/A"} cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Height</strong></TableCell>
                <TableCell>{product?.height_cm || "N/A"} cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Depth</strong></TableCell>
                <TableCell>{product?.depth_cm || "N/A"} cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Weight</strong></TableCell>
                <TableCell>{product?.weight_kg || "N/A"} kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell>{product?.sku || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Barcode</strong></TableCell>
                <TableCell>{product?.barcode || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Condition</strong></TableCell>
                <TableCell>{product?.condition || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Digital Product</strong></TableCell>
                <TableCell>{product?.is_digital ? "Yes" : "No"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Requires Shipping</strong></TableCell>
                <TableCell>{product?.requires_shipping ? "Yes" : "No"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Tax Class</strong></TableCell>
                <TableCell>{product?.tax_class || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid2>

        <Grid2 item size={{ xs: 12, sm: 6 }} sx={{ borderLeft: { xs: 0, sm: '1px solid rgba(255, 255, 255, 0.1)' }, pr: 2, pl: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Reviews</Typography>
          <Box>
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
            <ReviewForm productId={id} onReviewSubmitted={fetchReviews}/>
          </Box>
        </Grid2>
      </Grid2>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Related Products
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)", // 1 column on extra-small screens
              sm: "repeat(2, 1fr)", // 2 columns on small screens
              md: "repeat(3, 1fr)", // 3 columns on medium screens
              lg: "repeat(4, 1fr)", // 4 columns on large screens
            },
            gap: 2, // Space between cards
            paddingBottom: 2,
          }}
        >
          {relatedProducts.map((product) => (
            <Card 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0)',
                animation: 'fadeInUp 0.5s ease-out',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '& .MuiCardMedia-root': {
                    transform: 'scale(1.05)',
                  }
                }
              }}
            >
              <Grid2 container sx={{ px: 1, py: 0.5 }}>
                <Grid2 item size={6} textAlign="left">
                  <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                    Sold by <Link href={`/profile/${product?.store_name}`} underline="hover" color="primary">{product.store_name}</Link>
                  </Typography>
                </Grid2>
                <Grid2 item size={6} textAlign="right">
                  <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                    {(product.verification_status === "Pending") ? "Not Yet Verified" : "Verified Seller ✅"}
                  </Typography>
                </Grid2>
              </Grid2>
              <CardMedia
                component="img"
                height="200"
                sx={{
                  my: 1,
                  px: 1,
                  objectFit: "contain",
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease-in-out',
                }}
                image={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
              />
              <CardContent>
                <Tooltip title={product.name} arrow>
                  <Link
                    href={"/product/" + product.id}
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      color: "rgb(143, 143, 255)",
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: "rgb(173, 173, 255)",
                      }
                    }}
                  >
                    {product.name}
                  </Link>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      my: 1,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {product.description}
                  </Typography>
                </Tooltip>
                <Grid2 container sx={{ mb: 1 }}>
                  <Grid2 item size={6} textAlign="left">
                    <Typography variant="body2" color="text.secondary">
                      Category: <Typography variant="body2" color="info" display={'inline'}>{product.category}</Typography>
                    </Typography>
                  </Grid2>
                  <Grid2 item size={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      {product.quantity_in_stock} in stock
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2 container sx={{ mb: 1 }}>
                    <Grid2 item size={6} textAlign="left">
                      <Typography 
                        variant="body2" 
                        color="warning"
                        sx={{
                          fontWeight: 'bold',
                        }}
                      >
                        {Number(product.price / 1.3701710).toFixed(2)} JOD
                      </Typography>
                    </Grid2>
                    <Grid2 item size={6} textAlign="right">
                      {(product.average_rating == 0) ? (
                        <Typography variant="caption">Be the first to review 🎈</Typography>
                      ) : (
                        <Rating size="small" value={product.average_rating} />
                      )}
                    </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Footer />
    </ThemeProvider>
  );
};

export default ViewProduct;