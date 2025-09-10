import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '../AdminLayout'; // Your layout wrapper

export default function ManageSection() {
  const { id } = useParams();
  const navigate = useNavigate();
const [students, setStudents] = useState([]);

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [subjectTeachers, setSubjectTeachers] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('teachers');

  const itemsPerPage = 10;
  const [currentPageTeachers, setCurrentPageTeachers] = useState(1);
  const [currentPageStudents, setCurrentPageStudents] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Error', 'You are not logged in.', 'error');
          navigate('/login');
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [sectionRes, userRes, subTeacherRes, studentRes] = await Promise.all([
          axios.get(`/api/sections/${id}`, config),
          axios.get(`/api/users`, config),
          axios.get(`/api/sections/${id}/subject-teachers`, config),
          axios.get(`/api/sections/${id}/students`, config),
        ]);

        setSection(sectionRes.data);
        setAllUsers(userRes.data.users);
        setSubjectTeachers(subTeacherRes.data);
        setEnrolledStudents(studentRes.data);
      } catch (err) {
        console.error('API Error:', err.response?.data || err.message);
        Swal.fire('Error', 'Access denied or failed to load data.', 'error');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://shs-portal.test/api/students'); // or your correct endpoint
    setStudents(res.data); // or however you're storing your students
  } catch (err) {
    console.error('Failed to fetch students:', err);
  }
};

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

  const changePageTeachers = (page) => setCurrentPageTeachers(page);
  const changePageStudents = (page) => setCurrentPageStudents(page);

  const handleAssignTeacher = async () => {
  const teacherOptions = allUsers
     .filter(user => user.role === 'teacher' || user.role === 'adviser')
  .map(user => `<option value="${user.id}">${user.name} (${user.role})</option>`)
  .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Assign Subject Teacher',
    html: `
      <div class="d-flex flex-column gap-2">
        <select id="swal-teacher" class="swal2-input" style="margin: 0; color: #6c757d;"
          onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">
          <option value="" disabled selected hidden>Select Teacher</option>
          ${teacherOptions}
        </select>
        <input id="swal-subject" class="swal2-input" placeholder="Enter Subject" style="margin: 0;" />
      </div>`,
    showCancelButton: true,
    confirmButtonText: 'Assign',
    focusConfirm: false,
    didOpen: () => {
      const teacherSelect = document.getElementById('swal-teacher');
      teacherSelect.style.color = teacherSelect.value === '' ? '#6c757d' : '#212529';
      teacherSelect.addEventListener('change', function () {
        this.style.color = this.value === '' ? '#6c757d' : '#212529';
      });
    },
    preConfirm: () => {
      const teacherId = document.getElementById('swal-teacher').value;
      const subject = document.getElementById('swal-subject').value.trim();
      if (!teacherId || !subject) {
        Swal.showValidationMessage('All fields are required.');
        return false;
      }
      return { teacher_id: teacherId, subject };
    },
  });

  if (formValues) {
    try {
      await axios.post(`/api/sections/${id}/assign-subject-teacher`, formValues, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updated = await axios.get(`/api/sections/${id}/subject-teachers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubjectTeachers(updated.data);
      setCurrentPageTeachers(1);
      Swal.fire('Success', 'Teacher assigned.', 'success');
    } catch {
      Swal.fire('Error', 'Assignment failed.', 'error');
    }
  }
};


const handleAddStudent = async () => {
  const availableStudents = allUsers
    .filter(user => user.role === 'student' && !user.section_id);

  if (availableStudents.length === 0) {
    Swal.fire('No Available Students', 'All students are already assigned.', 'info');
    return;
  }

  const studentOptions = availableStudents
    .map(student => `<option value="${student.id}">${student.name}</option>`)
    .join('');

  const { value: studentId } = await Swal.fire({
    title: 'Add Student to Section',
    html: `
      <select id="swal-student" style="
        height: 2.75em;
        padding: 0 1em;
        font-size: 1.125em;
        border: 1px solid #d9d9d9;
        border-radius: 0.25em;
        color: #6c757d;
        background: white;
        width: 100%;
        box-sizing: border-box;
      ">
        <option value="" disabled selected hidden>Select Student</option>
        ${studentOptions}
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: 'Add',
    focusConfirm: false,
    didOpen: () => {
      const studentSelect = document.getElementById('swal-student');
      studentSelect.addEventListener('change', function () {
        this.style.color = this.value === '' ? '#6c757d' : '#212529';
      });
    },
    preConfirm: () => {
      const id = document.getElementById('swal-student').value;
      if (!id) {
        Swal.showValidationMessage('Please select a student.');
        return false;
      }
      return id;
    },
  });

  if (studentId) {
    try {
      await axios.post(`/api/sections/${id}/add-student`, {
        student_id: studentId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updated = await axios.get(`/api/sections/${id}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEnrolledStudents(updated.data);
      setCurrentPageStudents(1);
      Swal.fire('Success', 'Student added.', 'success');
    } catch {
      Swal.fire('Error', 'Could not add student.', 'error');
    }
  }
};

const handleEdit = async (user) => {
  const student = user.student || {};

  const { value: formValues } = await Swal.fire({
    title: 'Edit Student',
    html:
      '<div class="d-flex flex-column gap-2">' +
      `<input id="swal-name" class="swal2-input" value="${user.name || ''}" placeholder="Student Name" style="margin: 0;" />` +
      `<input id="swal-email" class="swal2-input" value="${user.email || ''}" placeholder="Email" style="margin: 0;" />` +
      `<input id="swal-lrn" class="swal2-input" type="number" value="${student.lrn || ''}" placeholder="LRN" style="margin: 0;" />` +
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
    focusConfirm: false,
    didOpen: () => {
      // Apply initial color logic for select
      const genderSelect = document.getElementById('swal-gender');
      genderSelect.style.color = genderSelect.value === '' ? '#6c757d' : '#212529';

      genderSelect.addEventListener('change', function () {
        this.style.color = this.value === '' ? '#6c757d' : '#212529';
      });
    },
    preConfirm: () => {
      const name = document.getElementById('swal-name').value.trim();
      const email = document.getElementById('swal-email').value.trim();
      const gender = document.getElementById('swal-gender').value;
      const age = document.getElementById('swal-age').value;
      const address = document.getElementById('swal-address').value.trim();
      const contact = document.getElementById('swal-contact').value.trim();
      const emergency = document.getElementById('swal-emergency').value.trim();
      const lrn = document.getElementById('swal-lrn').value;

      if (!name || !email || !gender || !age || !address || !contact || !emergency || !lrn) {
        Swal.showValidationMessage('All fields are required');
        return false;
      }

      return {
        name,
        email,
        student: {
          gender,
          age,
          lrn,
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
                    gender: formValues.student.gender,
                    age: formValues.student.age,
                    lrn: formValues.student.lrn,
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








  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <AdminLayout>
    <div className="container-fluid mt-4 px-3">
        <h3>Manage Section: {section.section_name}</h3>
        <p><strong>Grade:</strong> {section.grade_level} | <strong>Strand:</strong> {section.strand}</p>

        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={handleAssignTeacher}>➕ Add Subject Teacher</button>
          <button className="btn btn-success" onClick={handleAddStudent}>➕ Add Student</button>
        </div>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Subject Teachers</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students</button>
          </li>
        </ul>

        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0">
              <thead className="table-dark">
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
                      <td colSpan="3" className="text-center">No subject teachers yet.</td>
                    </tr>
                  )
                ) : (
                  paginatedStudents.length > 0 ? (
                    paginatedStudents.map((s, index) => (
                    <tr key={s.id}>
  <td>{(currentPageStudents - 1) * itemsPerPage + index + 1}</td>
  {/* <td>{`${s.student?.first_name ?? s.name} ${s.student?.middle_name ?? ''} ${s.student?.last_name ?? ''}` }</td> */}
<td>{s.name}</td>
  <td>{s.email}</td>
  <td>{s.student?.lrn || '--'}</td>
   <td>{s.student?.gender || '--'}</td>
  <td>{s.student?.age || '--'}</td>
  <td>{s.student?.home_address || '--'}</td>
  <td>{s.student?.contact_number || '--'}</td>
  <td>
  {s.student?.emergency_phone || '--'}
</td>
<td>
  <button 
    className="btn btn-sm btn-primary me-2"
    onClick={() => handleEdit(s)}
  >
    Edit
  </button>
 

<button onClick={() => handleRemoveFromSection(s.id)} className="btn btn-sm btn-danger">
  Remove
</button>



</td>

</tr>


                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No students enrolled.</td>
                    </tr>
                  )
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>

        {activeTab === 'teachers' && totalPagesTeachers > 1 && (
          <Pagination page={currentPageTeachers} total={totalPagesTeachers} onChange={changePageTeachers} />
        )}
        {activeTab === 'students' && totalPagesStudents > 1 && (
          <Pagination page={currentPageStudents} total={totalPagesStudents} onChange={changePageStudents} />
        )}

        
      </div>
    </AdminLayout>
  );
}

function Pagination({ page, total, onChange }) {
  return (
    <div className="d-flex justify-content-center mt-3">
      <nav>
        <ul className="pagination mb-0">
          {Array.from({ length: total }, (_, i) => (
            <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onChange(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
