import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };
  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          KIBOU
        </NavLink>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link" onClick={closeMenuOnMobile}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/Payment"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Payment
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/Addparticipants"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Add Participant
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/Monthly"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Monthly Summary
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/Attendance"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Attendance
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/Signin" className="nav__link nav__cta">
                LOG OUT
              </NavLink>
            </li>
          </ul>
          <button className="nav__close" id="nav-close" onClick={toggleMenu}>
            <IoClose />
          </button>
        </div>

        <button className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <IoMenu />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
