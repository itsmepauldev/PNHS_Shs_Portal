import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdviserLayout from '../../components/AdviserLayout';
export default function AdviserManageSection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [subjectTeachers, setSubjectTeachers] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  const [activeTab, setActiveTab] = useState('teachers');

  // Pagination config and state
  const itemsPerPage = 10;
  const [currentPageTeachers, setCurrentPageTeachers] = useState(1);
  const [currentPageStudents, setCurrentPageStudents] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const sectionRes = await axios.get(`http://shs-portal.test/api/sections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSection(sectionRes.data);

        const userRes = await axios.get(`http://shs-portal.test/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(userRes.data.users);

        const subTeacherRes = await axios.get(`http://shs-portal.test/api/sections/${id}/subject-teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjectTeachers(subTeacherRes.data);

        const studentRes = await axios.get(`http://shs-portal.test/api/sections/${id}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledStudents(studentRes.data);
      } catch (err) {
        console.error(err);
        navigate('/adviser');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Pagination calculations
  const totalPagesTeachers = Math.ceil(subjectTeachers.length / itemsPerPage);
  const totalPagesStudents = Math.ceil(enrolledStudents.length / itemsPerPage);

  const paginatedTeachers = subjectTeachers.slice(
    (currentPageTeachers - 1) * itemsPerPage,
    currentPageTeachers * itemsPerPage
  );

  const paginatedStudents = enrolledStudents.slice(
    (currentPageStudents - 1) * itemsPerPage,
    currentPageStudents * itemsPerPage
  );

  const changePageTeachers = (page) => {
    setCurrentPageTeachers(page);
  };

  const changePageStudents = (page) => {
    setCurrentPageStudents(page);
  };



  // ✅ Edit Student (with LRN)
  const handleEdit = async (user) => {
    const student = user.student || {};

    const { value: formValues } = await Swal.fire({
      title: 'Edit Student',
      html:
        '<div class="d-flex flex-column gap-2">' +
        `<input id="swal-name" class="swal2-input" value="${user.name || ''}" placeholder="Student Name" style="margin: 0;" />` +
        `<input id="swal-email" class="swal2-input" value="${user.email || ''}" placeholder="Email" style="margin: 0;" />` +
        `<input id="swal-lrn" class="swal2-input" value="${student.lrn || ''}" placeholder="LRN" style="margin: 0;" />` +
        `<select id="swal-gender" class="swal2-input" style="margin: 0; color: ${student.gender ? '#212529' : '#6c757d'};" onchange="this.style.color = this.value === '' ? '#6c757d' : '#212529'">` +
          `<option value="" disabled hidden ${!student.gender ? 'selected' : ''}>Select Gender</option>` +
          `<option value="male" ${student.gender === 'male' ? 'selected' : ''}>Male</option>` +
          `<option value="female" ${student.gender === 'female' ? 'selected' : ''}>Female</option>` +
        '</select>' +
        `<input id="swal-age" class="swal2-input" type="number" value="${student.age || ''}" placeholder="Age" style="margin: 0;" />` +
        `<input id="swal-address" class="swal2-input" value="${student.home_address || ''}" placeholder="Address" style="margin: 0;" />` +
        `<input id="swal-contact" class="swal2-input" value="${student.contact_number || ''}" placeholder="Contact Number" style="margin: 0;" />` +
        `<input id="swal-emergency" class="swal2-input" value="${student.emergency_phone || ''}" placeholder="Emergency Contact" style="margin: 0;" />` +
        '</div>',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const lrn = document.getElementById('swal-lrn').value.trim();
        const gender = document.getElementById('swal-gender').value;
        const age = document.getElementById('swal-age').value;
        const address = document.getElementById('swal-address').value.trim();
        const contact = document.getElementById('swal-contact').value.trim();
        const emergency = document.getElementById('swal-emergency').value.trim();

        if (!name || !email || !lrn || !gender || !age || !address || !contact || !emergency) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }

        return {
          name,
          email,
          student: {
            lrn,
            gender,
            age,
            address,
            contact_number: contact,
            emergency_contact: emergency,
          },
        };
      },
    });

    if (formValues) {
      try {
        const response = await axios.put(`http://shs-portal.test/api/students/${user.id}`, formValues);

        if (response.status === 200 || response.status === 204) {
          setEnrolledStudents((prev) =>
            prev.map((s) =>
              s.id === user.id
                ? {
                    ...s,
                    name: formValues.name,
                    email: formValues.email,
                    student: {
                      ...s.student,
                      lrn: formValues.student.lrn,
                      gender: formValues.student.gender,
                      age: formValues.student.age,
                      home_address: formValues.student.address,
                      contact_number: formValues.student.contact_number,
                      emergency_phone: formValues.student.emergency_contact,
                    },
                  }
                : s
            )
          );
          Swal.fire('Updated!', 'Student info updated successfully.', 'success');
        } else {
          Swal.fire('Error', 'Update failed', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Update failed', 'error');
      }
    }
  };

  // ✅ Remove from Section
  const handleRemoveFromSection = async (studentId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the student from the section.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, remove',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.put(`http://shs-portal.test/api/section/remove-student/${studentId}`);
        setEnrolledStudents((prev) => prev.filter((s) => s.id !== studentId));
        Swal.fire('Removed!', res.data.message || 'Student removed from section.', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Failed to remove student from section.', 'error');
      }
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <AdviserLayout>
       <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
        <h3 className="fw-bold text-danger mb-3">Manage Section: {section.section_name}</h3>
        <p>
          <strong>Grade:</strong> {section.grade_level} | <strong>Strand:</strong> {section.strand}
        </p>

     

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              Subject Teachers
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
          </li>
        </ul>

        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive mb-0">
              <table className="table table-bordered table-hover mb-0">
                <thead className="table-danger">
                  <tr>
                    <th>#</th>
                    {activeTab === 'teachers' ? (
                      <>
                        <th>Teacher Name</th>
                        <th>Subject</th>
                      </>
                    ) : (
                      <>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>LRN</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Emergency Contact</th>
                        <th>Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'teachers' ? (
                    paginatedTeachers.length > 0 ? (
                      paginatedTeachers.map((t, index) => (
                        <tr key={t.id}>
                          <td>{(currentPageTeachers - 1) * itemsPerPage + index + 1}</td>
                          <td>{t.teacher_name}</td>
                          <td>{t.subject.charAt(0).toUpperCase() + t.subject.slice(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No subject teachers yet.
                        </td>
                      </tr>
                    )
                  ) : paginatedStudents.length > 0 ? (
                    paginatedStudents.map((s, index) => (
                      <tr key={s.id}>
                        <td>{(currentPageStudents - 1) * itemsPerPage + index + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.student?.lrn || 'No Data Yet'}</td>
                        <td>{s.student?.gender || 'No Data Yet'}</td>
                        <td>{s.student?.age || 'No Data Yet'}</td>
                        <td>{s.student?.home_address || 'No Data Yet'}</td>
                        <td>{s.student?.contact_number || 'No Data Yet'}</td>
                        <td>{s.student?.emergency_phone || 'No Data Yet'}</td>
                       <td className="text-center">
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                          <button
  className="btn btn-sm d-flex align-items-center gap-1 text-primary fw-bold text-uppercase"style={{ background: 'transparent', border: 'none' }}
                            onClick={() => handleEdit(s)}
                          >
                             <i className="bi bi-pencil-square"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveFromSection(s.id)}
 className="btn btn-sm d-flex align-items-center gap-1 text-danger fw-bold text-uppercase"
    style={{ background: 'transparent', border: 'none' }}                          >
                             <i className="bi bi-trash"></i>
                            Remove
                          </button>
                            </div>
                        </td>
                      
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No students enrolled.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination for Teachers */}
        {activeTab === 'teachers' && totalPagesTeachers > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination mb-0">
                {Array.from({ length: totalPagesTeachers }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPageTeachers === index + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => changePageTeachers(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Pagination for Students */}
        {activeTab === 'students' && totalPagesStudents > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination mb-0">
                {Array.from({ length: totalPagesStudents }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPageStudents === index + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => changePageStudents(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
      </div>
    </AdviserLayout>
  );
}
