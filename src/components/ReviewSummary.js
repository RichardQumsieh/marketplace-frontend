import { Rating, Typography, Box } from '@mui/material';

const ReviewSummary = ({ averageRating, reviewCount }) => (
  <Box sx={{ display: 'inline-block', alignItems: 'center' }}>
    <Rating 
      size='small'
      value={averageRating} 
      precision={0.1} 
      readOnly 
      sx={{ mr: 1, verticalAlign: 'middle' }}
    />
    <Typography variant="caption">
      {averageRating.toFixed(1)} - {getRatingDescription(averageRating)} · ({reviewCount})
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