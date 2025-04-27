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
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { motion } from "framer-motion";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import BusinessNavBar from "./components/BusinessNavBar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

const styles = {
  hero: {
    height: '80vh',
    background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("images/delivery-hero.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    position: 'relative', // Add position for SVG placement
  },
  heroSvg: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 'auto',
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
    background: 'rgba(70,70,70,0.6)',
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

    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#1976d2', // A more professional blue
        },
        background: {
          default: '#121212', // Dark background
          paper: '#1e1e1e', // Slightly lighter for cards and papers
        },
        text: {
          primary: '#ffffff', // White text
          secondary: '#b3b3b3', // Light grey for secondary text
        },
      },
      typography: {
        allVariants: {
          fontFamily: '"Lora", serif', // Default for body
        },
        h3: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: 'white'
        },
        h5: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 500,
          color: 'white'
        },
      },
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        {/* Add SVG at the bottom of the hero section */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={styles.heroSvg}
        >
          <path
            fill="#1976d2"
            fillOpacity="0.2"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,213.3C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ ...styles.section }}>
        <Container>
          <Grid2 container spacing={4}>
            {[
              { number: "10K+", label: "Active Drivers", svg: "/images/driver-icon.svg" },
              { number: "1M+", label: "Deliveries Completed", svg: "/images/delivery-icon.svg" },
              { number: "98%", label: "Satisfaction Rate", svg: "/images/satisfaction-icon.svg" },
              { number: "24/7", label: "Customer Support", svg: "/images/support-icon.svg" },
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
                  color: theme.palette.primary.main,
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
      <Footer />
    </ThemeProvider>
  );
};

export default BusinessPage;