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
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
        const eventsArray = Array.isArray(eventsData) ? eventsData : eventsData.data || [];
        
        // Sort events in descending order by date
        const sortedEvents = [...eventsArray].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setEvents(sortedEvents);
        setAllUsers(allUsers);
        setFilteredUsers(allUsers);
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

  // Simple function to handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // If event is selected, fetch participants and filter users
    if (name === 'event' && value) {
      fetchEventParticipants(value);
    }
  };
  
  // Function to fetch participants for an event
  const fetchEventParticipants = async (eventId) => {
    try {
      setLoading(true);
      eventId = Number(eventId);
      
      // Fetch the event details directly
      const response = await fetch(
        `https://kibou-registry-1.onrender.com/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch event details: ${response.status}`);
      }
      
      const eventData = await response.json();
      
      // Check for participants in different possible locations in the response
      let participants = [];
      
      if (eventData.participants && Array.isArray(eventData.participants)) {
        participants = eventData.participants;
      } else if (eventData.users && Array.isArray(eventData.users)) {
        participants = eventData.users;
      } else if (eventData.attendees && Array.isArray(eventData.attendees)) {
        participants = eventData.attendees;
      } else {
        // Try to find any array in the response that might contain users
        for (const key in eventData) {
          if (Array.isArray(eventData[key]) && eventData[key].length > 0) {
            const firstItem = eventData[key][0];
            if (firstItem && (firstItem.userId || firstItem.user || firstItem.id)) {
              participants = eventData[key];
              break;
            }
          }
        }
      }
      
      if (participants.length > 0) {
        // Extract user IDs from participants
        const participantIds = [];
        
        for (const p of participants) {
          let userId = null;
          if (p.userId !== undefined) {
            userId = Number(p.userId);
          } else if (p.user && p.user.userId !== undefined) {
            userId = Number(p.user.userId);
          } else if (p.id !== undefined) {
            userId = Number(p.id);
          } else if (typeof p === 'number') {
            userId = p;
          }
          
          if (userId !== null) {
            participantIds.push(userId);
          }
        }
        
        if (participantIds.length > 0) {
          // Filter users who participated in the selected event
          const eventUsers = allUsers.filter(user => {
            const userId = Number(user.id);
            return participantIds.includes(userId);
          });
          
          if (eventUsers.length > 0) {
            setFilteredUsers(eventUsers);
          } else {
            setFilteredUsers(allUsers);
          }
        } else {
          setFilteredUsers(allUsers);
        }
      } else {
        setFilteredUsers(allUsers);
      }
      
      // Reset user selection
      setFormData(prev => ({ ...prev, userId: '' }));
    } catch (error) {
      console.error('Error fetching event details:', error);
      setFilteredUsers(allUsers);
    } finally {
      setLoading(false);
    }
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
        minHeight: "70vh",
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
                  {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
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
                  backgroundColor: "#1a2233",
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#3b82f6",
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
