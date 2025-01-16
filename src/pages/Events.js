import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "/api/events?searchPhrase=&pageSize=10&pageNumber=0&eventType=REGULAR",
          headers: {},
        };

        const response = await axios.request(config);
        console.log("API Response:", response.data);

        // Extract events from the content array
        const eventsData = response.data.content || [];
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <Box sx={{ p: 3, minHeight: "calc(100vh - 100px)" }}>
        <Typography>Loading events...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3, minHeight: "calc(100vh - 100px)" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );

  if (!events.length) {
    return (
      <Box sx={{ p: 3, minHeight: "calc(100vh - 100px)" }}>
        <Typography>No events found</Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date not available";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Date not available";
    }
  };

  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
        minHeight: "calc(100vh - 100px)", // Subtract header/navigation height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}></Typography>
      <TableContainer
        component={Paper}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="events table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3b82f6" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Event ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Event Type
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Event Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Event Venue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.eventId}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f8fafc" } }}
              >
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.eventType}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>{event.venue || "TBA"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Events;
