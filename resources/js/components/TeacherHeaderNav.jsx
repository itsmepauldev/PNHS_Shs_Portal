import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeacherHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/teacher/home") {
      return (
        location.pathname === "/teacher/home" ||
        location.pathname.startsWith("/teacher/section")
      );
    }
    return location.pathname === path;
  };

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
      <span className="navbar-brand fw-bold">Teacher Panel</span>

      {/* Burger */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#teacherNavbar"
        aria-controls="teacherNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Links */}
      <div className="collapse navbar-collapse" id="teacherNavbar">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/teacher/home") ? "fw-bold text-warning" : "text-white"
              }`}
              onClick={() => handleNavigation("/teacher/home")}
            >
              Dashboard
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/teacher/schedule")
                  ? "fw-bold text-warning"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/teacher/schedule")}
            >
              My Schedule
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
