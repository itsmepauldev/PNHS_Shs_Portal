import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GuidanceHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-danger px-3 shadow-sm">
      {/* Brand */}
      <span className="navbar-brand fw-bold">Guidance Panel</span>

      {/* Burger Menu */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#guidanceNavbar"
        aria-controls="guidanceNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Links */}
      <div className="collapse navbar-collapse" id="guidanceNavbar">
        <ul className="navbar-nav ms-auto align-items-center">
          {/* Announcement */}
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/guidance/announcement")
                  ? "fw-bold text-light"
                  : "text-white-50"
              }`}
              onClick={() => handleNavigation("/guidance/announcement")}
            >
              Announcement
            </button>
          </li>

          {/* Violation */}
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/guidance/violation")
                  ? "fw-bold text-light"
                  : "text-white-50"
              }`}
              onClick={() => handleNavigation("/guidance/violation")}
            >
              Violation
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
