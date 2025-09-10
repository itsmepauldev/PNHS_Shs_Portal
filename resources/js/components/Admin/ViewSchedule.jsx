import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '../AdminLayout';
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
      // const res = await axios.get(`http://shs-portal.test/api/schedules/section/${sectionId}`);
      const res = await axios.get(`http://shs-portal.test/api/schedules/section/${sectionId}?full=1`);

      const schedule = res.data;
      console.log('📦 Schedule fetched:', schedule);

      setScheduleId(schedule.id);
      setEntries(schedule.entries ?? []);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`http://shs-portal.test/api/sections/${sectionId}/teachers`);
      setTeachers(res.data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const [editingEntry, setEditingEntry] = useState(null);

// Start editing
const handleEdit = async (entry) => {
  const teacherOptions = teachers.map(t => 
    `<option value="${t.id}" ${t.id === entry.teacher_id ? 'selected' : ''}>${t.name}</option>`
  ).join('');

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    .map(day => `<option value="${day}" ${entry.day === day ? 'selected' : ''}>${day}</option>`)
    .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Edit Schedule Entry',
    html:
      '<div class="d-flex flex-column gap-2">' +
      `<input id="subject" class="swal2-input" placeholder="Subject" value="${entry.subject || ''}" style="margin: 0;" />` +
      `<select id="day" class="swal2-input" style="margin: 0; color: #6c757d;" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
        `<option value="" disabled hidden ${!entry.day ? 'selected' : ''}>Select Day</option>` +
        dayOptions +
      `</select>` +
      `<input id="start_time" type="time" class="swal2-input" value="${entry.start_time?.slice(0,5) || ''}" style="margin: 0;" />` +
      `<input id="end_time" type="time" class="swal2-input" value="${entry.end_time?.slice(0,5) || ''}" style="margin: 0;" />` +
      `<input id="room" class="swal2-input" placeholder="Room" value="${entry.room || ''}" style="margin: 0;" />` +
      `<select id="teacher_id" class="swal2-input" style="margin: 0; color: #6c757d;" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
      `<option value="" disabled hidden>Select Teacher</option>` +
      teacherOptions +
      `</select>` +
      '</div>',
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    focusConfirm: false,
    didOpen: () => {
      const daySelect = document.getElementById('day');
      const teacherSelect = document.getElementById('teacher_id');
      daySelect.style.color = daySelect.value === '' ? '#6c757d' : '#212529';
      teacherSelect.style.color = teacherSelect.value === '' ? '#6c757d' : '#212529';
    },
    preConfirm: () => {
      const subject = document.getElementById('subject').value.trim();
      const day = document.getElementById('day').value.trim();
      const start_time = document.getElementById('start_time').value.trim();
      const end_time = document.getElementById('end_time').value.trim();
      const room = document.getElementById('room').value.trim();
      const teacher_id = document.getElementById('teacher_id').value.trim();

      if (!subject || !day || !start_time || !end_time || !room || !teacher_id) {
        Swal.showValidationMessage('All fields are required');
        return false;
      }

      return {
        subject,
        day,
        start_time,
        end_time,
        room,
        teacher_id,
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
      // Update
      await axios.put(`http://shs-portal.test/api/schedule-entries/${editingEntry.id}`, formData);
      Swal.fire('Success', 'Schedule updated!', 'success');
    } else {
      // Create
      await axios.post('http://shs-portal.test/api/schedule-entries', {
        ...formData,
        schedule_id: scheduleId, // ✅ Use scheduleId here
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

   <div className="container-fluid mt-4 px-3">
      <h2 className="mb-4">View Schedule</h2>

      <form onSubmit={handleSubmit} className="card p-4 mb-5">
        <div className="row">
          <div className="col-md-2 mb-3">
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

          <div className="col-md-3 mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-2 mb-3">
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

          <div className="col-md-2 mb-3">
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

          <div className="col-md-2 mb-3">
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

          <div className="col-md-3 mb-3">
            <label className="form-label">Teacher</label>
            <select
              className="form-select"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-2">Add Entry</button>
      </form>

      <div className="card p-4">
        <h4>Schedule Entries</h4>
        {entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Room</th>
                <th>Day</th>
                <th>Time</th>
                <th>Teacher</th>
                <th>Action</th>
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
                    <td>
      <button className="btn btn-sm btn-primary me-1" onClick={() => handleEdit(entry)}>
        Edit
      </button>
      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry.id)}>
        Delete
      </button>
    </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
