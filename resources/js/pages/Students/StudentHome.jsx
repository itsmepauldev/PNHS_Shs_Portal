// StudentHome.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout'; 
export default function StudentHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (loading) return null; // prevent rendering before user loaded

  return (
    <StudentLayout user={user}>
      <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
        <div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
          <h2 className="mb-3">Welcome, {user?.name || 'Student'}!</h2>
          <p className="lead text-muted">
            This is your student dashboard. Use the sidebar to navigate your schedule, violations, and document requests.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
