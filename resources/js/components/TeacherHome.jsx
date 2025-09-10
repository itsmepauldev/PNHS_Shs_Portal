import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherLayout from './TeacherLayout';

export default function TeacherHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // ✅ Auto-logout if user is deleted
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

  // ✅ Fetch assigned subjects with section
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await axios.get('http://shs-portal.test/api/teacher/subjects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSubjects(res.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <TeacherLayout>
    <div className="container-fluid ">

      <h2 className="mb-3">Welcome, {user?.name || 'Teacher'}!</h2>
      <p className="lead text-muted">This is your Teacher dashboard.</p>

      <div className="mt-4">
        <h4 className="mb-3">Assigned Subjects</h4>

        {loadingSubjects ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="alert alert-info">You have no assigned subjects yet.</div>
        ) : (
          <div className="row mt-3">
            {subjects.map((item, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.subject}</h5>
                    <p className="card-text">
                      <strong>Section:</strong> {item.section.section_name} <br />
                      <strong>Grade:</strong> {item.section.grade_level} <br />
                      <strong>Strand:</strong> {item.section.strand}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/teacher/section/${item.section.id}/subject/${item.subject}`)}
                    >
                      Manage Grades
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
    </TeacherLayout>
  );
}
