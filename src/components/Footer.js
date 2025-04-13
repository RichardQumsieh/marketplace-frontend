import React from "react";
import {
  Box,
  Grid2,
  Typography,
  Link,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ShoppingCart,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#1a1a1a", color: "#fff", mt: 2, pt: 3, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* GoPrime Intro */}
          <Grid2 item size = {{ xs: 12, sm: 6 , md: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <ShoppingCart sx={{ mr: 1 }} />
              GoPrime
            </Typography>
            <Typography variant="body2">
              A powerful Jordanian marketplace connecting buyers with top sellers across all categories. Fast, secure, and AI-powered.
            </Typography>
          </Grid2>

          {/* Quick Links */}
          <Grid2 item size = {{ xs: 12, sm: 6 , md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/about" color="inherit" underline="hover" display="block">About Us</Link>
              <Link href="/business" color="inherit" underline="hover" display="block">Business</Link>
              <Link href="/contact" color="inherit" underline="hover" display="block">Contact</Link>
              <Link href="/privacy-policy" color="inherit" underline="hover" display="block">Privacy Policy</Link>
            </Box>
          </Grid2>

          {/* Contact Info */}
          <Grid2 item size = {{ xs: 12, sm: 6 , md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">📧 support@goprime.jo</Typography>
            <Typography variant="body2">📞 +962-79-123-4567</Typography>
            <Typography variant="body2">📍 Amman, Jordan</Typography>
          </Grid2>

          {/* Social Media */}
          <Grid2 item size = {{ xs: 12, sm: 6 , md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton href="https://facebook.com" target="_blank" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" color="inherit">
                <Twitter />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank" color="inherit">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid2>
        </Grid2>

        <Divider sx={{ my: 4, backgroundColor: "#444" }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} GoPrime. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;