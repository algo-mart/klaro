import React, { useState } from "react";

const PaymentRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
    { id: 1, name: "John Doe", amount: "$100", date: "2025-01-01" },
    { id: 2, name: "Jane Smith", amount: "$200", date: "2025-01-05" },
    { id: 3, name: "Alice Johnson", amount: "$150", date: "2025-01-10" },
  ]);

  const handleDelete = (id) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Payment Records</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%", border: "1px solid #ccc", borderRadius: "5px" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f9f9f9", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Amount</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id} style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{record.name}</td>
              <td style={{ padding: "10px" }}>{record.amount}</td>
              <td style={{ padding: "10px" }}>{record.date}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => alert("Edit functionality not implemented yet")}
                  style={{
                    padding: "5px 10px",
                    marginRight: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRecords;
