import { Box, Typography, Container, ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import Footer from "./components/Footer";

const PrivacyPolicy = () => {

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
        <Container sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
            Privacy Policy
        </Typography>

        <Typography variant="body1">
            Welcome to GoPrime. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our marketplace platform.
        </Typography>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            1. Information We Collect
            </Typography>
            <Typography variant="body1">
            We collect the following types of information:
            </Typography>
            <ul>
            <li><strong>Account Details:</strong> Name, email, phone number, shipping and billing addresses.</li>
            <li><strong>Seller Information:</strong> Store name, description, banking and PayPal details.</li>
            <li><strong>Usage Data:</strong> Pages visited, actions on the platform, and other analytics.</li>
            <li><strong>Payment Info:</strong> Processed securely through third-party providers like PayPal.</li>
            </ul>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            2. How We Use Your Information
            </Typography>
            <Typography variant="body1">
            We use your data to:
            </Typography>
            <ul>
            <li>Process transactions and deliver products.</li>
            <li>Improve our services and customer experience.</li>
            <li>Send order updates and promotional content (only with your consent).</li>
            <li>Ensure the platform's safety and prevent fraud.</li>
            </ul>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            3. Data Sharing
            </Typography>
            <Typography variant="body1">
            We only share your information with:
            </Typography>
            <ul>
            <li>Payment providers (e.g., PayPal).</li>
            <li>Delivery personnel, to fulfill your orders.</li>
            <li>Legal authorities, if required by law.</li>
            </ul>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            4. Your Rights
            </Typography>
            <Typography variant="body1">
            You have the right to:
            </Typography>
            <ul>
            <li>Access or update your personal data.</li>
            <li>Request deletion of your account.</li>
            <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            5. Data Security
            </Typography>
            <Typography variant="body1">
            We use encryption, secure servers, and regular audits to protect your data. However, no method of online transmission is 100% secure.
            </Typography>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            6. Changes to This Policy
            </Typography>
            <Typography variant="body1">
            We may update this Privacy Policy from time to time. We will notify users about major changes by email or through our website.
            </Typography>
        </Box>

        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
            7. Contact Us
            </Typography>
            <Typography variant="body1">
            If you have any questions or concerns about this Privacy Policy, feel free to contact us at: <strong>support@goprime.com</strong>
            </Typography>
        </Box>

        </Container>
        <Footer />
    </ThemeProvider>
  );
};

export default PrivacyPolicy;