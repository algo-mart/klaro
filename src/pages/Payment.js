import React, { useState } from "react";
import "./Payment.css";
import { TextField } from "@mui/material";

const Payment = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amountPaid: "",
  });
  const [meetingDate, setMeetingDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    console.log(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Select meeting Date:</label>
        <TextField
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          variant="outlined"
          className="date-input"
        />

        <label htmlFor="category">Select meeting type:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">--Please choose meeting type--</option>
          <option value="category1">Type 1</option>
          <option value="category2">Type 2</option>
          <option value="category3">Type 3</option>
        </select>

        <label htmlFor="amountPaid">Enter Amount Paid:</label>
        <input
          type="number"
          id="amountPaid"
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Payment;
