import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark px-3">
      {/* Brand / Title */}
      <span className="navbar-brand">SHS Portal</span>

      {/* Burger (toggle) */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Collapsible Nav */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/admin/dashboard")
                  ? "fw-bold text-primary"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                (isActive("/admin/sections") || isActive("/admin/section"))
                  ? "fw-bold text-primary"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/sections")}
            >
              Section Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/admin/schedules")
                  ? "fw-bold text-primary"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/schedules")}
            >
              Class Schedule
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/admin/grades") ? "fw-bold text-primary" : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/grades")}
            >
              Grade Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/admin/violations")
                  ? "fw-bold text-primary"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/violations")}
            >
              Violation Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/admin/documents")
                  ? "fw-bold text-primary"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/documents")}
            >
              Document Requests
            </button>
          </li>

          {/* Logout */}
          <li className="nav-item">
            <button
              className="btn btn-outline-danger ms-md-3 mt-2 mt-md-0"
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
