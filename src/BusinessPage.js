import { useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid2, 
  Card, 
  CardContent,
  CardMedia,
  Button,
  useTheme
} from "@mui/material";
import { motion } from "framer-motion";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import BusinessNavBar from "./components/BusinessNavBar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from "react-router-dom";

const styles = {
  hero: {
    height: '80vh',
    background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("images/delivery-hero.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
  section: {
    py: 8,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-10px)',
    },
  },
  statCard: {
    textAlign: 'center',
    p: 3,
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    color: 'white',
    borderRadius: 2,
  },
  testimonial: {
    background: '#f5f5f5',
    borderRadius: 2,
    p: 4,
    position: 'relative',
    '&::before': {
      content: '"\\201C"',
      fontSize: '4rem',
      position: 'absolute',
      top: -20,
      left: 20,
      color: '#ddd',
    },
  },
};

const BusinessPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: "Fast Delivery",
      description: "Experience lightning-fast delivery services with our professional drivers.",
      image: "/images/fast-delivery.jpg"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure Transport",
      description: "Your packages are handled with utmost care and security.",
      image: "images/secure-transport.png"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Real-time Tracking",
      description: "Track your deliveries in real-time with our advanced tracking system.",
      image: "images/tracking.jpg"
    },
  ];

  return (
    <BusinessNavBar>
      {/* Hero Section */}
      <Box sx={styles.hero}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" gutterBottom>
              Revolutionizing Delivery Services
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Join our network of professional delivery partners
            </Typography>
            {!localStorage.getItem('type') && (
              <Button variant="contained" size="large" color="primary" onClick={() => { navigate('/delivery/signup'); }}>
                Get Started
              </Button>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={styles.section}>
        <Typography variant="h3" textAlign="center" gutterBottom data-aos="fade-up">
          Why Choose Us?
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid2 item size={4} key={index} data-aos="fade-up">
              <Card sx={styles.card}>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  {feature.icon}
                  <Typography variant="h5" sx={{ my: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'background.default', ...styles.section }}>
        <Container>
          <Grid2 container spacing={4}>
            {[
              { number: "10K+", label: "Active Drivers" },
              { number: "1M+", label: "Deliveries Completed" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <Grid2 item size={3} key={index} data-aos="zoom-in">
                <Box sx={styles.statCard}>
                  <Typography variant="h3">{stat.number}</Typography>
                  <Typography variant="h6">{stat.label}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      <Container sx={styles.section}>
        <Typography variant="h3" textAlign="center" gutterBottom data-aos="fade-up">
          What Our Partners Say
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 4 }}>
          {[
            {
              quote: "Being a delivery partner has transformed my career. The flexibility and earnings are incredible!",
              author: "John Smith",
              role: "Delivery Partner - 2 years"
            },
            {
              quote: "The platform is user-friendly and the support team is always there when needed.",
              author: "Sarah Johnson",
              role: "Delivery Partner - 1 year"
            },
          ].map((testimonial, index) => (
            <Grid2 item size={12} key={index} data-aos="fade-up">
              <Box sx={styles.testimonial}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {testimonial.quote}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {testimonial.author}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          py: 8,
        }}
      >
        <Container>
          <Grid2 container alignItems="center" spacing={4}>
            <Grid2 item xs={12} md={8} data-aos="fade-right">
              <Typography variant="h4" gutterBottom>
                Ready to Start Your Delivery Journey?
              </Typography>
              <Typography variant="h6">
                Join our growing community of delivery partners today.
              </Typography>
            </Grid2>
            {!localStorage.getItem('type') && (
            <Grid2 item xs={12} md={4} data-aos="fade-left">
              <Button 
                variant="contained" 
                size="large" 
                fullWidth
                sx={{ 
                  bgcolor: 'white', 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  }
                }}
                onClick={() => { navigate('/delivery/signup'); }}
              >
                Apply Now
              </Button>
            </Grid2>
            )}
          </Grid2>
        </Container>
      </Box>
    </BusinessNavBar>
  );
};

export default BusinessPage;