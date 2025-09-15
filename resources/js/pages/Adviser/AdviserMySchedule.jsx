import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdviserLayout from '../../components/AdviserLayout';
export default function MySchedule() {
  const [schedule, setSchedule] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const printRef = useRef();

  // Timeline logic
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
    if (user) {
      axios
        .get(`http://shs-portal.test/api/my-schedule/${user.id}`)
        .then((response) => setSchedule(response.data))
        .catch((error) => console.error('Error fetching schedule:', error));
    }
  }, [user]);

  const handlePrint = () => {
    if (schedule.length === 0) return; // ✅ prevent print if empty

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Restore UI after print
  };

  return (
    <AdviserLayout>
      <div className="container-fluid ">
   <h4 className="mb-3 fw-bold text-danger">My Schedule</h4>
        <div ref={printRef}>
          <p>
            <strong>Schedule for School Year:</strong> {schoolYear} | <strong>Semester:</strong> {semester}
          </p>

          {schedule.length === 0 ? (
            <p>No schedule assigned.</p>
          ) : (
           
<table className="table table-bordered table-hover bg-white">
            <thead className="table-danger">
                <tr>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.subject}</td>
                    <td>{entry.schedule?.section?.section_name || 'N/A'}</td>
                    <td>{entry.room}</td>
                    <td>{entry.day}</td>
                    <td>
                      {new Date(`1970-01-01T${entry.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(`1970-01-01T${entry.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center mb-3">
          <button 
            onClick={handlePrint} 
            className="btn btn-danger"
            disabled={schedule.length === 0} // ✅ disable if no schedule
          >
            Print Schedule
          </button>
        </div>
      </div>
    </AdviserLayout>
  );
}
