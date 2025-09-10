import React from 'react';
import { FaBars } from 'react-icons/fa';

export default function Header({ onToggleSidebar }) {
  return (
    <nav className="navbar bg-light shadow-sm px-3 py-2 fixed-top d-flex justify-content-between align-items-center">
      {/* Burger icon (small devices only) */}
      <button
        className="btn btn-outline-dark d-md-none"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Portal name or logo */}
      <span className="fw-bold">SHS Portal</span>
    </nav>
  );
}
