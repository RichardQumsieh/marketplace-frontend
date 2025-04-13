import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid2, Card, CardContent, Typography, CardMedia } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Grid2 container spacing={3} style={{ padding: '20px' }}>
      {products.map((product) => (
        <Grid2 item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={product.images?.[0] || '/default-product.jpg'}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography color="textSecondary">{product.description}</Typography>
              <Typography variant="subtitle1" color="primary">
                ${product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductList;