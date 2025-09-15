// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import StudentLayout from './StudentLayout';

// export default function StudentSchedule() {
//   const [schedule, setSchedule] = useState([]);
//   const printRef = useRef();

//   // Timeline logic
//   const getCurrentTimeline = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();

//     let semester;
//     let schoolYear;

//     if (month > 6 || (month === 6 && day >= 16)) {
//       semester = '1st';
//       schoolYear = `${year}-${year + 1}`;
//     } else {
//       semester = '2nd';
//       schoolYear = `${year - 1}-${year}`;
//     }

//     return { semester, schoolYear };
//   };

//   const { semester, schoolYear } = getCurrentTimeline();

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const response = await axios.get('http://shs-portal.test/api/student/schedule', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setSchedule(response.data);
//       } catch (error) {
//         console.error('Error fetching schedule:', error);
//       }
//     };
//     fetchSchedule();
//   }, []);

//   const handlePrint = () => {
//     if (!printRef.current) return;

//     const printContents = printRef.current.innerHTML;
//     const originalContents = document.body.innerHTML;

//     // Replace body content with only the schedule
//     document.body.innerHTML = printContents;

//     window.print();

//     // Restore original body content
//     document.body.innerHTML = originalContents;
//     window.location.reload(); // optional, to restore React state/UI
//   };

//   return (
//     <StudentLayout>
//       <div className="container-fluid "> 
//         <h2>Student Schedule</h2>

//         <div ref={printRef}>
//           <p>
//             <strong>School Year:</strong> {schoolYear} | <strong>Semester:</strong> {semester}
//           </p>

//           {schedule.length === 0 ? (
//             <p>No schedule assigned or still loading...</p>
//           ) : (
//             <table className="table table-bordered table-striped">
//               <thead className="thead-dark">
//                 <tr>
//                   <th>Subject</th>
//                   <th>Section</th>
//                   <th>Room</th>
//                   <th>Day</th>
//                   <th>Time</th>
//                   <th>Teacher</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {schedule.map((scheduleItem, i) =>
//                   scheduleItem.entries.map((entry, j) => (
//                     <tr key={`${i}-${j}`}>
//                       <td>{entry.subject || 'N/A'}</td>
//                       <td>{schedule[0].section.section_name}</td>
//                       <td>{entry.room || 'N/A'}</td>
//                       <td>{entry.day || 'N/A'}</td>
//                       <td>
//                         {new Date(`1970-01-01T${entry.start_time}`).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}{' '}
//                         -{' '}
//                         {new Date(`1970-01-01T${entry.end_time}`).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                       </td>
//                       <td>{entry.teacher?.name || 'N/A'}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//           <div className="d-flex justify-content-end align-items-center mb-3">
//           <button 
//             onClick={handlePrint} 
//             className="btn btn-primary"
//             disabled={schedule.length === 0} // ✅ disable if no schedule
//           >
//             Print Schedule
//           </button>
//         </div>
//       </div>
//     </StudentLayout>
//   );
// }
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout'; 
export default function StudentSchedule() {
  const [schedule, setSchedule] = useState([]);
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
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          'http://shs-portal.test/api/student/schedule',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchSchedule();
  }, []);

  // ✅ Check if there are any schedule entries at all
  const hasSchedule =
    schedule.length > 0 &&
    schedule.some((s) => s.entries && s.entries.length > 0);

  const handlePrint = () => {
    if (!printRef.current || !hasSchedule) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    // Replace body content with only the schedule
    document.body.innerHTML = printContents;

    window.print();

    // Restore original body content
    document.body.innerHTML = originalContents;
    window.location.reload(); // optional, to restore React state/UI
  };

  return (
    <StudentLayout>
             <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
        <div className="container-fluid p-3" style={{ backgroundColor: "#f3f3f3" }}>
        <h2 className='fw-bold text-danger'>Student Schedule</h2>

        <div ref={printRef}>
          <p>
            <strong>School Year:</strong> {schoolYear} |{' '}
            <strong>Semester:</strong> {semester}
          </p>

          {!hasSchedule ? (
            <p>No schedule assigned or still loading...</p>
          ) : (
            <table className="table table-bordered table-hover bg-white">
            <thead className="table-danger">

                <tr>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((scheduleItem, i) =>
                  scheduleItem.entries?.map((entry, j) => (
                    <tr key={`${i}-${j}`}>
                      <td>{entry.subject || 'N/A'}</td>
                      <td>{scheduleItem.section?.section_name || 'N/A'}</td>
                      <td>{entry.room || 'N/A'}</td>
                      <td>{entry.day || 'N/A'}</td>
                      <td>
                        {new Date(
                          `1970-01-01T${entry.start_time}`
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(
                          `1970-01-01T${entry.end_time}`
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>{entry.teacher?.name || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            onClick={handlePrint}
            className="btn btn-danger"
            disabled={!hasSchedule} // ✅ disable if no schedule entries
          >
            Print Schedule
          </button>
        </div>
        </div>
      </div>
      </div>
    </StudentLayout>
  );
}
