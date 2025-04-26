import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  CssBaseline,
  Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import { debounce } from 'lodash';

const SearchNavbar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const searchProducts = debounce(async (q, cat) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/search', {
        params: { q, category: cat }
      });
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchProducts(query, category);
  }, [query, category]);

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    handleCategoryClose();
  };

  return (
    <>
        <CssBaseline />
        <Box sx={{ position: 'relative', width: {xs: 200, sm: '100%'}, maxWidth: 600 }}>
        <Paper
            elevation={0}
            sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            '&:hover': {
                border: '1px solid #bdbdbd',
            },
            }}
        >
            <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            />
            <IconButton
            sx={{ p: '10px' }}
            onClick={handleCategoryClick}
            color={category ? 'primary' : 'default'}
            >
            <CategoryIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton sx={{ p: '10px' }}>
            {loading ? <CircularProgress size={20} /> : <SearchIcon />}
            </IconButton>
        </Paper>

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCategoryClose}
        >
            <MenuItem onClick={() => handleCategorySelect('')}>All Categories</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Electronics')}>Electronics</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Furniture')}>Furniture</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Clothing')}>Clothing</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Books')}>Books</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Home')}>Home & Garden</MenuItem>
            <MenuItem onClick={() => handleCategorySelect('Other')}>Other</MenuItem>
        </Menu>

        {showResults && results.length > 0 && (
            <Paper
            elevation={3}
            sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                maxHeight: '400px',
                overflow: 'hidden',
                zIndex: 1000,
            }}
            >
            {results.map((product) => (
                <Link
                key={product.id}
                href={`/product/${product.id}`}
                underline='hover'
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 2, 
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                    bgcolor: 'action.hover',
                    },
                }}
                >
                    <Box
                        component="img"
                        src={`data:image/jpeg;base64,${product.image_base64}`}
                        alt={product.name}
                        sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'contain',
                        borderRadius: 1,
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>{product.name}</Typography>
                        <Typography variant="caption" color='text.secondary' sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>{product.description}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(product.price / 1.3701710).toFixed(2)} JOD
                        </Typography>
                    </Box>
                </Link>
            ))}
            </Paper>
        )}
        </Box>
    </>
  );
};

export default SearchNavbar;