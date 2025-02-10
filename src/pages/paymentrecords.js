import React, { useState, useEffect } from "react";

const initialPayments = [
  { id: 1, name: "John Doe", amount: 100, date: "2024-02-01" },
  { id: 2, name: "Jane Smith", amount: 150, date: "2024-02-02" },
];

const PaymentRecords = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    // Simulate fetching data from an API
    // fetchPayments().then(fetchedPayments => setPayments(fetchedPayments));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPayments = payments.filter((payment) =>
    payment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (payment) => {
    setEditingPayment(payment);
  };

  const handleDelete = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const handleSaveEdit = () => {
    if (editingPayment) {
      setPayments(
        payments.map((payment) =>
          payment.id === editingPayment.id ? editingPayment : payment
        )
      );
      setEditingPayment(null);
    }
  };

  const handleEditingPaymentNameChange = (e) => {
    if (editingPayment) {
      setEditingPayment({ ...editingPayment, name: e.target.value });
    }
  };

  return (
    <>
      {/* Inline CSS styling */}
      <style>{`
        .payment-records {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .payment-records__title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 2rem;
          color: #333;
        }
        .payment-records__search input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 20px;
        }
        .payment-records__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .payment-records__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .payment-records__item:last-child {
          border-bottom: none;
        }
        .payment-records__info {
          display: flex;
          flex-direction: column;
        }
        .payment-records__name {
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }
        .payment-records__amount {
          color: #28a745;
          font-size: 1rem;
          margin-top: 4px;
        }
        .payment-records__date {
          color: #888;
          font-size: 0.9rem;
          margin-top: 2px;
        }
        .payment-records__actions button {
          margin-left: 8px;
        }
        .btn {
          padding: 8px 14px;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn--edit {
          background-color: #007bff;
          color: #fff;
        }
        .btn--edit:hover {
          background-color: #0069d9;
        }
        .btn--delete {
          background-color: #dc3545;
          color: #fff;
        }
        .btn--delete:hover {
          background-color: #c82333;
        }
        .btn--save {
          background-color: #28a745;
          color: #fff;
        }
        .btn--save:hover {
          background-color: #218838;
        }
        .payment-records__edit {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .payment-records__edit input {
          flex: 1;
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
      `}</style>

      <div className="payment-records">
        <h2 className="payment-records__title">Payment Records</h2>
        
        <div className="payment-records__search">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <ul className="payment-records__list">
          {filteredPayments.map((payment) => (
            <li key={payment.id} className="payment-records__item">
              <div className="payment-records__info">
                <span className="payment-records__name">{payment.name}</span>
                <span className="payment-records__amount">₦{payment.amount}</span>
                <span className="payment-records__date">({payment.date})</span>
              </div>
              <div className="payment-records__actions">
                <button className="btn btn--edit" onClick={() => handleEdit(payment)}>
                  Edit
                </button>
                <button className="btn btn--delete" onClick={() => handleDelete(payment.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {editingPayment && (
          <div className="payment-records__edit">
            <h3>Edit Payment</h3>
            <input
              type="text"
              value={editingPayment.name}
              onChange={handleEditingPaymentNameChange}
            />
            <button className="btn btn--save" onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentRecords;
