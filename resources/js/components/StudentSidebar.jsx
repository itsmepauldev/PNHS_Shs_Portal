import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function StudentSidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
      <h5 className="text-center">Student Panel</h5>
      <ul className="nav flex-column mt-4">

        {/* My Schedule */}
         <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/student/home')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/student/home')}
          >
          Home
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/my-schedule')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/my-schedule')}
          >
            My Schedule
          </button>
        </li>

        {/* My Violation */}
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/my-violations')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/my-violations')}
          >
            My Violation
          </button>
        </li>

        {/* Request Documents */}
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/student/documents')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/student/documents')}
          >
            Request Documents
          </button>
        </li>

        {/* Logout */}
        <li className="nav-item mt-4">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
