import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TeacherLayout from './TeacherLayout';

export default function MySchedule() {
  const [entries, setEntries] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // assuming teacher is logged in
  const printRef = useRef();

  // ✅ Timeline logic (determine school year + semester)
  const getCurrentTimeline = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    let semester;
    let schoolYear;

    if (month > 6 || (month === 6 && day >= 16)) {
      semester = '1st';
      schoolYear = `${year}-${year + 1}`;
    } else {
      semester = '2nd';
      schoolYear = `${year - 1}-${year}`;
    }

    return { semester, schoolYear };
  };

  const { semester, schoolYear } = getCurrentTimeline();

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://shs-portal.test/api/my-schedule/${user.id}`)
        .then((res) => {
          setEntries(res.data);
        })
        .catch((err) => {
          console.error('Error fetching schedule:', err);
        });
    }
  }, []);

  // ✅ Print handler
  const handlePrint = () => {
    if (entries.length === 0) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // ✅ restore UI after print
  };

  return (
    <TeacherLayout>
      <div className="container-fluid ">
        <h4 className="mb-3">My Schedule</h4>

    

        <div ref={printRef}>
          <p>
            <strong>School Year:</strong> {schoolYear} | <strong>Semester:</strong> {semester}
          </p>

          {entries.length === 0 ? (
            <p>No schedule assigned yet.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.subject}</td>
                    <td>{entry.schedule.section.section_name}</td>
                    <td>{entry.room}</td>
                    <td>{entry.day}</td>
                    <td>
                      {new Date(`1970-01-01T${entry.start_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(`1970-01-01T${entry.end_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
            {/* ✅ Print button (hidden in print view) */}
        <div className="d-flex justify-content-end align-items-center mb-3 d-print-none">
          <button
            className="btn btn-primary"
            onClick={handlePrint}
            disabled={entries.length === 0}
          >
            🖨️ Print Schedule
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
}
