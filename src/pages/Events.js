import React, { useState, useEffect } from "react";
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
import apiService from "../services/api"; // Ensure correct import

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");

        // Assuming authentication is needed (update as per your setup)
        const token = localStorage.getItem("authToken") || ""; 
        const data = await apiService.events.getAll(token);

        console.log("Events received:", data);

        if (Array.isArray(data)) {
          setEvents(data);
          setError(null);
        } else {
          setError("Unexpected response format from the server.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Could not fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box m={3}>
        <Alert severity="info">No events found.</Alert>
      </Box>
    );
  }

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.eventId || event.id}>
                <TableCell>{event.eventId || event.id}</TableCell>
                <TableCell>
                  {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>{event.eventType || "N/A"}</TableCell>
                <TableCell>{event.venue || "N/A"}</TableCell>
                <TableCell>{event.category || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Events;
