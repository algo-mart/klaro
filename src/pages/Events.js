import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import apiService from "../services/api";
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null); 
  const [editData, setEditData] = useState({
    eventType: "",
    date: "",
    venue: "",
    category: "",
  });
  const navigate = useNavigate();

  const handleMenuOpen = (event, eventData) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    if (selectedEvent) {
      setEditingEventId(selectedEvent.eventId); 
      setEditData({
        eventType: selectedEvent.eventType,
        date: selectedEvent.date,
        venue: selectedEvent.venue,
        category: selectedEvent.category,
      });
      setEditModalOpen(true);
    }
    handleMenuClose();
  };
  const handleDelete = async () => {
    try {
      if (!selectedEvent?.eventId) return;

      const response = await fetch(
        `https://kibou-registry-1.onrender.com/api/events/${selectedEvent.eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Refresh the events list
      const updatedEvents = await apiService.events.getAll(user?.token);
      setEvents(updatedEvents);
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
    handleMenuClose();
  };

  const handleRecordAttendance = () => {
    navigate('/attendance', { 
        state: { 
            eventId: selectedEvent.eventId, 
            venue: selectedEvent.venue, 
            eventType: selectedEvent.eventType 
        } 
    });
  };
  const [formData, setFormData] = useState({
    eventType: "REGULAR",
    date: "",
    venue: "",
    category: "MEMBER",
  });

  const handleOpenModal = () => {
    setOpenModal(true);
    setCreateError(null);
    setFormData({
      eventType: "REGULAR",
      date: "",
      venue: "",
      category: "MEMBER",
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCreateError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      console.log("[DEBUG] Starting edit save...", editingEventId);
      if (!editingEventId) {
        console.log("[DEBUG] No event ID found:", editingEventId);
        return;
      }

      const payload = {
        date: editData.date,
        eventType: editData.eventType,
        venue: editData.venue,
        category: editData.category,
      };

      console.log("[DEBUG] Sending payload:", payload);
      console.log(
        "[DEBUG] To URL:",
        `https://kibou-registry-1.onrender.com/api/events/${editingEventId}`
      );

      const response = await fetch(
        `https://kibou-registry-1.onrender.com/api/events/${editingEventId}`,
        {
          method: "PUT",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("[DEBUG] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("[DEBUG] Error data:", errorData);
        throw new Error(
          errorData?.message || `Failed to update event: ${response.statusText}`
        );
      }

      const responseData = await response.json().catch(() => null);
      console.log("[DEBUG] Success response:", responseData);

      // Refresh the events list
      const updatedEvents = await apiService.events.getAll(user?.token);
      setEvents(updatedEvents);
      setEditModalOpen(false);
      setEditingEventId(null); // Clear the editing ID when done
    } catch (err) {
      console.error("[DEBUG] Error updating event:", err);
      setError(err.message || "Failed to update event");
    }
  };

  const handleCreateEvent = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      if (!formData.eventType || !formData.date || !formData.venue) {
        throw new Error("Please fill in all required fields");
      }

      const payload = {
        date: formData.date,
        eventType: formData.eventType,
        venue: formData.venue,
        category: formData.category,
      };

      console.log("[DEBUG] Creating event:", payload);

      const response = await fetch(
        "https://kibou-registry-1.onrender.com/api/events",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to create event: ${response.statusText}`
        );
      }

      // Refresh events list
      const updatedEvents = await apiService.events.getAll(user?.token);
      setEvents(updatedEvents);

      handleCloseModal();
    } catch (err) {
      console.error("[DEBUG] Error creating event:", err);
      setCreateError(err.message || "Failed to create event");
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");
        const data = await apiService.events.getAll(user?.token);
        console.log("Events received:", data);

        if (Array.isArray(data)) {
          setEvents(data);
          setError(null);
        } else {
          setError("Unexpected response format from the server.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(
          err.message || "Could not fetch events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.token]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
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

  return (
    <Box m={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* <Typography variant="h4">Events</Typography> */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Create Event
        </Button>
      </Box>

      {events.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1a2233" }}>
                <TableCell sx={{ color: "white" }}>S/N</TableCell>
                <TableCell sx={{ color: "white" }}>Date</TableCell>
                <TableCell sx={{ color: "white" }}>Type</TableCell>
                <TableCell sx={{ color: "white" }}>Venue</TableCell>
                <TableCell sx={{ color: "white" }}>Category</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((event, index) => (
                  <TableRow key={event.eventId || event.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{event.eventType || "N/A"}</TableCell>
                    <TableCell>{event.venue || "N/A"}</TableCell>
                    <TableCell>{event.category || "-"}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, event)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Event Type"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="REGULAR">Regular</MenuItem>
                <MenuItem value="SPECIAL">Special</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="MEMBER">Member</MenuItem>
                <MenuItem value="INTERN">Intern</MenuItem>
                <MenuItem value="SENIOR_STAFF">Senior Staff</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={handleCreateEvent}
            variant="contained"
            color="primary"
            disabled={createLoading}
          >
            {createLoading ? "Creating..." : "Create Event"}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit event</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete event</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRecordAttendance}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Record attendance</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit-event-dialog-title"
        disableEnforceFocus 
        keepMounted 
      >
        <DialogTitle id="edit-event-dialog-title">Edit Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Event Type"
                name="eventType"
                value={editData.eventType}
                onChange={(e) =>
                  setEditData({ ...editData, eventType: e.target.value })
                }
                required
              >
                <MenuItem value="REGULAR">Regular</MenuItem>
                <MenuItem value="SPECIAL">Special</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Date"
                name="date"
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={editData.venue}
                onChange={(e) =>
                  setEditData({ ...editData, venue: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                required
              >
                <MenuItem value="MEMBER">Member</MenuItem>
                <MenuItem value="INTERN">Intern</MenuItem>
                <MenuItem value="SENIOR_STAFF">Senior Staff</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log("[DEBUG] Save button clicked");
              handleSaveEdit();
            }}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
