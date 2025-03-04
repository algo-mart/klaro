import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TablePagination
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const User = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
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
              'Content-Type': 'application/json'
            }
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
            email: user.email,
            phone: user.phone,
            contactInfo: user.contactInfo
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
  }, [category]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header and Toggle Buttons - Always visible */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        
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

      {/* Table Section with Overlay Loading */}
      <Box sx={{ position: 'relative', minHeight: '200px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a2233' }}>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Category</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.id}</TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.category}</TableCell>
                  <TableCell>{participant.contactInfo?.email || participant.email || ''}</TableCell>
                  <TableCell>{participant.contactInfo?.phone || participant.phone || ''}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

        {error && (
          <Box sx={{ mt: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
      </Box>

      <TablePagination
        component="div"
        count={totalElements}
        rowsPerPage={10}
        page={0}
        onPageChange={() => {}}
      />
    </Box>
  );
};

export default User;
