import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import apiService from "../services/api";

const Attendance = () => {
  const [participants, setParticipants] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.participants.getAll();
      setParticipants(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError(
        "Failed to fetch participants: " + (err.message || "Unknown error"),
      );
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceByDate = async (date) => {
    try {
      setLoading(true);
      setError("");
      const records = await apiService.attendance.getByDate(date);
      setAttendanceRecords(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(
        "Failed to fetch attendance records: " +
          (err.message || "Unknown error"),
      );
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleOpenDialog = (participant) => {
    setSelectedParticipant(participant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedParticipant(null);
    setOpenDialog(false);
    setAttendanceStatus("PRESENT");
  };

  const handleStatusChange = (event) => {
    setAttendanceStatus(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedParticipant || !selectedDate) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const attendanceData = {
        participantId: selectedParticipant.id || selectedParticipant._id,
        date: selectedDate,
        status: attendanceStatus,
        name: selectedParticipant.name,
        category: selectedParticipant.category,
      };

      await apiService.attendance.record(attendanceData);
      setSuccess("Attendance recorded successfully!");

      // Refresh attendance records
      await fetchAttendanceByDate(selectedDate);

      handleCloseDialog();
    } catch (err) {
      setError(
        "Failed to record attendance: " + (err.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (participantId) => {
    const record = attendanceRecords.find(
      (record) => record.participantId === participantId,
    );
    return record ? record.status : "NOT_MARKED";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "success.main";
      case "ABSENT":
        return "error.main";
      case "EXCUSED":
        return "warning.main";
      default:
        return "text.secondary";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Box>

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(participants) && participants.length > 0 ? (
                participants.map((participant) => {
                  const status = getAttendanceStatus(
                    participant.id || participant._id,
                  );
                  return (
                    <TableRow key={participant.id || participant._id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.phoneNumber}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.category}</TableCell>
                      <TableCell>
                        <Box sx={{ color: getStatusColor(status) }}>
                          {status.replace("_", " ")}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDialog(participant)}
                          disabled={status !== "NOT_MARKED"}
                        >
                          Mark Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? "Loading..." : "No participants found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Mark Attendance for {selectedParticipant?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={attendanceStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="PRESENT">Present</MenuItem>
                <MenuItem value="ABSENT">Absent</MenuItem>
                <MenuItem value="EXCUSED">Excused</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attendance;
