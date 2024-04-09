import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amountPaid: "",
  });

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
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Select Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">--Please choose an option--</option>
          <option value="category1">Senior Staff</option>
          <option value="category2">Member</option>
          <option value="category3">Intern</option>
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
