import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    await axios.post(`http://shs-portal.test/api/reset-password`, { password });

    // ✅ Update local user state (remove must_reset_password flag)
    const updatedUser = { ...user, must_reset_password: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // ✅ Redirect based on role
    if (user.role === 'admin') navigate('/admin/dashboard');
    else if (user.role === 'teacher') navigate('/teacher/home');
    else if (user.role === 'adviser') navigate('/adviser/home');
    else if (user.role === 'student') navigate('/student/home');
  } catch (err) {
    Swal.fire('Error', 'Failed to reset password.', 'error');
  }
};


  const handleCancel = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="d-flex flex-column vh-100 bg-white text-dark">
      <div className="d-flex flex-grow-1">
        {/* Left Branding */}
        <div className="d-none d-md-flex flex-column justify-content-center align-items-start p-5 w-50 bg-light">
          <h1 className="fw-bold mb-2" style={{ color: '#b91c1c' }}>NC School Portal</h1>
          <p className="fs-5 text-secondary">
            You are required to update your password before continuing.
          </p>
        </div>

        {/* Reset Form Section */}
        <div className="d-flex justify-content-center align-items-center w-100 w-md-50">
          <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
            <h4 className="mb-4 text-center" style={{ color: '#dc2626' }}>Reset Password</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn w-100 text-white mb-2" style={{ backgroundColor: '#dc2626' }}>
                Submit
              </button>

              {/* Cancel Button Below */}
              <button type="button" className="btn btn-outline-secondary w-100" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="text-center py-3 border-top bg-white small text-muted">
        © 2025 NC Portal | Powered by Laravel + React + MySQL | Developed by SHS IT Team
      </footer>
    </div>
  );
}
