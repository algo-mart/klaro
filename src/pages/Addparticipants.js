import React, { useState } from "react";
import {
  TextField,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

const Addparticipants = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "1.5rem",
          fontWeight: "normal",
          marginBottom: "40px",
        }}
      >
        <span style={{ fontSize: "1.2em" }}>📄</span>
        Add New Participants
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <TextField
          fullWidth
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          sx={{
            marginBottom: "20px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
                borderBottom: "1px solid #e0e0e0",
              },
              "&:hover fieldset": {
                borderBottom: "1px solid #1976d2",
              },
              "&.Mui-focused fieldset": {
                borderBottom: "2px solid #1976d2",
              },
            },
          }}
        />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                    borderBottom: "1px solid #e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderBottom: "1px solid #1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderBottom: "2px solid #1976d2",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                    borderBottom: "1px solid #e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderBottom: "1px solid #1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderBottom: "2px solid #1976d2",
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          required
          multiline
          rows={2}
          sx={{
            marginBottom: "20px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
                borderBottom: "1px solid #e0e0e0",
              },
              "&:hover fieldset": {
                borderBottom: "1px solid #1976d2",
              },
              "&.Mui-focused fieldset": {
                borderBottom: "2px solid #1976d2",
              },
            },
          }}
        />

        <Typography
          variant="body1"
          sx={{
            mb: 1,
            color: "rgba(0, 0, 0, 0.6)",
          }}
        >
          Category
        </Typography>

        <RadioGroup
          row
          name="category"
          value={formData.category}
          onChange={handleChange}
          sx={{
            mb: 3,
            justifyContent: "space-between",
            "& .MuiFormControlLabel-root": {
              margin: 0,
            },
          }}
        >
          <FormControlLabel
            value="senior"
            control={<Radio />}
            label="Senior Staff"
          />
          <FormControlLabel value="member" control={<Radio />} label="Member" />
          <FormControlLabel value="intern" control={<Radio />} label="Intern" />
        </RadioGroup>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#3b82f6",
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          ADD PARTICIPANT
        </Button>
      </form>
    </div>
  );
};

export default Addparticipants;
