import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid2,
  Paper,
  Avatar,
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ShoppingCart, Security, SupportAgent, RocketLaunch } from "@mui/icons-material";
import Footer from "./components/Footer";

const About = () => {

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
      fontFamily: '"Lora", serif', // Default for body
      h3: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        color: 'white'
      },
      h4: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 500,
        color: 'white'
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
              background: "linear-gradient(135deg, rgba(80,90,250,0.4), rgba(100,120,255,0.2))",
              py: { xs: 5, md: 8 },
              px: 2,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: "100%",
              mx: "auto",
              mt: 4,
              mb: 4,
          }}
        >
          <Container>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              About GoPrime
            </Typography>
            <Typography variant="h6" color="text.secondary">
              A modern online marketplace built for Jordan, connecting buyers and sellers with AI-enhanced experience.
            </Typography>
          </Container>
        </Box>

        {/* Mission Section */}
        <Container sx={{ py: 6 }}>
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 item xs={12} md={6}>
              <img
                src="images/AI-2.jpg"
                alt="Mission"
                style={{ width: "100%", borderRadius: "16px" }}
              />
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Mission
              </Typography>
              <Typography color="text.secondary">
                GoPrime aims to revolutionize e-commerce in Jordan by empowering local sellers, streamlining the buying experience, and leveraging AI to make smarter decisions. Our platform was developed as a graduation project with a real-world vision.
              </Typography>
            </Grid2>
          </Grid2>
        </Container>

        {/* Technologies Section */}
        <Box
          sx={{
              background: "linear-gradient(135deg, rgba(80,90,250,0.4), rgba(100,120,255,0.2))",
              py: { xs: 5, md: 8 },
              px: 2,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: "100%",
              mx: "auto",
              mt: 4,
              mb: 4,
          }}
        >
          <Container>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Built with Modern Technologies
            </Typography>
            <Grid2 container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {["React", "Node.js", "PostgreSQL", "Material UI", "PayPal API", "JWT"].map((tech) => (
                <Grid2 item key={tech}>
                  <Chip label={tech} color="primary" variant="outlined" />
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Box>

        {/* Feature Highlights */}
        <Container sx={{ py: 6 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Features You’ll Love
          </Typography>
          <Grid2 container spacing={4} mt={2}>
            {[
              {
                icon: <ShoppingCart fontSize="large" />,
                title: "Multi-Seller Cart",
                desc: "Shop from multiple sellers in a single order with transparent delivery costs.",
              },
              {
                icon: <Security fontSize="large" />,
                title: "Secure Payments",
                desc: "Integrated with PayPal with smart commission splitting and card vaulting.",
              },
              {
                icon: <SupportAgent fontSize="large" />,
                title: "Delivery Personnel Panel",
                desc: "Delivery personnel can view, accept, and track orders they choose to deliver.",
              },
              {
                icon: <RocketLaunch fontSize="large" />,
                title: "Admin Dashboards",
                desc: "Robust admin features for managing sellers, buyers, deliveries, and analytics.",
              },
            ].map((f, i) => (
              <Grid2 item size = {{ xs : 12, sm : 6, md : 3 }} key={i}>
                <Paper elevation={3} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                  <Box mb={1}>{f.icon}</Box>
                  <Typography variant="h6">{f.title}</Typography>
                  <Typography color="text.secondary" mt={1}>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Container>

        {/* AI Usage Section */}
        <Box
          sx={{
              background: "linear-gradient(135deg, rgba(80,90,250,0.4), rgba(100,120,255,0.2))",
              py: { xs: 5, md: 8 },
              px: 2,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: "100%",
              mx: "auto",
              mt: 4,
              mb: 4,
          }}
        >
          <Container>
            <Typography variant="h4" textAlign="center" gutterBottom>
              AI at the Core
            </Typography>
            <Typography color="text.secondary" textAlign="center" maxWidth="md" mx="auto">
              GoPrime leverages a variety of AI tools including DeepSeek, LLM-powered chatbots for customer support, and TensorFlow models for automatic product categorization and content moderation.
            </Typography>
          </Container>
        </Box>

        {/* Team Section */}
        <Container sx={{ py: 6 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Meet our Team
          </Typography>
          <Grid2 container spacing={4} mt={3} textAlign={"center"}>
            <Grid2 item size={{ xs: 12, md: 3 }}>
              <Avatar
                alt="Developer"
                src="images/Richard_Qumsieh.jpg"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Typography variant="h6" mt={2}>Richard Qumsieh</Typography>
              <Typography color="text.secondary">Software Engineer & AI Enthusiast</Typography>
            </Grid2>
            <Grid2 item size={{ xs: 12, md: 3 }}>
              <Avatar
                alt="Developer"
                src="images/Hamzeh_Na3eem.jpeg"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Typography variant="h6" mt={2}>Hamzeh Na3eem</Typography>
              <Typography color="text.secondary">Sleep Engineer</Typography>
            </Grid2>
            <Grid2 item size={{ xs: 12, md: 3 }}>
              <Avatar
                alt="Developer"
                src="images/AlRahahleh.png"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Typography variant="h6" mt={2}>Mhmd Al-Rahahleh</Typography>
              <Typography color="text.secondary">Logic, Org and SP oriented</Typography>
            </Grid2>
            <Grid2 item size={{ xs: 12, md: 3 }}>
              <Avatar
                alt="Developer"
                src="images/AlNajjar.png"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Typography variant="h6" mt={2}>Mhmd Al-Najjar</Typography>
              <Typography color="text.secondary">Back Pain Specialist</Typography>
            </Grid2>
          </Grid2>
        </Container>

        {/* Vision */}
        <Box
          sx={{
              background: "linear-gradient(135deg, rgba(80,90,250,0.4), rgba(100,120,255,0.2))",
              py: { xs: 5, md: 8 },
              px: 2,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: "100%",
              mx: "auto",
              mt: 4,
              mb: 4,
          }}
        >
          <Container>
            <Typography variant="h4" textAlign="center" gutterBottom>
              What’s Next?
            </Typography>
            <Typography textAlign="center" maxWidth="md" mx="auto" color="text.secondary">
              Although GoPrime was built as a graduation project, it’s designed with scale in mind.
              Future plans include mobile apps, recommendation systems, advanced analytics, and full business deployment across Jordan and the Middle East.
            </Typography>
          </Container>
        </Box>
      </Box>

      <Footer />
    </ThemeProvider>
  );
};

export default About;