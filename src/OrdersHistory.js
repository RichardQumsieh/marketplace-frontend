import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CardMedia, CircularProgress, Container, createTheme, Divider, Drawer, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import axios from "axios";

export default function OrdersHistory() {
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        display: { xs: 'none', sm: 'block' },
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
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, minHeight: '53vh' }}>
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
                                    <TableContainer sx={{ mt: -2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell align="center">Quantity</TableCell>
                                                    <TableCell align="center">Price (JOD)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.items?.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <CardMedia
                                                                component="img"
                                                                height="80"
                                                                sx={{
                                                                    my: 1,
                                                                    px: 1,
                                                                    objectFit: 'contain',
                                                                    borderRadius: 2,
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                }}
                                                                image={`data:image/jpeg;base64,${item.image}`}
                                                                alt={item.product}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{item.product}</TableCell>
                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            {Number(item.price / 1.3701710).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            mt: 3,
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
                                        color="primary"
                                        sx={{ mt: 2, width: '100%' }}
                                        onClick={() => alert(`Reordering Order #${order.id}`)}
                                    >
                                        Reorder
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
            <Footer />
        </ThemeProvider>
    );
}