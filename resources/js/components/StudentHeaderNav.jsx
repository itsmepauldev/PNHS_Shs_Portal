import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudentHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-danger px-3 shadow-sm">
      {/* Brand / Title */}
      <span className="navbar-brand fw-bold">Student Panel</span>

      {/* Burger Menu */}
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

      {/* Links */}
      <div className="collapse navbar-collapse" id="studentNavbar">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/student/home") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/student/home")}
            >
              Home
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/my-schedule") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/my-schedule")}
            >
              My Schedule
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/my-violations") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/my-violations")}
            >
              My Violations
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/student/grades") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/student/grades")}
            >
              Grades
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/student/documents") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/student/documents")}
            >
              Request Documents
            </button>
          </li>

          {/* Logout */}
          <li className="nav-item ms-md-3">
            <button
              className="btn btn-light btn-sm fw-semibold px-3 py-1 mt-2 mt-md-0"
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
