import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  styled,
} from "@mui/material";
import axios from "axios";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": {
      border: "none",
      borderBottom: "1px solid #e0e0e0",
    },
    "&:hover fieldset": {
      border: "none",
      borderBottom: "1px solid #e0e0e0",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
}));

export default function Addparticipants() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      values.name &&
      values.email &&
      values.phone &&
      values.address &&
      values.category
    ) {
      setValid(true);
      submitParticipant();
    } else {
      setValid(false);
    }

    setSubmitted(true);
  };

  const submitParticipant = () => {
    const data = {
      name: values.name,
      category: values.category,
      contact_info: {
        email: values.email,
        phone: values.phone,
        address: values.address,
      },
    };

    axios
      .post("{{baseurl}}/participants", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response data:", response.data);
      })
      .catch((error) => {
        console.error("There was an error submitting the form:", error);
      });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto", marginTop: 5 }}>
      <form onSubmit={handleSubmit}>
        {submitted && valid && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#e8f5e9", borderRadius: 1 }}>
            <Typography variant="subtitle1" color="success.main">
              Welcome {values.name}! Your registration was successful!
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Full Name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              error={submitted && !values.name}
              helperText={
                submitted && !values.name ? "Please enter a full name" : ""
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              type="tel"
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
              error={submitted && !values.phone}
              helperText={
                submitted && !values.phone ? "Please enter a phone number" : ""
              }
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={submitted && !values.email}
              helperText={
                submitted && !values.email
                  ? "Please enter an email address"
                  : ""
              }
              required
            />
          </Grid>

          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              error={submitted && !values.address}
              helperText={
                submitted && !values.address ? "Please enter an address" : ""
              }
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl error={submitted && !values.category} required>
              <FormLabel>Category</FormLabel>
              <RadioGroup
                row
                name="category"
                value={values.category}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="intern"
                  control={<Radio />}
                  label="Intern"
                />
                <FormControlLabel
                  value="member"
                  control={<Radio />}
                  label="Member"
                />
                <FormControlLabel
                  value="Senior Staff"
                  control={<Radio />}
                  label="Senior Staff"
                />
              </RadioGroup>
              {submitted && !values.category && (
                <Typography variant="caption" color="error">
                  Please select a category
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Submit
            </button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
