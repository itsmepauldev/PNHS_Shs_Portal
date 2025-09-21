import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeacherHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/teacher/announcement") {
      return (
        location.pathname === "/teacher/announcement" ||
        location.pathname.startsWith("/teacher/section")
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
      <span className="navbar-brand fw-bold">Teacher Panel</span>

      {/* Burger Menu */}
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
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/teacher/announcement") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/teacher/announcement")}
            >
              Announcement
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/teacher/schedule") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/teacher/schedule")}
            >
              My Schedule
            </button>
          </li>
           <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/teacher/mysubject") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/teacher/mysubject")}
            >
              My Subject
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link px-3 ${
                isActive("/teacher/violationreport") ? "fw-bold text-light" : "text-white-50"
              }`}
              onClick={() => handleNavigation("/teacher/violationreport")}
            >
              Violation Report
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
