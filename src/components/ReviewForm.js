import { useState } from 'react';
import { 
  Box, 
  Rating, 
  TextField, 
  Button, 
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const ReviewForm = ({ photo, productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hover, setHover] = useState(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ rating, review: reviewText }),
        });

        if (res.ok) {
            setRating(0);
            setReviewText("");
            onReviewSubmitted?.(); // Refresh reviews
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = {
    0.5: 'Poor',
    1: 'Poor+',
    1.5: 'Fair',
    2: 'Fair+',
    2.5: 'Good',
    3: 'Good+',
    3.5: 'Very Good',
    4: 'Very Good+',
    4.5: 'Excellent',
    5: 'Excellent+'
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={photo}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="subtitle1">
          Write your review
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Rating
          value={rating}
          precision={0.5}
          onChange={(e, newValue) => setRating(newValue)}
          onChangeActive={(e, newHover) => setHover(newHover)}
          sx={{ 
            fontSize: '2rem',
            '& .MuiRating-iconFilled': {
              color: theme => theme.palette.primary.main
            }
          }}
        />
        {rating !== null && (
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
            {labels[hover !== -1 ? hover : rating] || 'Select rating'}
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience with this product..."
        inputProps={{ maxLength: 500 }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,0,0,0.2)'
            }
          }
        }}
      />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 1 
      }}>
        <Typography 
          variant="caption" 
          color={reviewText.length === 500 ? 'error' : 'text.secondary'}
        >
          {reviewText.length}/500 characters
        </Typography>

        <Button
          type="submit"
          variant="contained"
          disabled={!rating || reviewText.length < 10 || isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            '&:disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          {isSubmitting ? 'Posting...' : 'Post Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm;