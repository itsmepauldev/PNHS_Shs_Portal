import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from './StudentLayout';

export default function StudentHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Auto-logout if user deleted
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await axios.get('http://shs-portal.test/api/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    };

    const interval = setInterval(checkUserStatus, 5000);
    checkUserStatus();

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <StudentLayout>
      <div className="container-fluid ">
        <h2 className="mb-3">Welcome, {user?.name || 'Student'}!</h2>
        <p className="lead text-muted">
          This is your student dashboard. Use the sidebar to navigate your schedule, violations, and document requests.
        </p>
      </div>
    </StudentLayout>
  );
}
