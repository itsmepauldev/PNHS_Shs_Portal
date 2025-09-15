import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from '../../components/AdminLayout';

export default function ViewSchedule() {
  const location = useLocation();
  const navigate = useNavigate();
  const sectionId = location.state?.sectionId;

  const [entries, setEntries] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);

  const [formData, setFormData] = useState({
    day: '',
    subject: '',
    start_time: '',
    end_time: '',
    room: '',
    teacher_id: '',
  });

  const [teachers, setTeachers] = useState([]);
const [subjectTeachers, setSubjectTeachers] = useState([]);
  useEffect(() => {
    if (!sectionId) {
      console.error('Section ID not found in location.state');
      return;
    }
    fetchSchedule();
    fetchTeachers();
  }, [sectionId]);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`http://shs-portal.test/api/schedules/section/${sectionId}?full=1`);
      const schedule = res.data;
      setScheduleId(schedule.id);
      setEntries(schedule.entries ?? []);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

const fetchTeachers = async () => {
  try {
    const res = await axios.get(`http://shs-portal.test/api/sections/${sectionId}/subject-teachers`);
    setSubjectTeachers(res.data);
  } catch (error) {
    console.error('Error loading subject teachers:', error);
  }
};

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [editingEntry, setEditingEntry] = useState(null);

  // Start editing
const handleEdit = async (entry) => {
  // ✅ Filter out already used subjects (except the current entry's subject)
  const usedSubjects = entries
    .filter(e => e.id !== entry.id) // ignore current entry
    .map(e => e.subject);

  const availableSubjects = subjectTeachers.filter(st =>
    !usedSubjects.includes(st.subject) || st.subject === entry.subject
  );

  const subjectOptions = availableSubjects.map(st =>
    `<option value="${st.subject}" ${st.subject === entry.subject ? 'selected' : ''}>${st.subject}</option>`
  ).join('');

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    .map(day => `<option value="${day}" ${entry.day === day ? 'selected' : ''}>${day}</option>`)
    .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Edit Schedule Entry',
    html:
      '<div class="d-flex flex-column gap-2">' +
      // ✅ Subject dropdown (filtered like add form)
      `<select id="subject" class="swal2-input" style="margin: 0;" onchange="window.updateTeacherName(this.value)">` +
        `<option value="" disabled hidden>Select Subject</option>` +
        subjectOptions +
      `</select>` +

      // ✅ Teacher auto-filled (readonly)
      `<input id="teacher_name" class="swal2-input" placeholder="Teacher" value="${
        subjectTeachers.find(st => st.subject === entry.subject)?.teacher_name || ''
      }" readonly style="margin: 0; background-color: #f1f1f1;" />` +

      `<select id="day" class="swal2-input" style="margin: 0;">` +
        `<option value="" disabled hidden ${!entry.day ? 'selected' : ''}>Select Day</option>` +
        dayOptions +
      `</select>` +
      `<input id="start_time" type="time" class="swal2-input" value="${entry.start_time?.slice(0,5) || ''}" style="margin: 0;" />` +
      `<input id="end_time" type="time" class="swal2-input" value="${entry.end_time?.slice(0,5) || ''}" style="margin: 0;" />` +
      `<input id="room" class="swal2-input" placeholder="Room" value="${entry.room || ''}" style="margin: 0;" />` +
      '</div>',
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    focusConfirm: false,
    didOpen: () => {
      // ✅ Function to update teacher name automatically when subject changes
      window.updateTeacherName = (subject) => {
        const teacherField = document.getElementById('teacher_name');
        const selected = subjectTeachers.find(st => st.subject === subject);
        teacherField.value = selected ? selected.teacher_name : '';
      };
    },
    preConfirm: () => {
      const subject = document.getElementById('subject').value.trim();
      const teacher_id = subjectTeachers.find(st => st.subject === subject)?.teacher_id || '';
      const day = document.getElementById('day').value.trim();
      const start_time = document.getElementById('start_time').value.trim();
      const end_time = document.getElementById('end_time').value.trim();
      const room = document.getElementById('room').value.trim();

      if (!subject || !teacher_id || !day || !start_time || !end_time || !room) {
        Swal.showValidationMessage('All fields are required');
        return false;
      }

      return {
        subject,
        teacher_id,
        day,
        start_time,
        end_time,
        room,
        schedule_id: entry.schedule_id,
      };
    },
  });

  if (formValues) {
    try {
      await axios.put(`http://shs-portal.test/api/schedule-entries/${entry.id}`, formValues);
      Swal.fire('Updated!', 'Schedule has been updated.', 'success');
      fetchSchedule();
    } catch (err) {
      Swal.fire('Error!', err.response?.data?.error || 'Something went wrong', 'error');
    }
  }
};



  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This entry will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://shs-portal.test/api/schedule-entries/${id}`);
        fetchSchedule(); // Refresh
        Swal.fire('Deleted!', 'The entry has been deleted.', 'success');
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.fire('Error', 'Failed to delete entry.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await axios.put(`http://shs-portal.test/api/schedule-entries/${editingEntry.id}`, formData);
        Swal.fire('Success', 'Schedule updated!', 'success');
      } else {
        await axios.post('http://shs-portal.test/api/schedule-entries', {
          ...formData,
          schedule_id: scheduleId,
        });
        Swal.fire('Success', 'Schedule entry added!', 'success');
      }

      setFormData({
        day: '',
        start_time: '',
        end_time: '',
        teacher_id: '',
        subject: '',
        room: '',
      });

      setEditingEntry(null);
      fetchSchedule();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  return (
    <AdminLayout>
       <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
        <h3 className="fw-bold text-danger mb-4">View Schedule</h3>

        {/* Add Entry Form */}
        <form onSubmit={handleSubmit} className="card p-4 mb-5 shadow-sm">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Day</label>
              <select
                className="form-select"
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

          <div className="col-md-3">
  <label className="form-label">Subject</label>
  <select
  className="form-select"
  name="subject"
  value={formData.subject}
  onChange={(e) => {
    const selectedSubject = e.target.value;
    setFormData(prev => ({
      ...prev,
      subject: selectedSubject,
      teacher_id: subjectTeachers.find(st => st.subject === selectedSubject)?.teacher_id || ''
    }));
  }}
  required
>
  <option value="">Select Subject</option>
  {subjectTeachers
    // ✅ Filter out subjects already used in schedule
    .filter(st => !entries.some(entry => entry.subject === st.subject))
    .map((st) => (
      <option key={st.id} value={st.subject}>{st.subject}</option>
  ))}
</select>

</div>


            <div className="col-md-2">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Room</label>
              <input
                type="text"
                className="form-control"
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
              />
            </div>

           <div className="col-md-3">
  <label className="form-label">Teacher</label>
  <input
    type="text"
    className="form-control"
    value={subjectTeachers.find(st => st.subject === formData.subject)?.teacher_name || ''}
    readOnly
  />
</div>

          </div>

          <button type="submit" className="btn btn-danger mt-3">
            Add Entry
          </button>
        </form>

        {/* Schedule Table */}
        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold text-dark mb-3">Schedule Entries</h5>
          {entries.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover bg-white">
                <thead className="table-danger">
                  <tr>
                    <th>Subject</th>
                    <th>Room</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Teacher</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.subject}</td>
                      <td>{entry.room}</td>
                      <td>{entry.day}</td>
                      <td>
                        {new Date(`1970-01-01T${entry.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(`1970-01-01T${entry.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>{entry.teacher?.name || 'N/A'}</td>
                      <td className="text-center">
                        <div className="d-flex flex-wrap gap-1 justify-content-center">
                          <button
                            className="btn btn-sm d-flex align-items-center gap-1 text-primary fw-bold text-uppercase"
                            style={{ background: 'transparent', border: 'none' }}
                            onClick={() => handleEdit(entry)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            Edit
                          </button>

                          <button
                            className="btn btn-sm d-flex align-items-center gap-1 text-danger fw-bold text-uppercase"
                            style={{ background: 'transparent', border: 'none' }}
                            onClick={() => handleDelete(entry.id)}
                          >
                            <i className="bi bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
