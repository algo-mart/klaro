import React, { useState } from "react";
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "./Attendance.css"; // Import the CSS file for styling

const Attendance = () => {
  const [participants, setParticipants] = useState([
    { id: 1, name: "John Doe", category: "Senior Staff", present: false },
    { id: 2, name: "Jane Smith", category: "Member", present: true },
    { id: 3, name: "Alex Johnson", category: "Intern", present: false },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  
  const handleDelete = (id) => {
    setParticipants(
      participants.filter((participant) => participant.id !== id),
    );
  };

  const handlePresentToggle = (id) => {
    setParticipants(
      participants.map((participant) =>
        participant.id === id
          ? { ...participant, present: !participant.present }
          : participant,
          
      ),
    );
  };

  return (
    <div className="attendance-table-container">
      <div className="search-date-container">
        <TextField
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          variant="outlined"
          className="date-input"
        />
        <TextField
          type="text"
          label="Search participants"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-box"
        />
      </div>
      <Table className="attendance-table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Present</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants
            .filter((participant) =>
              participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.category}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => console.log("Edit clicked")}
                  >
                    <Edit />
                  </IconButton>
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
