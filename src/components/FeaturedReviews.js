import { Avatar, Box, Typography, Rating, Divider } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const FeaturedReviews = ({ reviews }) => {
  console.log(reviews);

  return (
    <Box>
      {reviews[0] && reviews?.map((review) => (
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
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Avatar 
            sizes=''
              src={`data:image/jpeg;base64,${review.profile_photo_base64}`} 
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant='subtitle2' fontWeight={600}>{review.first_name} {review.last_name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(review.created_at, { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Rating size='small' value={review.rating} precision={0.5} readOnly sx={{ mb: 1 }} />
          <Typography variant='subtitle2'>{review.review}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default FeaturedReviews;