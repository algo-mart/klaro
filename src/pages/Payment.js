import React, { useState } from "react";
import "./Payment.css";
import { TextField, MenuItem } from "@mui/material";

const Payment = () => {
  const [category, setCategory] = useState("");

  // const handleChange = (event) => {
  //   setCategory(event.target.value);
  //   console.log(`Selected meeting type: ${event.target.value}`);
  // };

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amountPaidIntern: "",
    amountPaidMember: "",
    amountPaidSenior: "",
  });
  const [meetingDate, setMeetingDate] = useState("");
  const [inputType, setInputType] = useState("text");

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
        <div className="date-select-meeting">
          <TextField
            type={inputType}
            id="meetingDate"
            label="Meeting Date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            variant="outlined"
            className="date-input"
            onFocus={() => setInputType("date")}
            onBlur={() => meetingDate === "" && setInputType("text")}
            style={{ marginRight: "10px", width: "50%" }}
            fullWidth
            required
          />

          <TextField
            select
            label="Meeting type"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
            fullWidth
            required
            style={{ marginRight: "10px", width: "50%" }}
          >
            <MenuItem value="">
              <em>--Please choose meeting type--</em>
            </MenuItem>
            <MenuItem value="category1">Type 1</MenuItem>
            <MenuItem value="category2">Type 2</MenuItem>
            <MenuItem value="category3">Type 3</MenuItem>
          </TextField>
        </div>

        <label htmlFor="amountPaidIntern">Amount Paid by Intern:</label>
        <input
          type="number"
          id="amountPaidIntern"
          name="amountPaidIntern"
          value={formData.amountPaidIntern}
          onChange={handleChange}
          required
        />

        <label htmlFor="amountPaidMember">Amount Paid by Member:</label>
        <input
          type="number"
          id="amountPaidMember"
          name="amountPaidMember"
          value={formData.amountPaidMember}
          onChange={handleChange}
          required
        />

        <label htmlFor="amountPaidSeniorf">Amount Paid by Senior Staff:</label>

        <input
          type="number"
          id="amountPaidSenior"
          name="amountPaidSenior"
          value={formData.amountPaidSenior}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Payment;
