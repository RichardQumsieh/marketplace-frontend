import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
  Grid2,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  useEffect(() => {
    if (localStorage.getItem('type') !== 'Seller') navigate('/');
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(response => {
        const data = response.data;
        setProduct(data);
        setName(data.name);
        setPrice(data.price);
        setQuantity(data.quantity_in_stock);
        setCategory(data.category);
        setDescription(data.description);
        setImages(data.images);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveImage = (index, isNew, imageId = null) => {
    if (isNew) {
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
      setRemovedImageIds([...removedImageIds, imageId]);
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity_in_stock", quantity);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("removedImageIds", JSON.stringify(removedImageIds));
    newImages.forEach((file) => formData.append("newImages", file));

    axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(() => navigate("/"))
    .catch(err => console.error("Update failed", err));
  };

  if (loading) return <CircularProgress sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />;
  
  return (
    <Box sx={{ maxWidth: '72%', mx: 'auto', p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Edit Product</Typography>
      <TextField fullWidth label="Product Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Price (USD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
      <Typography variant="subtitle1">Note: 1 JOD = 1.3701710 USD ~ PayPal currency convert</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Price in JOD: {Number(price / 1.3701710).toFixed(2)}</Typography>
      <TextField fullWidth label="Stock Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)} select>
        {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
            {cat}
            </MenuItem>
        ))}
      </TextField>
      <TextField fullWidth label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
      
      <Typography variant="h6" mb={1}>Current Images</Typography>
      <Grid2 container spacing={2}>
        {images.map((img, index) => (
          <Grid2 item size={4} key={index}>
            <Card>
              <CardMedia component="img" height="100" image={`data:image/jpeg;base64,${img.base64}`} alt="Product image" />
              <CardContent>
                <IconButton onClick={() => {handleRemoveImage(index, false, img.id); console.log(img.id);}}><Delete /></IconButton>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      
      {newImages[0] && (
        <>
          <Typography variant="h6" mt={2} mb={1}>New Images</Typography>
          <Grid2 container spacing={2}>
            {newImages.map((file, index) => (
              <Grid2 item size={4} key={index}>
                <Card>
                  <CardMedia component="img" height="100" src={URL.createObjectURL(file)} alt="New upload" />
                  <CardContent>
                    <IconButton onClick={() => handleRemoveImage(index, true)}><Delete /></IconButton>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </>
    )}
      
      <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mt: 2 }}>
        Upload Images
        <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
      </Button>
      
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProduct;