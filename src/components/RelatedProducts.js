import { useState, useEffect } from 'react';
import axios from 'axios';

const RelatedProducts = (productId) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${productId}/related`, {
          params: { page, limit: 10 },
        });
        setProducts((prev) => [...prev, ...res.data]);
        if (res.data.length < 10) setHasMore(false);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [productId, page]);

  return { products, hasMore, loadMore: () => setPage((prev) => prev + 1) };
};

export default RelatedProducts;