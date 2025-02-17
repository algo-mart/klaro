import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles/theme.css";
import "./styles/layout.css";

// Import React Icons
import { MdDashboard, MdPayment, MdAdd, MdLogout, MdReceipt } from "react-icons/md";
import { BiCalendarCheck } from "react-icons/bi";
import { IoStatsChartSharp } from "react-icons/io5";
import { BsCalendarEvent } from "react-icons/bs";

// Import components
import Navbar from "./components/Navbar/Navbar";

// Import pages
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Payment from "./pages/Payment";
import Monthly from "./pages/Monthly";
import Addparticipants from "./pages/Addparticipants";
import Login from "./pages/Login";
import Events from "./pages/Events";
import PaymentRecords from "./pages/paymentrecords.js";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated() ? children : <Navigate to="/" state={{ from: location }} replace />;
};

// Page Title Component
const PageTitle = () => {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/attendance": "Meeting Attendance",
    "/payment": "Daily Payment Entry",
    "/monthly": "Monthly Review",
    "/addparticipants": "Add New Participants",
    "/events": "Events",
    "/paymentrecords": "Payment Records",
  };

  return (
    <div className="page-header">
      <h1 className="page-title">{pageTitles[location.pathname] || ""}</h1>
    </div>
  );
};

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) JSON.parse(storedUser);
    } catch {
      console.error("Invalid stored user data, clearing...");
      localStorage.removeItem("user");
    }
  }, []);

  const navLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <MdDashboard size={24} /> },
    { path: "/attendance", name: "Attendance", icon: <BiCalendarCheck size={24} /> },
    { path: "/payment", name: "Daily Payment", icon: <MdPayment size={24} /> },
    { path: "/monthly", name: "Monthly Review", icon: <IoStatsChartSharp size={24} /> },
    { path: "/events", name: "Events", icon: <BsCalendarEvent size={24} /> },
    { path: "/addparticipants", name: "Add Participants", icon: <MdAdd size={24} /> },
    { path: "/paymentrecords", name: "Payment Records", icon: <MdReceipt size={24} /> },
  ];

  return (
    <div className="app-container">
      {isAuthenticated() && !isLoginPage && (
        <>
          {/* Mobile Menu Button */}
          <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          </button>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

          {/* Sidebar */}
          <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
            <div className="logo-container">
              <h1>KLARO</h1>
            </div>
            <nav className="nav-menu">
              {navLinks.map(({ path, name, icon }) => (
                <NavLink key={path} to={path} onClick={() => setIsMobileMenuOpen(false)} className="nav-link">
                  <span className="icon">{icon}</span>
                  <span className="text">{name}</span>
                </NavLink>
              ))}
              <button onClick={logout} className="nav-link logout-button">
                <span className="icon">
                  <MdLogout size={24} />
                </span>
                <span className="text">Logout</span>
              </button>
            </nav>
          </aside>
        </>
      )}

      <main className={`main-content ${!isAuthenticated() || isLoginPage ? "full-width" : ""}`}>
        {isAuthenticated() && !isLoginPage && (
          <>
            <Navbar />
            <PageTitle />
          </>
        )}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/monthly" element={<ProtectedRoute><Monthly /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/addparticipants" element={<ProtectedRoute><Addparticipants /></ProtectedRoute>} />
            <Route path="/paymentrecords" element={<ProtectedRoute><PaymentRecords /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
