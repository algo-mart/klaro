import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Typography, Box, Paper } from "@mui/material";

const Payment = () => {
  const [formData, setFormData] = useState({
    participantId: "",
    date: "",
    totalAmount: "",
    event: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit payment form using axios
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setPaymentDetails(null);

    // Validate and format date
    const dateObj = new Date(formData.date);
    if (isNaN(dateObj.getTime())) {
      setError("Invalid date provided.");
      setLoading(false);
      return;
    }
    const isoDate = dateObj.toISOString();

    // Prepare payload
    const payload = {
      date: isoDate, // Convert to ISO string
      totalAmount: Number(formData.totalAmount),
      participantId: Number(formData.participantId),
      event: Number(formData.event),
    };

    console.log("Sending Payload:", payload);

    try {
      const response = await axios.post(
        "https://kibou-registry-1.onrender.com/api/payments",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          maxBodyLength: Infinity,
        },
      );

      console.log("API Response:", response.data);
      setSuccessMessage("Payment recorded successfully!");
      setPaymentDetails(response.data);

      // Clear the form after success
      setFormData({
        participantId: "",
        date: "",
        totalAmount: "",
        event: "",
      });
    } catch (err) {
      console.error("API Request Failed:", err);
      const errorMsg =
        (err.response && err.response.data && err.response.data.error) ||
        `Request error: ${err.message}`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: "16px", sm: "32px" },
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: "24px", color: "#2c3e50", fontWeight: 700 }}
        >
          Payment Form
        </Typography>

        {/* Display Success Message and Payment Details if available */}
        {successMessage && (
          <Box
            sx={{
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: "#e6fffa",
              border: "1px solid #3b82f6",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="primary">
              {successMessage}
            </Typography>
            {paymentDetails && (
              <Box mt={2} textAlign="left">
                <Typography variant="body1">
                  <strong>Payment ID:</strong> {paymentDetails.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {paymentDetails.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Amount:</strong> ₦{paymentDetails.totalAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Participant:</strong> {paymentDetails.participantName}
                </Typography>
                <Typography variant="body1">
                  <strong>Event Type:</strong> {paymentDetails.eventType}
                </Typography>
                <Typography variant="body1">
                  <strong>Event ID:</strong> {paymentDetails.event}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Display Error Message */}
        {error && (
          <Typography
            variant="h6"
            color="error"
            sx={{ marginBottom: "16px", textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="participantId"
                label="Participant ID"
                type="number"
                value={formData.participantId}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="date"
                label="Payment Date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="totalAmount"
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
                onChange={handleChange}
                required
                InputProps={{ startAdornment: <span>₦</span> }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="event"
                label="Event ID"
                type="number"
                value={formData.event}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  padding: "12px",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
                  "&:hover": { backgroundColor: "#2563eb" },
                }}
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Payment;
