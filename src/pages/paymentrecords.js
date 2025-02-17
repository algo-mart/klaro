import React, { useState, useEffect } from "react";
import axios from "axios";

const initialPayments = [];

const PaymentRecords = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [filters, setFilters] = useState({
    event: "",
    startDate: "",
    endDate: "",
    eventType: "ALL", // Using uppercase for consistency
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [error, setError] = useState("");

  // Helper to format date strings for datetime-local inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    // Format: YYYY-MM-DDTHH:mm
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Fetch payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      console.log("Fetching payments...");
      try {
        // Updated pagination: fetching 10 records rather than 1.
        const response = await axios.get(
          "https://kibou-registry-1.onrender.com/api/payments?eventType=REGULAR&page=0&size=10",
        );

        console.log("API Response:", response);

        if (response.status === 200) {
          // Support either an array response or a nested structure (e.g., { data: [...] })
          let paymentsData = Array.isArray(response.data)
            ? response.data
            : response.data.data;

          if (Array.isArray(paymentsData)) {
            setPayments(paymentsData);
          } else {
            console.error("Unexpected API response format:", response.data);
            setError("Unexpected API response format");
          }
        } else {
          setError("Failed to load payment records");
        }
      } catch (err) {
        console.error("Error fetching payments:", err.response || err.message);
        setError(
          err.response?.data?.message || "Failed to load payment records",
        );
      }
    };

    fetchPayments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter payments based on the current filters (case-insensitive for event name, normalized event type)
  const filteredPayments = payments.filter((payment) => {
    const matchEvent = (payment.event || "")
      .toLowerCase()
      .includes(filters.event.toLowerCase());
    let matchStart = true;
    if (filters.startDate) {
      matchStart = new Date(payment.startDate) >= new Date(filters.startDate);
    }
    let matchEnd = true;
    if (filters.endDate) {
      matchEnd = new Date(payment.endDate) <= new Date(filters.endDate);
    }
    const matchType =
      filters.eventType === "ALL" ||
      payment.eventType.toUpperCase() === filters.eventType;

    return matchEvent && matchStart && matchEnd && matchType;
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://kibou-registry-1.onrender.com/api/payments/${id}`,
      );
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== id),
      );
    } catch (err) {
      console.error("Error deleting payment:", err.response || err.message);
      setError("Error deleting payment");
    }
  };

  const handleSaveEdit = async () => {
    if (editingPayment) {
      try {
        const response = await axios.put(
          `https://kibou-registry-1.onrender.com/api/payments/${editingPayment.id}`,
          editingPayment,
          { headers: { "Content-Type": "application/json" } },
        );
        setPayments((prevPayments) =>
          prevPayments.map((p) =>
            p.id === editingPayment.id ? response.data : p,
          ),
        );
      } catch (err) {
        console.error("Error updating payment:", err.response || err.message);
        setError("Error updating payment");
      }
      setEditingPayment(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
  };

  return (
    <>
      <style>{`
        .payment-records {
          max-width: 1100px;
          margin: 50px auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-family: 'Poppins', sans-serif;
        }
        .payment-records__title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        .search-form {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        .search-form input,
        .search-form select {
          padding: 10px 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }
        .payment-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 25px;
        }
        .payment-card {
          flex: 1 1 calc(50% - 25px);
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .edit-actions {
          display: flex;
          gap: 10px;
        }
        .error-message {
          text-align: center;
          color: red;
          font-weight: bold;
        }
      `}</style>
      <div className="payment-records">
        <h2 className="payment-records__title">Payment Records</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="search-form">
          <input
            type="text"
            name="event"
            placeholder="Search Event"
            value={filters.event}
            onChange={handleFilterChange}
          />
          <input
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <select
            name="eventType"
            value={filters.eventType}
            onChange={handleFilterChange}
          >
            <option value="ALL">All</option>
            <option value="REGULAR">Regular</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="payment-cards">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="payment-card">
                {editingPayment && editingPayment.id === payment.id ? (
                  <div className="edit-form">
                    <label>
                      Event:
                      <input
                        type="text"
                        name="event"
                        value={editingPayment.event}
                        onChange={handleEditChange}
                      />
                    </label>
                    <label>
                      Start Date:
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formatDateForInput(editingPayment.startDate)}
                        onChange={handleEditChange}
                      />
                    </label>
                    <label>
                      End Date:
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formatDateForInput(editingPayment.endDate)}
                        onChange={handleEditChange}
                      />
                    </label>
                    <label>
                      Event Type:
                      <select
                        name="eventType"
                        value={editingPayment.eventType.toUpperCase()}
                        onChange={handleEditChange}
                      >
                        <option value="REGULAR">Regular</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </label>
                    <label>
                      Total Amount:
                      <input
                        type="number"
                        name="totalAmount"
                        value={editingPayment.totalAmount}
                        onChange={handleEditChange}
                      />
                    </label>
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{payment.event}</h3>
                    <div className="payment-card__details">
                      <p>
                        <strong>Start:</strong>{" "}
                        {new Date(payment.startDate).toLocaleString()}
                      </p>
                      <p>
                        <strong>End:</strong>{" "}
                        {new Date(payment.endDate).toLocaleString()}
                      </p>
                      <p>
                        <strong>Type:</strong> {payment.eventType}
                      </p>
                      <p>
                        <strong>Total:</strong> ₦{payment.totalAmount}
                      </p>
                      <button onClick={() => handleEdit(payment)}>Edit</button>
                      <button onClick={() => handleDelete(payment.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="error-message">No payment records found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentRecords;
