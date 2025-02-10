import React, { useState, useEffect } from "react";

// Dummy payment data (replace with your API data as needed)
const dummyPayments = [
  { id: 1, name: "Payment 1", amount: 100, date: "2024-01-15" },
  { id: 2, name: "Payment 2", amount: 150, date: "2024-01-20" },
  { id: 3, name: "Payment 3", amount: 200, date: "2024-02-05" },
  { id: 4, name: "Payment 4", amount: 250, date: "2024-02-20" },
  { id: 5, name: "Payment 5", amount: 300, date: "2024-03-10" },
  { id: 6, name: "Payment 6", amount: 180, date: "2023-12-25" },
  { id: 7, name: "Payment 7", amount: 220, date: "2023-11-11" },
];

const MonthlySummary = () => {
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    // Simulate fetching data from an API
    setPayments(dummyPayments);
  }, []);

  // Filter payments by the selected month and year
  const filteredPayments = payments.filter((payment) => {
    const date = new Date(payment.date);
    const paymentMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Format month as "01", "02", etc.
    const paymentYear = date.getFullYear().toString();
    return paymentMonth === selectedMonth && paymentYear === selectedYear;
  });

  // Compute summary statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const averageAmount = totalPayments > 0 ? (totalAmount / totalPayments).toFixed(2) : 0;

  return (
    <>
      {/* Inline CSS Styling */}
      <style>{`
        .monthly-summary {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          background: linear-gradient(135deg, #ffffff, #f1f1f1);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Helvetica Neue', sans-serif;
          color: #333;
        }
        .monthly-summary__header {
          text-align: center;
          margin-bottom: 30px;
        }
        .monthly-summary__title {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #444;
        }
        .monthly-summary__filters {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }
        .monthly-summary__filters select {
          padding: 10px 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
          background-color: #fff;
          transition: border-color 0.3s ease;
        }
        .monthly-summary__filters select:focus {
          outline: none;
          border-color: #007bff;
        }
        .monthly-summary__stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .monthly-summary__stat {
          font-size: 1.2rem;
          color: #555;
        }
        .monthly-summary__stat strong {
          display: block;
          font-size: 1.4rem;
          margin-bottom: 5px;
          color: #222;
        }
        .monthly-summary__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .monthly-summary__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fff;
          margin-bottom: 15px;
          padding: 15px 20px;
          border-radius: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .monthly-summary__item:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .monthly-summary__item-details {
          display: flex;
          flex-direction: column;
        }
        .monthly-summary__item-name {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .monthly-summary__item-date {
          font-size: 0.9rem;
          color: #777;
        }
        .monthly-summary__item-amount {
          font-size: 1.2rem;
          font-weight: bold;
          color: #28a745;
        }
        @media (max-width: 600px) {
          .monthly-summary__stats {
            flex-direction: column;
            gap: 10px;
          }
          .monthly-summary__filters {
            flex-direction: column;
            gap: 10px;
          }
          .monthly-summary__item {
            flex-direction: column;
            align-items: flex-start;
          }
          .monthly-summary__item-amount {
            margin-top: 10px;
          }
        }
      `}</style>

      <div className="monthly-summary">
        <div className="monthly-summary__header">
          <h2 className="monthly-summary__title">Monthly Summary</h2>
          <div className="monthly-summary__filters">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
        </div>

        <div className="monthly-summary__stats">
          <div className="monthly-summary__stat">
            <strong>Total Payments</strong> {totalPayments}
          </div>
          <div className="monthly-summary__stat">
            <strong>Total Amount</strong> ₦{totalAmount}
          </div>
          <div className="monthly-summary__stat">
            <strong>Average Payment</strong> ₦{averageAmount}
          </div>
        </div>

        <ul className="monthly-summary__list">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <li key={payment.id} className="monthly-summary__item">
                <div className="monthly-summary__item-details">
                  <span className="monthly-summary__item-name">{payment.name}</span>
                  <span className="monthly-summary__item-date">{payment.date}</span>
                </div>
                <span className="monthly-summary__item-amount">₦{payment.amount}</span>
              </li>
            ))
          ) : (
            <li style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              No payments found for this period.
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MonthlySummary;
