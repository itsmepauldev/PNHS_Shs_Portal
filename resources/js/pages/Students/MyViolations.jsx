import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout'; 

export default function MyViolations() {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/'); // redirect if no user
      return;
    }
    const fetchViolations = async () => {
      try {
        const res = await axios.get(`/api/violations/student/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setViolations(res.data);
      } catch (error) {
        console.error('Error fetching violations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [user, navigate]);

  // if (loading) return <p>Loading your violations...</p>;

  return (
    <StudentLayout>
         <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
      <h2 className='fw-bold text-danger'>My Violations</h2>
      {violations.length === 0 ? (
        <p>You have no violations recorded.</p>
      ) : (
       <table className="table table-bordered table-hover bg-white">
            <thead className="table-danger">
            <tr>
              <th>Violation Type</th>
              <th>Offense Level</th>
              <th>Description</th>
              <th>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id} className={v.offense_level === "3rd Warning" ? "table-danger" : ""}>
                <td>{v.violation_type}</td>
                <td>{v.offense_level}</td>
                <td>{v.description}</td>
                <td>{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
   </div>
    </div>
    </StudentLayout>
  );
}
