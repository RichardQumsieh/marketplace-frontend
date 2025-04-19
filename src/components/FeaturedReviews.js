import { Avatar, Box, Typography, Rating } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const FeaturedReviews = ({ reviews }) => (
  <Box sx={{ mt: 3 }}>
    {reviews.map((review) => (
      <Box 
        key={review.id} 
        sx={{ 
          p: 3, 
          mb: 2, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={`data:image/jpeg;base64,${review.profile_photo_base64}`} 
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography fontWeight={600}>{review.first_name} {review.last_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDistanceToNow(review.created_at, { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
        <Typography>{review.review}</Typography>
      </Box>
    ))}
  </Box>
);

export default FeaturedReviews;