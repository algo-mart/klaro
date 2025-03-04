import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
  Select,
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon 
} from '@mui/icons-material';
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { user, isAuthenticated } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteParticipantId, setDeleteParticipantId] = useState("");
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    category: 'Member',
    contactInfoId: null
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const categories = ['INTERN', 'MEMBER', 'SENIOR_STAFF'];
      
      // Fetch data from all categories in parallel
      const responses = await Promise.all(
        categories.map(category =>
          axios.get(
            `/api/participants?pageSize=10&pageNumber=0&category=${category}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              }
            }
          )
        )
      );

      // Map and combine the responses
      const allParticipants = responses.flatMap((response, index) => {
        const category = categories[index];
        return response.data.content.map(participant => ({
          id: participant.participantId,
          name: participant.name,
          category: category,
          email: participant.contactInfo.email,
          phone: participant.contactInfo.phone,
          address: participant.contactInfo.address,
          status: 'Absent'
        }));
      });

      // Sort participants by ID in ascending order
      const sortedParticipants = [...allParticipants].sort((a, b) => {
        // Convert IDs to numbers to ensure proper numeric sorting
        const idA = Number(a.id);
        const idB = Number(b.id);
        return idA - idB;
      });

      console.log('[DEBUG] Fetched and sorted participants:', {
        totalParticipants: sortedParticipants.length,
        firstId: sortedParticipants[0]?.id,
        lastId: sortedParticipants[sortedParticipants.length - 1]?.id,
        participants: sortedParticipants
      });

      // Calculate total elements across all categories
      const totalElements = responses.reduce(
        (sum, response) => sum + (response.data.totalElements || 0),
        0
      );

      setParticipants(sortedParticipants);
      setTotalElements(totalElements);
    } catch (error) {
      console.error('[DEBUG] Failed to fetch participants:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      setError('Failed to fetch participants');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  useEffect(() => {
    if (selectedParticipant) {
      setEditData({
        fullName: selectedParticipant.name,
        phone: selectedParticipant.contactInfo?.phone || '',
        email: selectedParticipant.contactInfo?.email || '',
        address: selectedParticipant.contactInfo?.address || '',
        category: selectedParticipant.category,
        contactInfoId: selectedParticipant.contactInfo?.id
      });
    }
  }, [selectedParticipant]);

  const fetchAttendanceForDate = async (date) => {
    try {
      setLoading(true);
      setError('');
      
      // First get the attendance records for the date
      const attendanceResponse = await axios.get(
        `/api/attendance?date=${date}&eventId=1`
      );
      
      console.log('Raw Attendance Response:', attendanceResponse.data);

      // Filter records for the specific date and create a map
      const dateRecords = (attendanceResponse.data.content || [])
        .filter(record => record.date === date);
      
      console.log('Filtered records for date:', date, dateRecords);

      const attendanceMap = new Map(
        dateRecords.map(record => [
          record.participantId,
          record.status === 'PRESENT' ? 'Present' : 'Absent'
        ])
      );

      console.log('Attendance map:', Object.fromEntries(attendanceMap));

      // Update existing participants with attendance status
      setParticipants(prevParticipants => {
        const updatedParticipants = prevParticipants.map(participant => ({
          ...participant,
          status: attendanceMap.get(participant.id) || 'Absent'
        }));
        console.log('Updated participants:', updatedParticipants);
        return updatedParticipants;
      });

    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to fetch attendance data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const participantStatus = participants.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status
      }));
      console.log('Submitting attendance for:', selectedDate);
      console.log('Current participants status:', participantStatus);

      // Prepare attendance records for all participants
      const attendancePromises = participants.map(participant => {
        const data = {
          participantId: participant.id,
          date: selectedDate,
          status: participant.status.toUpperCase(),
          eventId: 1
        };
        console.log(`Recording attendance for ${participant.name}:`, data);
        
        return axios({
          method: 'post',
          url: '/api/attendance',
          headers: { 
            'Content-Type': 'application/json'
          },
          data: data
        });
      });

      // Submit all attendance records
      const results = await Promise.all(attendancePromises);
      console.log('Submission results:', results.map(r => r.data));
      
      setSuccess("Attendance recorded successfully for all participants");
      
      // Wait a brief moment before fetching to allow server to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh attendance data to confirm the changes
      await fetchAttendanceForDate(selectedDate);
    } catch (error) {
      console.error('Error recording attendance:', error);
      setError(`Failed to record attendance: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (participant) => {
    setParticipants(prevParticipants => {
      const updatedParticipants = prevParticipants.map(p => {
        if (p.id === participant.id) {
          const newStatus = p.status === 'Present' ? 'Absent' : 'Present';
          console.log(`Toggling ${p.name} (ID: ${p.id}) from ${p.status} to ${newStatus}`);
          return {
            ...p,
            status: newStatus
          };
        }
        return p;
      });
      console.log('Updated participants after toggle:', updatedParticipants);
      return updatedParticipants;
    });
  };

  const handleMenuOpen = (event, participant) => {
    setAnchorEl(event.currentTarget);
    setSelectedParticipant(participant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedParticipant) {
      setDeleteConfirmModalOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteParticipantAttendance = async () => {
    if (!selectedParticipant) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(`/api/attendance/${selectedParticipant.id}`);
      
      setSuccess("Attendance record deleted successfully");
      setDeleteConfirmModalOpen(false);
      
      // Refresh the attendance data if there's a currently selected date
      if (selectedDate) {
        await fetchAttendanceForDate(selectedDate);
      }
    } catch (err) {
      console.error("Error deleting attendance record:", err);
      setError("Failed to delete attendance record: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRecord = async () => {
    if (!deleteParticipantId) {
      setError("Please enter an attendance ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.delete(`/api/attendance/${deleteParticipantId}`);
      
      setSuccess("Attendance record deleted successfully");
      setDeleteModalOpen(false);
      setDeleteParticipantId("");
      
      // Refresh the attendance data if there's a currently selected date
      if (selectedDate) {
        await fetchAttendanceForDate(selectedDate);
      }
    } catch (err) {
      console.error("Error deleting attendance record:", err);
      setError("Failed to delete attendance record: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setEditLoading(true);
      setEditError(null);
      
      if (!selectedParticipant?.id) {
        throw new Error('Participant ID is missing');
      }

      if (!isAuthenticated()) {
        throw new Error('You are not authenticated. Please log in again.');
      }

      const payload = {
        name: editData.fullName,
        category: editData.category.toUpperCase(),
        contact_info: {
          id: selectedParticipant.id,  // Use the actual participant ID
          email: editData.email,
          phone: editData.phone,
          address: editData.address
        }
      };

      console.log('[DEBUG] Starting update with:', {
        participantId: selectedParticipant.id,  // Log the actual participant ID
        payload: JSON.stringify(payload, null, 2),
        isAuthenticated: isAuthenticated()
      });

      const response = await axios.put(
        `/api/participants/${selectedParticipant.id}`,  // Use the actual participant ID in the URL
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      console.log('[DEBUG] Update successful:', response.data);
      setEditModalOpen(false);
      fetchParticipants();
    } catch (error) {
      console.error('[DEBUG] Update failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      let errorMessage = 'Failed to update participant';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setEditError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedParticipant(null);
    setEditError(null);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          width: '100%', 
          marginTop: 2 
        }}
      >
        {error}
        <Button 
          onClick={fetchParticipants} 
          color="error" 
          variant="contained" 
          sx={{ marginLeft: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (participants.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No participants found
        </Typography>
        <Button 
          onClick={fetchParticipants} 
          color="primary" 
          variant="contained" 
          sx={{ marginTop: 2 }}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <h2>Meeting Attendance</h2>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchAttendanceForDate(e.target.value);
          }}
          sx={{ width: 220 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedDate}
        >
          Submit Attendance
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete a record
        </Button>
      </Box>

      {/* Delete Record Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-attendance-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Delete Attendance Record
          </Typography>
          <TextField
            type="text"
            value={deleteParticipantId}
            onChange={(e) => setDeleteParticipantId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            label="Attendance ID"
            placeholder="Enter attendance ID"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteParticipantId("");
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRecord}
              variant="contained"
              color="error"
              disabled={!deleteParticipantId || loading}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        aria-labelledby="delete-confirmation-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Delete Attendance Record
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete the attendance record for {selectedParticipant?.name}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => setDeleteConfirmModalOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteParticipantAttendance}
              variant="contained"
              color="error"
              disabled={loading}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleModalClose}
        aria-labelledby="edit-participant-modal"
      >
        <Box sx={{ ...modalStyle, width: 500 }}>
          <Typography variant="h6" gutterBottom>
            Edit Participant
          </Typography>
          
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Root level fields */}
            <TextField
              label="Full Name"
              value={editData.fullName}
              onChange={(e) => setEditData({...editData, fullName: e.target.value})}
              fullWidth
              required
            />
            
            <Select
              value={editData.category}
              onChange={(e) => setEditData({...editData, category: e.target.value})}
              fullWidth
              required
            >
              <MenuItem value="MEMBER">Member</MenuItem>
              <MenuItem value="INTERN">Intern</MenuItem>
              <MenuItem value="SENIOR_STAFF">Senior Staff</MenuItem>
            </Select>

            {/* Contact Info Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ 
              bgcolor: 'background.paper',
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <TextField
                label="Email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                fullWidth
                required
              />
              
              <TextField
                label="Phone"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                fullWidth
                required
              />
              
              <TextField
                label="Address"
                multiline
                rows={3}
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                fullWidth
              />
            </Box>

            {editError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {editError}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleModalClose}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                disabled={editLoading}
              >
                {editLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.id}</TableCell>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.category}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.phone}</TableCell>
                <TableCell>
                  <Button 
                    variant={participant.status === 'Present' ? 'contained' : 'outlined'}
                    color={participant.status === 'Present' ? 'success' : 'error'}
                    onClick={() => toggleAttendance(participant)}
                  >
                    {participant.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, participant)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Attendance;
