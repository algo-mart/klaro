import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './styles/theme.css';
import './styles/layout.css';

// Import components
import Navbar from './components/Navbar/Navbar';

// Import pages
import Dashboard from "./pages/Dashboard";
import Attendance from './pages/Attendance';
import Payment from './pages/Payment';
import Signin from "./pages/Signin";
import Monthly from './pages/Monthly';
import Addparticipants from './pages/Addparticipants';

// Page Title Component
const PageTitle = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/attendance':
        return 'Meeting Attendance';
      case '/payment':
        return 'Daily Payment Entry';
      case '/signin':
        return 'Sign In';
      case '/monthly':
        return 'Monthly Review';
      case '/addparticipants':
        return 'Add New Participants';
      default:
        return 'Dashboard';
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

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/attendance', name: 'Attendance', icon: '📋' },
    { path: '/payment', name: 'Daily Payment', icon: '💳' },
    { path: '/signin', name: 'Sign In', icon: '🔐' },
    { path: '/monthly', name: 'Monthly Review', icon: '📅' },
    { path: '/addparticipants', name: 'Add New Participants', icon: '👥' }
  ];

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Overlay */}
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={handleOverlayClick}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="logo-container">
            <img src="/logo.png" alt="klaro logo" />
            <h1 style={{ marginLeft: '12px', fontSize: '1.5rem', fontWeight: '600' }}>KLARO</h1>
          </div>

          <nav className="nav-menu">
            {navLinks.map(({ path, name, icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={handleNavLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="icon">{icon}</span>
                <span className="text">{name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Navbar />
          <PageTitle />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/addparticipants" element={<Addparticipants />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
