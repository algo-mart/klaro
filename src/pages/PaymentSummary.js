import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";

const PaymentSummary = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentById = async (id) => {
      try {
        const response = await fetch(
          `https://kibou-registry-1.onrender.com/api/payments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Failed to fetch payment ${id}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error(`Error fetching payment ${id}:`, err);
        return null;
      }
    };

    const fetchAllPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        let id = 1;
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3; // Stop after 3 consecutive missing IDs
        const allPayments = [];

        // Keep fetching until we hit too many consecutive missing payments
        while (consecutiveFailures < maxConsecutiveFailures) {
          const payment = await fetchPaymentById(id);
          
          if (payment) {
            console.log(`Found payment ${id}:`, payment);
            allPayments.push(payment);
            consecutiveFailures = 0; // Reset counter on success
          } else {
            console.log(`No payment found for ID ${id}`);
            consecutiveFailures++;
          }
          
          id++;
        }

        // Sort payments by ID
        const sortedPayments = allPayments.sort((a, b) => a.id - b.id);
        console.log("All payments found:", sortedPayments);
        setPayments(sortedPayments);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to fetch payments");
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchAllPayments();
    }
  }, [user?.token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "24px",
          color: "#1a2233",
          fontWeight: 600,
        }}
      >
        Payment Summary
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#1a2233",
                }}
              >
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Payment ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Event Type</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Participant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{formatAmount(payment.totalAmount)}</TableCell>
                  <TableCell>
                    {payment.eventType?.replace("_", " ").toLowerCase() || "N/A"}
                  </TableCell>
                  <TableCell>{payment.participantName || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PaymentSummary;
