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
import { MdDashboard, MdPayment, MdAdd, MdLogout } from "react-icons/md";
import { BiCalendarCheck } from "react-icons/bi";
import { IoStatsChartSharp } from "react-icons/io5";

// Import components
import Navbar from "./components/Navbar/Navbar";

// Import pages
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Payment from "./pages/Payment";
import Signin from "./pages/Signin";
import Monthly from "./pages/Monthly";
import Addparticipants from "./pages/Addparticipants";
import Login from "./pages/Login";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Page Title Component
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
      case "/signin":
        return "Sign In";
      case "/monthly":
        return "Monthly Review";
      case "/addparticipants":
        return "Add New Participants";
      default:
        return "";
    }
  };

  return (
    <div className="page-header">
      <h1 className="page-title">
        <span className="title-icon">📄</span>
        {getPageTitle()}
      </h1>
    </div>
  );
};

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isLoginPage =
    location.pathname === "/" || location.pathname === "/login";

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

  // Close mobile menu when clicking outside
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <MdDashboard size={24} /> },
    {
      path: "/attendance",
      name: "Attendance",
      icon: <BiCalendarCheck size={24} />,
    },
    { path: "/payment", name: "Daily Payment", icon: <MdPayment size={24} /> },
    {
      path: "/monthly",
      name: "Monthly Review",
      icon: <IoStatsChartSharp size={24} />,
    },
    {
      path: "/addparticipants",
      name: "Add Participants",
      icon: <MdAdd size={24} />,
    },
  ];

  return (
    <div className="app-container">
      {isAuthenticated() && !isLoginPage && (
        <>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Mobile Overlay */}
          <div
            className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}
            onClick={handleOverlayClick}
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
      <main
        className={`main-content ${!isAuthenticated() || isLoginPage ? "full-width" : ""}`}
      >
        {isAuthenticated() && !isLoginPage && (
          <>
            <Navbar />
            <PageTitle />
          </>
        )}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Login />} />
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
              path="/signin"
              element={
                <ProtectedRoute>
                  <Signin />
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
              path="/addparticipants"
              element={
                <ProtectedRoute>
                  <Addparticipants />
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
