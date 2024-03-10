import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard";
import Addparticipants from "./pages/Addparticipants";
import Payment from "./pages/Payment";
import Monthly from "./pages/Monthly";
import Attendance from "./pages/Attendance";
import Signin from "./pages/Signin";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addparticipants" element={<Addparticipants />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
