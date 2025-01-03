import React, { useState } from "react";
import "./Payment.css";
import { TextField, MenuItem, Button } from "@mui/material";

const Payment = () => {
  const [formData, setFormData] = useState({
    meetingDate: "",
    meetingType: "",
    name: "",
    amountPaidIntern: "",
    amountPaidMember: "",
    amountPaidSenior: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = (values) => {
    const errors = {};
    if (!values.meetingDate) errors.meetingDate = "Meeting Date is required";
    if (!values.meetingType) errors.meetingType = "Meeting Type is required";
    if (!values.name) errors.name = "Name is required";
    if (!values.amountPaidIntern || values.amountPaidIntern <= 0) {
      errors.amountPaidIntern = "Amount Paid by Intern must be positive";
    }
    if (!values.amountPaidMember || values.amountPaidMember <= 0) {
      errors.amountPaidMember = "Amount Paid by Member must be positive";
    }
    if (!values.amountPaidSenior || values.amountPaidSenior <= 0) {
      errors.amountPaidSenior = "Amount Paid by Senior Staff must be positive";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log("Form submitted:", formData);
      } catch (error) {
        setErrors({
          submit:
            error.message || "Failed to process payment. Please try again.",
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto", marginTop: "40px" }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <TextField
            fullWidth
            type="date"
            name="meetingDate"
            label="Meeting Date"
            value={formData.meetingDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!!errors.meetingDate}
            helperText={errors.meetingDate}
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

          <TextField
            fullWidth
            select
            name="meetingType"
            label="Meeting type"
            value={formData.meetingType}
            onChange={handleChange}
            required
            error={!!errors.meetingType}
            helperText={errors.meetingType}
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
          >
            <MenuItem value="">--Please choose meeting type--</MenuItem>
            <MenuItem value="type1">Type 1</MenuItem>
            <MenuItem value="type2">Type 2</MenuItem>
            <MenuItem value="type3">Type 3</MenuItem>
          </TextField>
        </div>

        <TextField
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
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

        <TextField
          fullWidth
          type="number"
          name="amountPaidIntern"
          label="Amount Paid by Intern"
          value={formData.amountPaidIntern}
          onChange={handleChange}
          required
          error={!!errors.amountPaidIntern}
          helperText={errors.amountPaidIntern}
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

        <TextField
          fullWidth
          type="number"
          name="amountPaidMember"
          label="Amount Paid by Member"
          value={formData.amountPaidMember}
          onChange={handleChange}
          required
          error={!!errors.amountPaidMember}
          helperText={errors.amountPaidMember}
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

        <TextField
          fullWidth
          type="number"
          name="amountPaidSenior"
          label="Amount Paid by Senior Staff"
          value={formData.amountPaidSenior}
          onChange={handleChange}
          required
          error={!!errors.amountPaidSenior}
          helperText={errors.amountPaidSenior}
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#3b82f6",
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          Submit
        </Button>
        {errors.submit && (
          <div style={{ color: "red", marginTop: 8 }}>{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default Payment;
