import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "",
    transactionId: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // Navigate back to dashboard after submission
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f5f7fa",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "24px",
            color: "#1a2233",
            fontWeight: 600,
          }}
        >
          Record Payment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  <MenuItem value="S">Regular</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="amountPaid"
                label="Amount Paid"
                type="number"
                value={formData.amountPaid}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: "₦",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="paymentDate"
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="transfer">Bank Transfer</MenuItem>
                  <MenuItem value="pos">POS</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="transactionId"
                label="Transaction ID"
                value={formData.transactionId}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "16px" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3b82f6",
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                }}
              >
                Record Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Payment;
