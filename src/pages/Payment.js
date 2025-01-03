import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Payment = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    meetingDate: "",
    meetingType: "",
    name: "",
    amountPaidIntern: "",
    amountPaidMember: "",
    amountPaidSenior: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const sanitizeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  };

  const validateForm = (values) => {
    const errors = {};
    const currentDate = new Date();
    const selectedDate = new Date(values.meetingDate);

    // Date validation
    if (!values.meetingDate) {
      errors.meetingDate = "Meeting date is required";
    } else if (selectedDate > currentDate) {
      errors.meetingDate = "Meeting date cannot be in the future";
    }

    // Required fields
    if (!values.meetingType) errors.meetingType = "Meeting type is required";
    if (!values.name) errors.name = "Name is required";

    // Amount validation with proper sanitization
    const amountIntern = sanitizeNumber(values.amountPaidIntern);
    const amountMember = sanitizeNumber(values.amountPaidMember);
    const amountSenior = sanitizeNumber(values.amountPaidSenior);

    if (amountIntern <= 0) {
      errors.amountPaidIntern = "Amount Paid by Intern must be positive";
    }
    if (amountMember <= 0) {
      errors.amountPaidMember = "Amount Paid by Member must be positive";
    }
    if (amountSenior <= 0) {
      errors.amountPaidSenior = "Amount Paid by Senior Staff must be positive";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name.startsWith("amountPaid")) {
      sanitizedValue = value.replace(/[^0-9.]/g, "");
      if (sanitizedValue.split(".").length > 2) return; // Prevent multiple decimal points
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Prepare sanitized data for submission
        const sanitizedData = {
          ...formData,
          amountPaidIntern: sanitizeNumber(formData.amountPaidIntern),
          amountPaidMember: sanitizeNumber(formData.amountPaidMember),
          amountPaidSenior: sanitizeNumber(formData.amountPaidSenior),
          submittedBy: user?.email || "unknown",
          submittedAt: new Date().toISOString(),
        };

        // In a real app, this would be an API call
        console.log("Submitting payment:", sanitizedData);
        setSubmitStatus({
          type: "success",
          message: "Payment recorded successfully",
        });

        // Clear form after successful submission
        setFormData({
          meetingDate: "",
          meetingType: "",
          name: "",
          amountPaidIntern: "",
          amountPaidMember: "",
          amountPaidSenior: "",
        });
      } catch (error) {
        console.error("Payment submission error:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to process payment. Please try again.",
        });
      }
    } else {
      setErrors(validationErrors);
    }
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
        Daily Payment Entry
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
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
            label="Meeting Type"
            value={formData.meetingType}
            onChange={handleChange}
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
            <MenuItem value="weekly">Weekly Meeting</MenuItem>
            <MenuItem value="monthly">Monthly Meeting</MenuItem>
            <MenuItem value="special">Special Meeting</MenuItem>
          </TextField>
        </div>

        <TextField
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
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

        <Typography
          variant="subtitle1"
          sx={{ mb: 1, color: "rgba(0, 0, 0, 0.6)" }}
        >
          Amount Paid
        </Typography>

        <TextField
          fullWidth
          name="amountPaidIntern"
          label="Intern"
          type="number"
          value={formData.amountPaidIntern}
          onChange={handleChange}
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
          name="amountPaidMember"
          label="Member"
          type="number"
          value={formData.amountPaidMember}
          onChange={handleChange}
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
          name="amountPaidSenior"
          label="Senior Staff"
          type="number"
          value={formData.amountPaidSenior}
          onChange={handleChange}
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
        {submitStatus && (
          <Alert severity={submitStatus.type} sx={{ mt: 2 }}>
            {submitStatus.message}
          </Alert>
        )}
        {errors.submit && (
          <div style={{ color: "red", marginTop: 8 }}>{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default Payment;
