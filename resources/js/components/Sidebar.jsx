import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigation = (path) => {
    navigate(path);
    setCollapsed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div
      className={`position-fixed bg-dark text-white p-3 h-100 ${
        collapsed ? 'd-none d-md-block' : ''
      }`}
      style={{ width: '250px', zIndex: 999 }}
    >
      <h5 className="text-center">SHS Portal</h5>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              isActive('/admin/dashboard') ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/dashboard')}
          >
             Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              (isActive('/admin/sections') || isActive('/admin/section')) ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/sections')}
          >
             Section Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              isActive('/admin/schedules') ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/schedules')}
          >
             Class Schedule
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              isActive('/admin/grades') ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/grades')}
          >
             Grade Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              isActive('/admin/violations') ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/violations')}
          >
             Violation Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 text-white ${
              isActive('/admin/documents') ? 'bg-primary fw-bold' : ''
            }`}
            onClick={() => handleNavigation('/admin/documents')}
          >
         Document Requests
          </button>
        </li>

        {/* ✅ Logout Button at Bottom */}
        <li className="nav-item mt-4">
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
