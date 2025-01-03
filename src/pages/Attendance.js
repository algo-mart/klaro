import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Select,
  MenuItem,
  IconButton,
  InputBase,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExportIcon from "@mui/icons-material/FileDownload";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "none",
  border: "none",
  margin: "20px 0",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid #f0f0f0",
  padding: "16px",
  "&.header": {
    backgroundColor: "#fff",
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
}));

const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "8px 16px",
  width: "300px",
  border: "1px solid #e0e0e0",
}));

const StatusChip = styled(Chip)(({ status }) => ({
  borderRadius: "16px",
  fontWeight: 500,
  ...(status === "Invited" && {
    backgroundColor: "#e8f5e9",
    color: "#4caf50",
  }),
  ...(status === "Absent" && {
    backgroundColor: "#ffebee",
    color: "#f44336",
  }),
  ...(status === "Employed" && {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  }),
  ...(status === "Hired" && {
    backgroundColor: "#f3e5f5",
    color: "#9c27b0",
  }),
}));

const Attendance = () => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "John Doe",
      category: "Senior Staff",
      present: true,
      amountPaid: "5000",
    },
    {
      id: 2,
      name: "Jane Smith",
      category: "Member",
      present: false,
      amountPaid: "3000",
    },
    {
      id: 3,
      name: "Alex Johnson",
      category: "Intern",
      present: true,
      amountPaid: "1500",
    },
    {
      id: 4,
      name: "Adewale Tunde",
      category: "Intern",
      present: false,
      amountPaid: "2000",
    },
    {
      id: 5,
      name: "Kehinde Caleb",
      category: "Intern",
      present: true,
      amountPaid: "2500",
    },
    {
      id: 6,
      name: "Eyitayo Foladerin",
      category: "Intern",
      present: false,
      amountPaid: "3000",
    },
    {
      id: 7,
      name: "Mark Zucks",
      category: "Intern",
      present: true,
      amountPaid: "3500",
    },
    {
      id: 8,
      name: "Tunde Daniel",
      category: "Intern",
      present: false,
      amountPaid: "4000",
    },
    {
      id: 9,
      name: "Folarin Foladerin",
      category: "Intern",
      present: true,
      amountPaid: "4500",
    },
    {
      id: 10,
      name: "Opeyemi David",
      category: "Intern",
      present: false,
      amountPaid: "5000",
    },
    {
      id: 11,
      name: "Tayo Kolapo",
      category: "Intern",
      present: true,
      amountPaid: "5500",
    },
  ]);

  const categoryOptions = ["Intern", "Member", "Senior Staff"];

  // Filter participants based on search query and filters
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const matchesSearch = participant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter
        ? participant.category === categoryFilter
        : true;
      const matchesStatus = statusFilter
        ? statusFilter === "Present"
          ? participant.present
          : !participant.present
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [participants, searchQuery, categoryFilter, statusFilter]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSelectAll = (event) => {
    try {
      if (event.target.checked) {
        const newSelected = filteredParticipants.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    } catch (error) {
      console.error('Error selecting all:', error);
    }
  };

  const handleSelect = (id) => {
    try {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    } catch (error) {
      console.error('Error selecting participant:', error);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const participant = participants.find((p) => p.id === id);
    setEditData({ ...participant });
  };

  const handleChange = (e, field) => {
    if (field === 'amountPaid') {
      // Validate amount is a positive number
      const value = e.target.value;
      if (value && (!Number(value) || Number(value) < 0)) {
        return;
      }
    }
    setEditData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = (id) => {
    try {
      if (!editData.name?.trim()) {
        return;
      }
      
      setParticipants((prev) => 
        prev.map((p) => 
          p.id === id 
            ? { 
                ...p, 
                ...editData,
                amountPaid: editData.amountPaid || p.amountPaid
              }
            : p
        )
      );
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error saving participant:', error);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    try {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };

  const togglePresent = (id) => {
    try {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, present: !p.present } : p
        )
      );
    } catch (error) {
      console.error('Error toggling presence:', error);
    }
  };

  const categoryTotals = participants.reduce((acc, participant) => {
    const amount = parseFloat(participant.amountPaid) || 0;
    acc[participant.category] = (acc[participant.category] || 0) + amount;
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <SearchBar>
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchBar>

          <Select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            displayEmpty
            sx={{
              bgcolor: "#fff",
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #e0e0e0",
              },
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Senior Staff">Senior Staff</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Intern">Intern</MenuItem>
          </Select>

          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            displayEmpty
            sx={{
              bgcolor: "#fff",
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #e0e0e0",
              },
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#1976d2", color: "#fff" }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            startIcon={<RemoveIcon />}
            sx={{ bgcolor: "#f44336", color: "#fff" }}
          >
            Remove
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ color: "#1976d2", borderColor: "#1976d2" }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filteredParticipants.length
                  }
                  checked={selected.length === filteredParticipants.length}
                  onChange={handleSelectAll}
                />
              </StyledTableCell>
              <StyledTableCell className="header">Name</StyledTableCell>
              <StyledTableCell className="header">Category</StyledTableCell>
              <StyledTableCell className="header">Amount Paid</StyledTableCell>
              <StyledTableCell className="header">Edit</StyledTableCell>
              <StyledTableCell className="header">Delete</StyledTableCell>
              <StyledTableCell className="header">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParticipants.map((row) => (
              <TableRow
                key={row.id}
                selected={selected.indexOf(row.id) !== -1}
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selected.indexOf(row.id) !== -1}
                    onChange={() => handleSelect(row.id)}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      {row.name.charAt(0)}
                    </Avatar>
                    {editingId === row.id ? (
                      <InputBase
                        value={editData.name || ""}
                        onChange={(e) => handleChange(e, "name")}
                        sx={{ width: "100%" }}
                      />
                    ) : (
                      row.name
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  {editingId === row.id ? (
                    <Select
                      value={editData.category || ""}
                      onChange={(e) => handleChange(e, "category")}
                      sx={{ width: "100%" }}
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    row.category
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editingId === row.id ? (
                    <InputBase
                      value={editData.amountPaid || ""}
                      onChange={(e) => handleChange(e, "amountPaid")}
                      type="number"
                      sx={{ width: "100%" }}
                    />
                  ) : row.amountPaid ? (
                    `₦${row.amountPaid}`
                  ) : (
                    ""
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editingId === row.id ? (
                    <>
                      <IconButton
                        aria-label="save"
                        onClick={() => handleSave(row.id)}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton aria-label="cancel" onClick={handleCancel}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.id)}
                  >
                    <CancelIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell>
                  <StatusChip
                    label={row.present ? "Present" : "Absent"}
                    status={row.present ? "Invited" : "Absent"}
                    size="small"
                    onClick={() => togglePresent(row.id)}
                    sx={{ cursor: "pointer" }}
                  />
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Category Summary Section */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Category Summary
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#1D1842",
                }}
              >
                Category
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#1D1842",
                }}
              >
                Total Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(categoryTotals).map(([category, total]) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>₦{total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                ₦
                {Object.values(categoryTotals)
                  .reduce((sum, val) => sum + val, 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Attendance;
