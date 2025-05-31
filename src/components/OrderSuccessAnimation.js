import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Collapse, 
  Fade, 
  Slide,
  Zoom,
  useTheme
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Confetti from 'react-dom-confetti';

const OrderSuccessAnimation = ({ onClose, order_id }) => {
  const [active, setActive] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confettiConfig = {
    angle: 90,
    spread: 100,
    startVelocity: 35,
    elementCount: 100,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: [
      theme.palette.primary.main, 
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ]
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      bgcolor: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Confetti (hidden div that triggers the effect) */}
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <Confetti active={active} config={confettiConfig} />
      </div>

      <Slide in direction="up" timeout={500}>
        <Box sx={{
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 4,
          mx: 2,
          boxShadow: 24,
          textAlign: 'center',
          position: 'relative'
        }}>
          <Zoom in style={{ transitionDelay: '300ms' }}>
            <CheckCircleOutlineRoundedIcon sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
            }} />
          </Zoom>

          <Fade in timeout={800}>
            <Typography variant="h4" sx={{ 
              mb: 1,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.light} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Order Confirmed!
            </Typography>
          </Fade>

          <Collapse in timeout={1000}>
            <Typography variant="body1" sx={{ 
              mb: 3,
              color: 'text.secondary'
            }}>
              Your order has been successfully placed. We've sent a receipt to your email.
            </Typography>
          </Collapse>

          <Collapse in timeout={1200}>
            <Box sx={{ 
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.02)'
            }}>
                <Typography variant="subtitle2">Order #{order_id}</Typography>
                <Typography variant="body2">Estimated delivery: {
                    `${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} ~ ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                  }
                </Typography>
            </Box>
          </Collapse>

          <Fade in timeout={1500}>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={onClose}
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                See other Products
              </Button>
            </Box>
          </Fade>
        </Box>
      </Slide>
    </Box>
  );
};

export default OrderSuccessAnimation;