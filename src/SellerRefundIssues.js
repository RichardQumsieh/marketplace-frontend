import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Container,
  Grid2,
  Button,
} from "@mui/material";
import SellerNav from "./components/SellerNav";
import Footer from "./components/Footer";
import { AddTask } from "@mui/icons-material";

const SellerRefundIssues = () => {
  const [refundIssues, setRefundIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefundIssues = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming JWT is stored in localStorage
        const response = await axios.get("http://localhost:5000/api/refund-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRefundIssues(response.data);
      } catch (err) {
        setError("Failed to fetch refund issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRefundIssues();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <SellerNav>
        <Box p={3} minHeight={'60vh'}>
        {refundIssues.length === 0 ? (
            <Container maxWidth='sm'>
                <Grid2 container justifyContent="center" alignItems="center" mt={3} spacing={3}>
                    <Grid2 item size= {{ xs: 12, sm: 6 }} textAlign={{ xs: 'center', sm: 'right' }}>
                        <AddTask sx={{ fontSize: {xs: '150px', sm: "18vw"}, opacity: 0.3 }}/>
                    </Grid2>
                    <Grid2 item size= {{ xs: 12, sm: 6 }} textAlign={{ xs: 'center', sm: 'left' }}>
                        <Typography variant="h6" color="text.secondary">
                            No refund issues found for your products.
                        </Typography>
                    </Grid2>
                </Grid2>
            </Container>
        ) : (
            <>
                <Typography variant="h6" gutterBottom>
                    Refund Issues
                </Typography>
                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell><strong>Refund ID</strong></TableCell>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell><strong>Buyer ID</strong></TableCell>
                        <TableCell><strong>Reason</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Created At</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {refundIssues.map((issue) => (
                        <TableRow key={issue.refund_id}>
                        <TableCell>{issue.refund_id}</TableCell>
                        <TableCell>{issue.order_id}</TableCell>
                        <TableCell>{issue.buyer_id}</TableCell>
                        <TableCell>{issue.reason}</TableCell>
                        <TableCell>{issue.details}</TableCell>
                        <TableCell>{issue.status}</TableCell>
                        <TableCell>
                            {new Date(issue.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                            color="primary"
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  const token = localStorage.getItem("authToken");
                                  await axios.post(
                                    `http://localhost:5000/api/refund-requests/${issue.refund_id}/approve`,
                                    {},
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  setRefundIssues((prev) =>
                                    prev.filter((i) => i.refund_id !== issue.refund_id)
                                  );
                                } catch (err) {
                                  setError("Failed to approve refund.");
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            >
                              Refund
                            </Button>
                            <Button
                            color="error"
                              onClick={async () => {
                                const reason = window.prompt("Enter rejection reason:");
                                if (!reason) return;
                                try {
                                  setLoading(true);
                                  const token = localStorage.getItem("authToken");
                                  await axios.post(
                                    `http://localhost:5000/api/refund-requests/${issue.refund_id}/reject`,
                                    { reason },
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  setRefundIssues((prev) =>
                                    prev.filter((i) => i.refund_id !== issue.refund_id)
                                  );
                                } catch (err) {
                                  setError("Failed to reject refund.");
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </>
        )}
        </Box>
        <Footer />
    </SellerNav>
  );
};

export default SellerRefundIssues;