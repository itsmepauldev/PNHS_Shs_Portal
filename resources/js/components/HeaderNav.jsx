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
    <nav className="navbar navbar-expand-md navbar-dark bg-danger px-3 shadow-sm">
      {/* Brand / Title */}
      <span className="navbar-brand fw-bold">SHS Portal</span>

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
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/dashboard") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/sections") || isActive("/admin/section")
                  ? "fw-bold text-light"
                  : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/sections")}
            >
              Sections
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/schedules") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/schedules")}
            >
              Schedule
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/grades") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/grades")}
            >
              Grades
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/violations") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/violations")}
            >
              Violations
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/admin/documents") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/admin/documents")}
            >
              Documents
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
