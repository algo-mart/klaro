import React, { useState } from "react";
import {
  TextField,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const Addparticipants = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    category: "MEMBER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }

    // Validate phone number format (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let participantData = {
        name: formData.name,
        category: formData.category,
        contact_info: {
          email: formData.email.toLowerCase(),
          phone: formData.phoneNumber,
          address: formData.address,
        },
      };

      await apiService.participants.create(participantData);

      setSuccess("User added successfully!");
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "MEMBER",
      });

      // Navigate to the users page after successful submission
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to Ceate user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        p: 3,
        minHeight: "calc(80vh)", // Subtract header/navigation height
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          mx: "auto",
        }}
      >
        {/* <Typography variant="h5" component="h1" gutterBottom>
          Create New User
        </Typography> */}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(error && error.includes("Name"))}
                helperText={error && error.includes("Name") ? error : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={Boolean(error && error.includes("phone"))}
                helperText={
                  error && error.includes("phone")
                    ? error
                    : "Enter at least 10 digits"
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(error && error.includes("email"))}
                helperText={
                  error && error.includes("email")
                    ? error
                    : "e.g., name@example.com"
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Category
              </Typography>
              <RadioGroup
                name="category"
                value={formData.category}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="MEMBER"
                  control={<Radio />}
                  label="Member"
                />
                <FormControlLabel
                  value="SENIOR_STAFF"
                  control={<Radio />}
                  label="Senior Staff"
                />
                <FormControlLabel
                  value="INTERN"
                  control={<Radio />}
                  label="Intern"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Addparticipants;
