import { useState, useCallback } from 'react';
import { 
  Box, 
  Grid2, 
  Typography, 
  Divider, 
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';

const ProductMediaForm = ({ images, setImages }) => {
  const [previews, setPreviews] = useState(() => 
    images.map(image => (typeof image === 'string' ? image : URL.createObjectURL(image)))
  );

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => [...prev, event.target.result]);
        setImages(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  }, [images.length, setImages]);

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={12}>
        <Typography variant="h6" gutterBottom>
          Product Images
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload high-quality images (max 10). First image will be used as thumbnail.
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Grid2>

      <Grid2 item size={12}>
        <input
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          style={{ display: 'none' }}
          id="product-images-upload"
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <label htmlFor="product-images-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ mb: 3 }}
          >
            Upload Images
          </Button>
        </label>

        <Grid2 container spacing={2}>
          {previews.map((preview, index) => (
            <Grid2 item size={{ xs: 6, sm: 4, md: 3 }} key={index}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  variant="rounded"
                  src={preview}
                  sx={{ 
                    width: '100%', 
                    height: 120,
                    borderRadius: 2
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'error.contrastText'
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default ProductMediaForm;