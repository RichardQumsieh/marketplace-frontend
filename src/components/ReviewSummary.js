import { Rating, Typography, Box } from '@mui/material';

const ReviewSummary = ({ averageRating, reviewCount }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Rating 
        value={averageRating} 
        precision={0.1} 
        readOnly 
        sx={{ mr: 1.5 }}
      />
      <Typography variant="h6">
        {averageRating.toFixed(1)} · {reviewCount} reviews
      </Typography>
    </Box>
    <Typography color="text.secondary">
      {getRatingDescription(averageRating)}
    </Typography>
  </Box>
);

// Helper function
const getRatingDescription = (rating) => {
  const descriptions = [
    "Poor",
    "Fair",
    "Good",
    "Very Good",
    "Excellent"
  ];
  return descriptions[Math.floor(rating) - 1] || '';
};

export default ReviewSummary;