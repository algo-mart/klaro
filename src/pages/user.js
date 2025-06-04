import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  Box,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import axios from 'axios';

const User = () => {
  const { user, isAuthenticated } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [category, setCategory] = useState('MEMBER');

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let allParticipants = [];
      let pageNumber = 0;
      let totalPages = 1;

      while (pageNumber < totalPages) {
        const response = await axios.get(
          `https://kibou-registry-1.onrender.com/api/users?pageSize=10&pageNumber=${pageNumber}&category=${category}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`
            },
            baseURL: 'https://kibou-registry-1.onrender.com'
          }
        );

        console.log(`[DEBUG] Fetching ${category} category, Page ${pageNumber}:`, response.data);

        const users = response.data?.content || [];
        totalPages = response.data?.totalPages || 1;

        allParticipants = [
          ...allParticipants,
          ...users.map(user => ({
            id: user.userId,
            name: user.name,
            category: category,
            contactInfo: user.contactInfo,
            status: 'Absent'
          }))
        ];

        pageNumber++;
      }

      console.log('[DEBUG] Final processed participants:', allParticipants);
      setParticipants(allParticipants);
      setTotalElements(allParticipants.length);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to fetch participants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, category]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchParticipants();
    }
  }, [fetchParticipants, isAuthenticated]);

  useEffect(() => {
    if (selectedParticipant) {
      setEditData({
        fullName: selectedParticipant.name,
        phone: selectedParticipant.contactInfo?.phone || '',
        email: selectedParticipant.contactInfo?.email || '',
        address: selectedParticipant.contactInfo?.address || '',
        category: selectedParticipant.category,
        contactInfoId: selectedParticipant.contactInfo?.id || null
      });
    }
  }, [selectedParticipant]);

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
          phone: editData.phone,
          email: editData.email,
          address: editData.address
        }
      };

      console.log('[DEBUG] Sending payload:', {
        url: `https://kibou-registry-1.onrender.com/api/users/${selectedParticipant.id}`,
        method: 'PUT',
        payload,
        token: user?.token ? 'present' : 'missing'
      });

      await axios.put(
        `https://kibou-registry-1.onrender.com/api/users/${selectedParticipant.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        }
      );
      
      console.log('[DEBUG] Update successful');
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

  return (
    <Box sx={{ width: '100%', height: '70vh', p: 3 }}>
      {/* Header and Toggle Buttons - Always visible */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* <Typography variant="h4" gutterBottom>
          Users
        </Typography> */}
        
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="user category"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="INTERN" aria-label="intern">
            Intern
          </ToggleButton>
          <ToggleButton value="MEMBER" aria-label="member">
            Member
          </ToggleButton>
          <ToggleButton value="SENIOR_STAFF" aria-label="senior staff">
            Senior Staff
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table Section - Shows loading state */}
      <Box sx={{ position: 'relative', minHeight: '200px' }}>
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1a2233' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>S/N</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phone Number</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow
                    key={participant.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.contactInfo?.email || participant.email || ''}</TableCell>
                    <TableCell>{participant.contactInfo?.phone || participant.phone || ''}</TableCell>
                    <TableCell>{participant.category}</TableCell>
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
        )}
      </Box>

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

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
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

export default User;
