import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    totalAmount: "",
    event: "",
    userId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch events
        const eventsResponse = await fetch("https://kibou-registry-1.onrender.com/api/events/", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const eventsData = await eventsResponse.json();

        // Fetch users from all categories
        const categories = ['MEMBER', 'INTERN', 'SENIOR_STAFF'];
        let allUsers = [];

        for (const category of categories) {
          const usersResponse = await fetch(
            `https://kibou-registry-1.onrender.com/api/users?pageSize=100&pageNumber=0&category=${category}`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );
          const usersData = await usersResponse.json();
          
          // Process the paginated users data for this category
          const categoryUsers = usersData?.content?.map(user => ({
            id: user.userId,
            firstName: user.name,
            category: category
          })) || [];
          
          allUsers = [...allUsers, ...categoryUsers];
        }

        // Sort users by name
        allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));

        // Ensure we have arrays and handle the response structure
        setEvents(Array.isArray(eventsData) ? eventsData : eventsData.data || []);
        setUsers(allUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        date: formData.date,
        totalAmount: Number(formData.totalAmount),
        event: Number(formData.event),
        userId: Number(formData.userId)
      };
      
      console.log('Submitting payment data:', paymentData);

      const response = await fetch("https://kibou-registry-1.onrender.com/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
          "accept": "*/*"
        },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error("Failed to record payment");
      }

      console.log('Payment recorded successfully:', responseData);
      setSuccess("Payment recorded successfully");
      setFormData({
        date: new Date().toISOString(),
        totalAmount: "",
        event: "",
        userId: ""
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error recording payment:", err);
      setError("Failed to record payment. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
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
                fullWidth
                name="date"
                label="Payment Date"
                type="datetime-local"
                value={formData.date.slice(0, 16)}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true
                }}
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
                name="totalAmount"
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
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
                <InputLabel>Event</InputLabel>
                <Select
                  name="event"
                  value={formData.event}
                  label="Event"
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  {Array.isArray(events) && events.map((event) => (
                    <MenuItem key={event.eventId} value={event.eventId}>
                      Event {event.eventId} - {event.venue} ({new Date(event.date).toLocaleDateString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>User</InputLabel>
                <Select
                  name="userId"
                  value={formData.userId}
                  label="User"
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  {Array.isArray(users) && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} ({user.category.replace('_', ' ').toLowerCase()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Payment;
