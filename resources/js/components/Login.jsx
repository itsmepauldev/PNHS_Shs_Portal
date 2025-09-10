import React, { useState, useEffect } from 'react';  
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://shs-portal.test/api/login', form);
      const { access_token, user } = res.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      if (user.role === 'admin') {
  navigate('/admin/dashboard');
}else if (user.must_reset_password) {
  if (user.role === 'student') navigate('/student/info');
  else if (user.role === 'teacher') navigate('/teacher/info');
  else if (user.role === 'adviser') navigate('/teacher/info');
} else if (user.role === 'teacher') {
  navigate('/teacher/home');
} else if (user.role === 'adviser') {
  navigate('/adviser/home');
} else if (user.role === 'student') {
  navigate('/student/home');
}


    } catch (err) {
      setMessage('Invalid email or password.');
    }
  };

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    if (user.role === 'admin') navigate('/admin/dashboard');
    // else if ((user.role === 'teacher' || user.role === 'student' || user.role === 'adviser') && user.must_reset_password) {
    //   navigate('/reset-password');} 
      else if (user.must_reset_password) {
  if (user.role === 'student') navigate('/student/info');
  else if (user.role === 'teacher') navigate('/teacher/info');
  else if (user.role === 'adviser') navigate('/teacher/info');

} 
      else if (user.role === 'teacher') navigate('/teacher/home');
    else if (user.role === 'adviser') navigate('/adviser/home');
    else if (user.role === 'student') navigate('/student/home');
  }
}, [location]);

  return (
    <div className="d-flex flex-column vh-100 bg-white text-dark">
      <div className="d-flex flex-grow-1">
        <div className="d-none d-md-flex flex-column justify-content-center align-items-start p-5 w-50 bg-light">
          <h1 className="fw-bold mb-2" style={{ color: '#b91c1c' }}>Polong National High School</h1>
          <p className="fs-5 text-secondary">
            A gateway for SHS Students and Teachers. Log in to access announcements, grades, classes, and more.
          </p>
        </div>

        <div className="d-flex justify-content-center align-items-center w-100 w-md-50">
          <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
            <h4 className="mb-4 text-center" style={{ color: '#dc2626' }}>Sign in to your account</h4>

            {message && <div className="alert alert-danger text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#dc2626' }}>
                Sign in
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
