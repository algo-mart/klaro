import "./Addparticipants.css";
import React, { useState } from "react";
import axios from 'axios';

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

    if (values.name && values.email && values.phone && values.address && values.category) {
      setValid(true);
      submitParticipant(); // Call the API when the form is valid
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

    axios.post('{{baseurl}}/participants', data, {
      headers: {
        'Content-Type': 'application/json',
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
    <div className="form-container-1">
      <h1>Add Participant</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        {submitted && valid && (
          <div className="success-message">
            <h3> Welcome {values.name} </h3>
            <div> Your registration was successful! </div>
          </div>
        )}

        <div className="display-flex-col">
          {!valid && (
            <input
              className="form-field"
              type="text"
              placeholder="Full name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          )}

          {submitted && !values.name && (
            <span id="name-error">Please enter a full name</span>
          )}
        </div>

        <div className="display-flex">
          <div className="display-flex-col">
            {!valid && (
              <input
                className="form-field mr"
                type="number"
                placeholder="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.phone && (
              <span id="phone-number-error">Please enter a phone number</span>
            )}
          </div>
          <div className="display-flex-col">
            {!valid && (
              <input
                className="form-field"
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.email && (
              <span id="email-error">Please enter an email address</span>
            )}
          </div>
        </div>

        <div className="display-flex-col">
          {!valid && (
            <input
              className="form-field"
              type="text"
              placeholder="Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
            />
          )}

          {submitted && !values.address && (
            <span id="address-error">Please enter an address</span>
          )}
        </div>

        <div className="display-flex-col">
          <div className="display-flex justify-between">
            <div className="display-flex">
              <input
                className="form-field mr"
                type="checkbox"
                name="category"
                checked={values.category === "intern"}
                value={"intern"}
                onChange={handleInputChange}
              />
              <p>Intern</p>
            </div>
            <div className="display-flex">
              <input
                className="form-field mr"
                type="checkbox"
                checked={values.category === "member"}
                name="category"
                value={"member"}
                onChange={handleInputChange}
              />
              <p>Member</p>
            </div>
            <div className="display-flex">
              <input
                className="form-field mr"
                type="checkbox"
                checked={values.category === "Senior Staff"}
                name="category"
                value={"Senior Staff"}
                onChange={handleInputChange}
              />
              <p>Senior Staff</p>
            </div>
          </div>
          {submitted && !values.category && (
            <span id="email-error">Please select a category</span>
          )}
        </div>

        {!valid && (
          <button className="form-field submit" type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
