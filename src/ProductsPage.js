import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  Divider
} from '@mui/material';

const categories = ['All', 'Electronics', 'Clothing', 'Furniture', 'Books', 'Other'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const queryParam = selectedCategory !== 'All' ? `?category=${selectedCategory}&` : '?';
      const res = await fetch(`http://localhost:5000/api/search${queryParam}q=*`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', px: 4, py: 6 }}>
      {/* Category Sidebar */}
      <Paper sx={{ width: 220, mr: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ px: 2, py: 2, fontWeight: 'bold' }}>
          Categories
        </Typography>
        <Divider />
        <List>
          {categories.map((cat) => (
            <ListItemButton
              key={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              <ListItemText primary={cat} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Product Grid */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    product.image_base64
                      ? `data:image/jpeg;base64,${product.image_base64}`
                      : '/placeholder.jpg'
                  }
                  alt={product.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    title={product.name}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Rating
                    value={parseFloat(product.average_rating)}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Button
                    href={`/product/${product.id}`}
                    size="small"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, borderRadius: 2, fontWeight: 'bold' }}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}