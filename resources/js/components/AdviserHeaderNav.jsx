import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdviserHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/adviser/MySection") {
      return (
        location.pathname === "/adviser/MySection" ||
        location.pathname.startsWith("/adviser/section")
      );
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-danger px-3 shadow-sm">
      {/* Brand */}
      <span className="navbar-brand fw-bold">Adviser Panel</span>

      {/* Burger Menu */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adviserNavbar"
        aria-controls="adviserNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Links */}
      <div className="collapse navbar-collapse" id="adviserNavbar">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/adviser/home") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/adviser/home")}
            >
              Dashboard
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/adviser/MySection") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/adviser/MySection")}
            >
              My Section
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/adviser/my-schedule") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/adviser/my-schedule")}
            >
              My Schedule
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
