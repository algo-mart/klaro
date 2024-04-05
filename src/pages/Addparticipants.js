import "./Addparticipants.css";
import React, { useState } from "react";

export default function Addparticipants() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (event) => {
    /* event.persist(); NO LONGER USED IN v.17*/
    event.preventDefault();

    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      values.firstName &&
      values.lastName &&
      values.email &&
      values.phone &&
      values.category
    ) {
      setValid(true);
    }
    setSubmitted(true);
  };

  console.log(values);

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        {submitted && valid && (
          <div className="success-message">
            <h3>
              {" "}
              Welcome {values.firstName} {values.lastName}{" "}
            </h3>
            <div> Your registration was successful! </div>
          </div>
        )}

        <div className="display-flex">
          <div className="display-flex-col">
            {!valid && (
              <input
                class="form-field mr"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.firstName && (
              <span id="first-name-error">Please enter a first name</span>
            )}
          </div>
          <div className="display-flex-col">
            {!valid && (
              <input
                class="form-field"
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.lastName && (
              <span id="last-name-error">Please enter a last name</span>
            )}
          </div>
        </div>

        <div className="display-flex">
          <div className="display-flex-col">
            {!valid && (
              <input
                class="form-field mr"
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
                class="form-field"
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
          <div className="display-flex justify-between">
            <div className="display-flex">
              <input
                class="form-field mr"
                type="checkbox"
                placeholder="Intern"
                name="category"
                checked={values.category === "intern" ? true : false}
                value={"intern"}
                onChange={handleInputChange}
              />
              <p>Intern</p>
            </div>
            <div className="display-flex">
              <input
                class="form-field mr"
                type="checkbox"
                placeholder="Intern"
                checked={values.category === "member"}
                name="category"
                value={"member"}
                onChange={handleInputChange}
              />
              <p>Member</p>
            </div>
            <div className="display-flex">
              <input
                class="form-field mr"
                type="checkbox"
                placeholder="Intern"
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
          <button class="form-field " type="submit">
            Add Participant
          </button>
        )}
      </form>
    </div>
  );
}
