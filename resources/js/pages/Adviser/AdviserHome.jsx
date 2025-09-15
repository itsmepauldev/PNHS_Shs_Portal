// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import echo from '../echo'; // 👈 Make sure this exists and is correctly configured
// import AdviserLayout from './AdviserLayout';

// export default function AdviserHome() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
//   const [sections, setSections] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loadingSections, setLoadingSections] = useState(true);
//   const [loadingSubjects, setLoadingSubjects] = useState(true);

//   // 🔁 Fetch sections assigned to this adviser
//   const fetchSections = async () => {
//     setLoadingSections(true);
//     try {
//       const res = await axios.get('http://shs-portal.test/api/adviser/sections', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setSections(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//       setSections([]);
//     } finally {
//       setLoadingSections(false);
//     }
//   };

//   // 🔁 Fetch subject assignments (if adviser is also teaching subjects)
//   const fetchSubjects = async () => {
//     setLoadingSubjects(true);
//     try {
//       const res = await axios.get('http://shs-portal.test/api/teacher/subjects', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setSubjects(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       setSubjects([]);
//     } finally {
//       setLoadingSubjects(false);
//     }
//   };

//   // ✅ Auth + Realtime user check
//   useEffect(() => {
//     const checkUserStatus = async () => {
//       try {
//         const res = await axios.get('http://shs-portal.test/api/me', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         localStorage.setItem('user', JSON.stringify(res.data));
//         setUser(res.data);
//       } catch (error) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/');
//       }
//     };

//     checkUserStatus();
//   }, [navigate]);

//   // ✅ Fetch section + subjects + Echo subscription
//   useEffect(() => {
//     fetchSections();
//     fetchSubjects();

//     if (user?.id) {
//       const channel = echo.private(`adviser.${user.id}`);

//       channel.listen('.SectionAssigned', (event) => {
//         console.log('📦 Received new section via broadcast:', event.section);
//         setSections((prev) => {
//           const exists = prev.some((s) => s.id === event.section.id);
//           return exists ? prev : [...prev, event.section];
//         });
//       });

//       return () => {
//         echo.leave(`adviser.${user.id}`);
//       };
//     }
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   return (
//     <AdviserLayout>
//       <div    className="container-fluid ">

//         <h2 className="mb-3">Welcome, {user?.name || 'Adviser'}!</h2>
//         <p className="lead text-muted">This is your Adviser dashboard.</p>

//         {/* 🔥 Assigned Sections */}
//         <h4 className="mt-4">Assigned Sections</h4>
//         {loadingSections ? (
//           <div className="text-center w-100 py-5">
//             <div className="spinner-border text-primary" role="status" />
//           </div>
//         ) : sections.length === 0 ? (
//           <div className="alert alert-info">No sections assigned yet.</div>
//         ) : (
//           <div className="row mt-3">
//             {sections.map((section, index) => (
//               <div className="col-md-4 mb-3" key={index}>
//                 <div className="card shadow-sm h-100">
//                   <div className="card-body">
//                     <h5 className="card-title">{section.section_name}</h5>
//                     <p className="card-text">
//                       <strong>Grade:</strong> {section.grade_level}<br />
//                       <strong>Strand:</strong> {section.strand}
//                     </p>
//                     <button
//                       className="btn btn-success"
//                       onClick={() => navigate(`/adviser/section/${section.id}`)}
//                     >
//                       Manage Section
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 📘 Assigned Subjects if adviser is also teaching */}
//         <h4 className="mt-5">Assigned Subjects</h4>
//         {loadingSubjects ? (
//           <div className="text-center w-100 py-5">
//             <div className="spinner-border text-primary" role="status" />
//           </div>
//         ) : subjects.length === 0 ? (
//           <div className="alert alert-warning">You are not assigned to any subjects yet.</div>
//         ) : (
//           <div className="row mt-3">
//             {subjects.map((item, index) => (
//               <div className="col-md-4 mb-3" key={index}>
//                 <div className="card shadow-sm h-100">
//                   <div className="card-body">
//                     <h5 className="card-title">{item.subject}</h5>
//                     <p className="card-text">
//                       <strong>Section:</strong> {item.section.section_name}<br />
//                       <strong>Grade:</strong> {item.section.grade_level}<br />
//                       <strong>Strand:</strong> {item.section.strand}
//                     </p>
//                     <button
//                       className="btn btn-primary"
//                       onClick={() =>
//                         navigate(`/teacher/section/${item.section.id}/subject/${item.subject}`)
//                       }
//                     >
//                       Manage Grades
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 🔐 Logout Button */}
       
//       </div>
//     </AdviserLayout>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import echo from '../../echo'; // 👈 Make sure this exists and is correctly configured
import AdviserLayout from '../../components/AdviserLayout';
// ...keep the same imports

export default function AdviserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const res = await axios.get("http://shs-portal.test/api/teacher/subjects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await axios.get("http://shs-portal.test/api/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    checkUserStatus();
    fetchSubjects();
  }, [navigate]);

  return (
    <AdviserLayout>
      <div className="container-fluid">
        <h2 className="mb-3 fw-bold text-danger">Welcome, {user?.name || "Adviser"}!</h2>
        <p className="lead text-muted">This is your Adviser dashboard.</p>

        {/* 📘 Assigned Subjects */}
        <h4 className="mt-5 fw-bold text-danger">Assigned Subjects</h4>
        {loadingSubjects ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="alert alert-warning">
            You are not assigned to any subjects yet.
          </div>
        ) : (
          <div className="row mt-3">
            {subjects.map((item, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.subject}</h5>
                    <p className="card-text">
                      <strong>Section:</strong> {item.section.section_name}
                      <br />
                      <strong>Grade:</strong> {item.section.grade_level}
                      <br />
                      <strong>Strand:</strong> {item.section.strand}
                    </p>
                   <button className="btn btn-secondary" disabled>
                    Manage Grades (Coming Soon)
                  </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdviserLayout>
  );
}
