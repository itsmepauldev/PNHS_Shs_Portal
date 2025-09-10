import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdviserHeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fix isActive logic
  const isActive = (path) => {
    if (path === "/adviser/MySection") {
      // Highlight My Section if on /MySection OR /section/:id
      return (
        location.pathname === "/adviser/MySection" ||
        location.pathname.startsWith("/adviser/section")
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
      <span className="navbar-brand fw-bold">Adviser Panel</span>

      {/* Burger */}
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
        <ul className="navbar-nav ms-auto">
          {/* Dashboard */}
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/adviser/home")
                  ? "fw-bold text-warning"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/adviser/home")}
            >
              Dashboard
            </button>
          </li>

          {/* My Section */}
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/adviser/MySection")
                  ? "fw-bold text-warning"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/adviser/MySection")}
            >
              My Section
            </button>
          </li>

          {/* My Schedule */}
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link ${
                isActive("/adviser/my-schedule")
                  ? "fw-bold text-warning"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/adviser/my-schedule")}
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
