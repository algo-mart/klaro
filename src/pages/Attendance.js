import React, { useCallback, useState } from "react";
import { FormControl } from "react-bootstrap";
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
import "./Attendance.css"; // Import the CSS file for styling

const Attendance = () => {
  const initialParticipants = [
    {
      id: 1,
      name: "John Doe",
      category: "Senior Staff",
      present: false,
      amountPaid: "",
    },
    {
      id: 2,
      name: "Jane Smith",
      category: "Member",
      present: false,
      amountPaid: "",
    },
    {
      id: 3,
      name: "Alex Johnson",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 4,
      name: "Adewale Tunde",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 5,
      name: "Kehinde Caleb",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 6,
      name: "Eyitayo Foladerin",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 7,
      name: "Mark Zucks",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 8,
      name: "Tunde Daniel",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 9,
      name: "Folarin Foladerin",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 10,
      name: "Opeyemi David",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
    {
      id: 11,
      name: "Tayo Kolapo",
      category: "Intern",
      present: false,
      amountPaid: "",
    },
  ];

  const [participants, setParticipants] = useState(initialParticipants);
  const [searchTerm, setSearchTerm] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [inputType, setInputType] = useState("text");
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    amountPaid: "",
  });

  const categoryOptions = ["Intern", "Member", "Senior Staff"];

  // Function to handle deleting a participant
  const handleDelete = useCallback((id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== id),
    );
  }, []);

  // Function to handle toggling participant's present status
  const handlePresentToggle = useCallback((id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === id
          ? { ...participant, present: !participant.present }
          : participant,
      ),
    );
  }, []);
  // Function to start editing a participant
  const handleEditStart = useCallback((participant) => {
    setEditingParticipant(participant.id);
    setEditForm({
      name: participant.name,
      category: participant.category,
      amountPaid: participant.amountPaid,
    });
  }, []);

  // Function to cancel editing
  const handleEditCancel = useCallback(() => {
    setEditingParticipant(null);
    setEditForm({ name: "", category: "", amountPaid: "" });
  }, []);

  // Function to save edited participant
  const handleEditSave = useCallback(() => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === editingParticipant
          ? { ...participant, ...editForm }
          : participant,
      ),
    );
    setEditingParticipant(null);
    setEditForm({ name: "", category: "", amountPaid: "" });
  }, [editingParticipant, editForm]);

  // Function to handle input change in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  // Function to handle form submission
  const handleSubmit = () => {
    // Reset the meeting date and search term
    setMeetingDate("");
    setSearchTerm("");

    // Reset participants to their initial state
    setParticipants(initialParticipants);
  };

  return (
    <div className="attendance-table-container">
      <div className="search-date-container" style={{ marginTop: "35px" }}>
        <TextField
          type={inputType}
          label="Meeting Date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          variant="outlined"
          className="date-inputAttendance"
          onFocus={() => setInputType("date")}
          onBlur={() => meetingDate === "" && setInputType("text")}
          style={{ marginRight: "10px", height: "30px", boxShadow: "#1D1842" }}
          required
        />
        <TextField
          type="text"
          label="Search participants"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-box"
          style={{ marginRight: "5%", width: "40%" }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="submit-button"
          style={{ width: "30%", backgroundColor: "#1D1842" }}
        >
          Submit
        </Button>
      </div>
      <Table className="attendance-table" style={{ margin: "20px" }}>
        <TableHead style={{ backgroundColor: "#1D1842" }}>
          <TableRow style={{ backgroundColor: "#1D1842" }}>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Name
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Category
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Amount Paid
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Edit
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Delete
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#1D1842" }}>
              Present/Absent
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ alignItems: "center", justifyContent: "center" }}>
          {participants
            .filter((participant) =>
              participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>
                  {" "}
                  {editingParticipant === participant.id ? (
                    <TextField
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                      className="edit-input"
                      required
                    />
                  ) : (
                    participant.name
                  )}
                </TableCell>
                <TableCell>
                  {editingParticipant === participant.id ? (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="edit-input"
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditFormChange}
                        label="Category"
                      >
                        {categoryOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    participant.category
                  )}
                </TableCell>

                <TableCell>
                  {editingParticipant === participant.id ? (
                    <TextField
                      name="amountPaid"
                      value={editForm.amountPaid}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                      className="edit-input"
                      type="number"
                      required
                    />
                  ) : (
                    participant.amountPaid
                  )}
                </TableCell>
                <TableCell>
                  {editingParticipant === participant.id ? (
                    <>
                      <IconButton aria-label="save" onClick={handleEditSave}>
                        <Save />
                      </IconButton>
                      <IconButton
                        aria-label="cancel"
                        onClick={handleEditCancel}
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditStart(participant)}
                    >
                      <Edit />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(participant.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={participant.present}
                    onChange={() => handlePresentToggle(participant.id)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Attendance;
