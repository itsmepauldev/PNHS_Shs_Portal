import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudentHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark px-3"
      style={{ backgroundColor: "rgba(220, 53, 69, 0.8)" }} // transparent red
    >
      {/* Brand */}
      <span className="navbar-brand fw-bold">Student Panel</span>

      {/* Burger button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#studentNavbar"
        aria-controls="studentNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Nav Links */}
      <div className="collapse navbar-collapse" id="studentNavbar">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/student/home") ? "fw-bold text-warning" : "text-white"
              }`}
              onClick={() => handleNavigation("/student/home")}
            >
              Home
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/my-schedule") ? "fw-bold text-warning" : "text-white"
              }`}
              onClick={() => handleNavigation("/my-schedule")}
            >
              My Schedule
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/my-violations") ? "fw-bold text-warning" : "text-white"
              }`}
              onClick={() => handleNavigation("/my-violations")}
            >
              My Violation
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/student/documents") ? "fw-bold text-warning" : "text-white"
              }`}
              onClick={() => handleNavigation("/student/documents")}
            >
              Request Documents
            </button>
          </li>

          {/* Logout */}
          <li className="nav-item">
            <button
              className="btn btn-light text-danger ms-md-3 mt-2 mt-md-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
