import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CardMedia, CircularProgress, Container, createTheme, Divider, Drawer, Grid2, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import RefundForm from "./components/RefundForm"; // Import RefundForm
import axios from "axios";
import RefundSuccessAnimation from "./components/RefundSuccessAnimation";

export default function OrdersHistory() {
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refundDrawerOpen, setRefundDrawerOpen] = useState(false); // State to control RefundForm visibility
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order
    const [showSuccess, setShowSuccess] = useState(false);
    
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/order-history", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                const { data } = await axios.get("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setHistory(response.data);
                setCart(data);
            } catch (error) {
                console.error("Error fetching order history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9',
            },
            background: {
                default: '#121212',
                paper: 'rgba(30, 30, 30, 0.9)',
            },
        },
        typography: {
            allVariants: {
                fontFamily: '"Lora", serif',
            },
            h4: {
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
            },
            h6: {
                fontFamily: '"Playfair Display", serif',
                fontWeight: 500,
            },
        },
    });

    const handleRefundSuccess = () => {
        setRefundDrawerOpen(false); // Close the RefundForm after successful submission
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            {cart[0] && (
                <Drawer
                    variant="persistent"
                    anchor="right"
                    open={true}
                    sx={{
                        display: { xs: 'none', lg: 'block' },
                        width: 150,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 150,
                            mt: 8.2,
                            backgroundColor: 'rgba(30, 30, 30, 0.6)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }
                    }}>
                        {cart.map((item) => (
                            <>
                                <CardMedia component={"img"}
                                    key={item.id}
                                    image={`data:image/jpeg;base64,${item.image}`}
                                    alt={item.product_name}
                                    sx={{
                                        height: 80,
                                        my: 1,
                                        px: 1,
                                        objectFit: 'contain',
                                    }}
                                />
                                <Typography key={item.id} variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
                                    ({item.quantity}) - {Number(item.price / 1.3701710).toFixed(2)} JOD
                                </Typography>
                            </>
                        ))}
                        <Divider />
                        <Link href="/cart" variant="body2" color="warning" underline="hover" sx={{ display: 'block', textAlign: 'center', my: 1 }}>
                            View Cart
                        </Link>
                        <Divider />
                        <Link href="/checkout" variant="body2" color="warning" underline="hover" sx={{ display: 'block', textAlign: 'center', my: 1 }}>
                            Checkout
                        </Link>
                </Drawer>
            )}
            <Container maxWidth="md" sx={{ mt: 5, mb: 5, minHeight: '53vh' }}>
                {history.length > 0 ? (
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                            Your Order History
                        </Typography>
                        {history.map((order) => (
                            <Accordion key={order.id} sx={{ mb: 3, backgroundColor: 'rgba(40, 40, 40, 0.95)' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        borderRadius: '4px',
                                        '&:hover': { backgroundColor: 'rgba(60, 60, 60, 0.9)' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Order #{order.id}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(order.order_date).toLocaleDateString()} | {order.status}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {order.items?.map((item, index) => (
                                        <Grid2 container key={index}>
                                            <Grid2 item size={{ xs: 12, sm: 2 }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        objectFit: 'contain',
                                                    }}
                                                    image={`data:image/jpeg;base64,${item.image}`}
                                                    alt={item.product}
                                                />
                                            </Grid2>
                                            <Grid2 item size={{ xs: 12, sm: 10 }} sx={{ pl: 2 }}>
                                                <Typography variant="body1" sx={{ mt: { xs: 1, sm: 0 } }}>{item.product}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                                                    Quantity: {item.quantity}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Price: {Number(item.price / 1.3701710).toFixed(2)} JOD
                                                </Typography>
                                            </Grid2>
                                        </Grid2>
                                    ))}
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            +6.5% (Service Fee)
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Total: {Number(order.total_amount).toFixed(2)} JOD
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ mt: 2, width: '100%' }}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setRefundDrawerOpen(true);
                                        }}
                                    >
                                        Issue Refund
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="h6" color="text.secondary" textAlign="center" mt={5}>
                        No order history available.
                    </Typography>
                )}
            </Container>
            {refundDrawerOpen && (
                <RefundForm
                    order={selectedOrder}
                    isOpen={refundDrawerOpen}
                    onClose={() => setRefundDrawerOpen(false)}
                    onSuccess={handleRefundSuccess}
                />
            )}
            <RefundSuccessAnimation 
                isVisible={showSuccess} 
                onClose={() => setShowSuccess(false)} 
            />
            <Footer />
        </ThemeProvider>
    );
}