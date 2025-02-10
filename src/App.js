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
import MonthlySummary from "./pages/monthlysummary.js"; // New Monthly Summary page
import Addparticipants from "./pages/Addparticipants";
import Login from "./pages/Login";
import Events from "./pages/Events";
import PaymentRecords from "./pages/paymentrecords.js"; // Ensure PaymentRecords is exported correctly

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

// Page Title Component (updated to remove any extra icon)
const PageTitle = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/attendance":
        return "Meeting Attendance";
      case "/payment":
        return "Daily Payment Entry";
      case "/monthly":
        return "Monthly Review";
      case "/monthlysummary":
        return "Monthly Summary";
      case "/addparticipants":
        return "Add New Participants";
      case "/events":
        return "Events";
      case "/paymentrecords":
        return "Payment Records";
      default:
        return "";
    }
  };

  return (
    <div className="page-header">
      <h1 className="page-title">{getPageTitle()}</h1>
    </div>
  );
};

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Define login page if the pathname is "/" or "/login"
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        JSON.parse(storedUser);
      } catch (error) {
        console.error("Invalid stored user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside or on a nav link
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <MdDashboard size={24} /> },
    { path: "/attendance", name: "Attendance", icon: <BiCalendarCheck size={24} /> },
    { path: "/payment", name: "Daily Payment", icon: <MdPayment size={24} /> },
    { path: "/monthly", name: "Monthly Review", icon: <IoStatsChartSharp size={24} /> },
    { path: "/monthlysummary", name: "Monthly Summary", icon: <IoStatsChartSharp size={24} /> },
    { path: "/events", name: "Events", icon: <BsCalendarEvent size={24} /> },
    { path: "/addparticipants", name: "Add Participants", icon: <MdAdd size={24} /> },
    { path: "/paymentrecords", name: "Payment Records", icon: <MdReceipt size={24} /> },
  ];

  return (
    <div className="app-container">
      {/* Render Sidebar and Mobile Menu only if user is logged in and not on the login page */}
      {isAuthenticated() && !isLoginPage && (
        <>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          </button>

          {/* Mobile Overlay */}
          <button
            className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}
            onClick={handleOverlayClick}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleOverlayClick();
              }
            }}
            aria-label="Close menu"
            aria-expanded={isMobileMenuOpen}
            type="button"
          />

          {/* Sidebar */}
          <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
            <div className="logo-container">
              <h1>KLARO</h1>
            </div>

            <nav className="nav-menu">
              {navLinks.map(({ path, name, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="icon">{icon}</span>
                  <span className="text">{name}</span>
                </NavLink>
              ))}
              <button onClick={handleLogout} className="nav-link logout-button">
                <span className="icon">
                  <MdLogout size={24} />
                </span>
                <span className="text">Logout</span>
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={`main-content ${!isAuthenticated() || isLoginPage ? "full-width" : ""}`}>
        {/* Render Navbar and PageTitle only if user is logged in and not on the login page */}
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly"
              element={
                <ProtectedRoute>
                  <Monthly />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthlysummary"
              element={
                <ProtectedRoute>
                  <MonthlySummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addparticipants"
              element={
                <ProtectedRoute>
                  <Addparticipants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paymentrecords"
              element={
                <ProtectedRoute>
                  <PaymentRecords />
                </ProtectedRoute>
              }
            />
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
