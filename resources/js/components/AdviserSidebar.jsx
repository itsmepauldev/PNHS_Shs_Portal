import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdviserSidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Updated isActive function
  const isActive = (path) => {
    if (path === '/adviser/announcement') {
      // Highlight Dashboard if on home or any manage section page
      return location.pathname === '/adviser/announcement' || location.pathname.startsWith('/adviser/section');
    }
    return location.pathname === path;
  };

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
      <h5 className="text-center">Adviser Panel</h5>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/adviser/announcement')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/adviser/announcement')}
          >
           Announcement
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start w-100 ${
              isActive('/adviser/my-schedule')
                ? 'bg-primary text-white fw-bold'
                : 'text-white'
            }`}
            onClick={() => handleNavigation('/adviser/my-schedule')}
          >
            My Schedule
          </button>
        </li>
        <li className="nav-item mt-4">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
