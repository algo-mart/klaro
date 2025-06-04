import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
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

const Addparticipants = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!isAuthenticated()) {
        throw new Error('You are not authenticated. Please log in again.');
      }

      if (!user?.token) {
        throw new Error('Authentication token is missing');
      }

      const payload = {
        name: formData.name,
        category: formData.category.toUpperCase(),
        contact_info: {
          email: formData.email.toLowerCase(),
          phone: formData.phoneNumber,
          address: formData.address
        }
      };

      console.log('[DEBUG] Sending payload:', JSON.stringify(payload, null, 2));
      console.log('[DEBUG] Auth token present:', !!user?.token);

      const response = await axios.post(
        'https://kibou-registry-1.onrender.com/api/users',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      console.log('[DEBUG] Create successful:', response.data);
      
      setSuccess("User added successfully!");
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "MEMBER",
      });
      
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch (err) {
      console.error('[DEBUG] Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message
      });

      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to add user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "70vh", p: 3 }}>
      {/* <Typography variant="h4" gutterBottom>
        Add New User
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

      <Paper sx={{ 
        p: 3, 
        maxWidth: 400, 
        mx: 'auto',
        bgcolor: '#1a2233',
        color: 'white',
        '& .MuiInputLabel-root': {
          color: 'white'
          
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)'
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)'
          }
        },
        '& .MuiInputBase-input': {
          color: 'white'
        },
        '& .MuiFormControlLabel-label': {
          color: 'white'
        },
        '& .MuiRadio-root': {
          color: 'white'
        }
      }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Category
              </Typography>
              <RadioGroup
                row
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="MEMBER"
                  control={<Radio />}
                  label="Member"
                />
                <FormControlLabel
                  value="INTERN"
                  control={<Radio />}
                  label="Intern"
                />
                <FormControlLabel
                  value="SENIOR_STAFF"
                  control={<Radio />}
                  label="Senior Staff"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: 'white',
                  color: '#1a2233',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                {loading ? "Adding..." : "Add User"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Addparticipants;
