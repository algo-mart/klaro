// Enhanced Payment Component with Improved Styling
import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    totalAmount: "",
    event: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(null); // Success state

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit payment form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("/api/payments", formData);

      if (response.status === 201) {
        console.log("API Response:", response.data); // Log success data
        setSuccessMessage("Payment recorded successfully!");
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        console.log("Unexpected response status:", response.status); // Log unexpected response
        setError(`Unexpected response: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        console.error(
          `Server Error ${err.response.status}:`,
          err.response.data.message || "Unknown error"
        );
        setError(
          `Server responded with status ${err.response.status}: ${
            err.response.data.message || "Unknown error"
          }`
        );
      } else if (err.request) {
        console.error("No response from server:", err.request);
        setError("No response from the server. Please check your connection.");
      } else {
        console.error("Error during request:", err.message);
        setError(`Request error: ${err.message}`);
      }
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
          sx={{
            marginBottom: "24px",
            color: "#2c3e50",
            fontWeight: 700,
          }}
        >
          Payment Form
        </Typography>

        {/* Success Message */}
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
            <Typography variant="body2" color="textSecondary">
              Redirecting to dashboard in 3 seconds...
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Typography
            variant="h6"
            color="error"
            sx={{ marginBottom: "16px", textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="id"
                label="Transaction ID"
                value={formData.id}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
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
                InputProps={{
                  startAdornment: <span>₦</span>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
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
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
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
