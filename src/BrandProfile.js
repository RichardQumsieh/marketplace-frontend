import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Divider, CircularProgress,
  Grid2, Card, CardContent, CardMedia, Rating,
  ThemeProvider,
  createTheme,
  Link,
  Tooltip
} from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatDistanceToNow } from 'date-fns';
import ProfileAvatar from "./components/ProfileAvatar";
import Footer from "./components/Footer";

export default function SellerProfile() {
  const { store_name } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    typography: {
      allVariants: {
        color: 'white',
        fontFamily: '"Lora", serif',
      },
      h5: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
      }
    },
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profile/${store_name}`)
      .then(res => setSeller(res.data))
      .catch(() => setSeller(null));

    axios.get(`http://localhost:5000/api/profile/${store_name}/products`)
      .then(res => setProducts(res.data.products))
      .catch(() => setProducts([]));
  }, [store_name]);

  if (!seller) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Seller Info */}
          <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
          }}>

            <ProfileAvatar profilePhoto={`data:image/jpeg;base64,${seller.encode}`} />
            
            <Box sx={{ flexGrow: 1 }}>
                <Typography 
                variant="h5" 
                sx={{ 
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    mb: 0.5
                }}
                >
                {seller.store_name}
                </Typography>
                
                <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
                }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                        color: seller.verification_status === 'Verified' ? 
                                'success.light' : 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                        }}
                    >
                        Verification:&nbsp;
                        {seller.verification_status === 'Verified' && (
                        <VerifiedIcon fontSize="small" color="success" />
                        )}
                        {seller.verification_status}
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Rating 
                        value={parseFloat(seller.store_rating)} 
                        precision={0.1} 
                        readOnly 
                        sx={{
                            '& .MuiRating-iconFilled': {
                            color: 'gold'
                            }
                        }}
                        />
                        <Typography variant="body2" color="text.secondary">
                        ({seller.store_rating || "Not Yet Rated"})
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* About Store */}
        <Typography variant="h6" gutterBottom>About the Store</Typography>
        <Typography sx={{ mb: 4 }}>{seller.store_description || "No description provided."}</Typography>

        {/* Seller Products */}
        <Typography variant="h6" gutterBottom>Products by {seller.store_name}</Typography>
        <Grid2 container spacing={3}>
            {products[0] && products.map(product => (
            <Grid2 item size={{ xs : 12, sm : 6, md : 2 }} key={product.id}>
                <Card sx={{ height: "100%" }}>
                    <CardMedia
                        component="img"
                        height="160"
                        image={`data:image/jpeg;base64,${product.first_image}`}
                        alt={product.title}
                    />
                    <CardContent>
                        <Tooltip title={product.name} arrow>
                            <Link
                            href={"/product/" + product.id}
                            style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                color: "rgb(143, 143, 255)"
                            }}
                            underline="hover"
                            variant="subtitle2"
                            >
                                {product.name}
                            </Link>
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary" my={1}>
                        {Number(product.price / 1.3701710).toFixed(2)} JOD
                        </Typography>
                        <Rating value={parseFloat(product.average_rating)} precision={0.5} readOnly size="small" sx={{ my : 1 }}/>
                        <Typography variant="caption" color="warning" display={'block'}>
                            Updated {formatDistanceToNow(new Date(product.updated_at), { addSuffix: true })}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid2>
            ))}
        </Grid2>
        </Box>
        <Footer />
    </ThemeProvider>
  );
}