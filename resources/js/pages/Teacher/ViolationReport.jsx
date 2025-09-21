import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import AdminLayout from "../../components/TeacherLayout"; // change if needed

export default function TeacherViolationRequest() {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [offenseOptions, setOffenseOptions] = useState([]);

  const [formData, setFormData] = useState({
    student_id: "",
    violation_type: "",
    offense_level: "",
    description: "",
  });

  // 🟢 Use same grouped options as Guidance
 const violationTypeOptions = [
    {
      label: "General Violations",
      options: [
        { value: "Bringing Cellphone (unauthorized use)", label: "Bringing Cellphone (unauthorized use)" },
        { value: "Cutting Classes", label: "Cutting Classes" },
        { value: "Late", label: "Late" },
      ],
    },
    {
      label: "Conduct Violations",
      options: [
        { value: "No Proper Uniform", label: "No Proper Uniform" },
        { value: "No ID", label: "No ID" },
        { value: "Unauthorized Piercing / Earrings", label: "Unauthorized Piercing / Earrings" },
        { value: "Wearing Prohibited Accessories (spiked rings, metal buckles)", label: "Wearing Prohibited Accessories (spiked rings, metal buckles)" },
        { value: "Bringing Weapons (knife, gun, etc.)", label: "Bringing Weapons (knife, gun, etc.)" },
        { value: "Vandalism", label: "Vandalism" },
        { value: "Smoking / Vaping", label: "Smoking / Vaping" },
        { value: "Destroying School Property", label: "Destroying School Property (chairs, windows, doors, lights, etc.)" },
        { value: "Drinking Alcohol / Intoxication", label: "Drinking Alcohol / Intoxication" },
        { value: "Drug Use / Possession", label: "Drug Use / Possession" },
        { value: "Gambling", label: "Gambling" },
        { value: "Indecent Act / Lewd Behavior", label: "Indecent Act / Lewd Behavior" },
        { value: "Using Another ID", label: "Using Another ID" },
        { value: "Not Returning Borrowed Materials", label: "Not Returning Borrowed Materials (books, lab, library)" },
        { value: "Stealing", label: "Stealing" },
        { value: "Forgery / Falsification of School Records", label: "Forgery / Falsification of School Records" },
        { value: "Cheating in Exams / Quizzes", label: "Cheating in Exams / Quizzes" },
      ],
    },
    {
      label: "Rights of Others Violations",
      options: [
        { value: "Fighting / Challenging Others", label: "Fighting / Challenging Others" },
        { value: "Bullying", label: "Bullying (verbal, psychological, physical, cyber)" },
        { value: "Sexual Harassment / Sexual Misconduct", label: "Sexual Harassment / Sexual Misconduct" },
        { value: "Joining Gang / Fraternity / Sorority", label: "Joining Gang / Fraternity / Sorority" },
      ],
    },
    {
      label: "Honor of the School Violations",
      options: [
        { value: "Misuse of School Name / Tarnishing Reputation", label: "Misuse of School Name / Tarnishing Reputation" },
      ],
    },
  ];
  useEffect(() => {
    fetchRequests();
    fetchStudents();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/violation-requests/my");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/violations/students");
      setStudents(res.data);
      setStudentOptions(
        res.data.map((s) => ({
          value: s.id,
          label: s.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // 🟢 Automatically suggest offense level
  const handleStudentChange = async (selectedOption) => {
    setSelectedStudent(selectedOption);
    const studentId = selectedOption ? selectedOption.value : "";
    setFormData({ ...formData, student_id: studentId, offense_level: "" });

    if (!studentId) {
      setOffenseOptions([]);
      return;
    }

    try {
      const res = await axios.get(`/api/violations/student/${studentId}/last-offense`);
      const lastOffense = res.data.last_offense;

      if (!lastOffense) setOffenseOptions(["1st Warning"]);
      else if (lastOffense === "1st Warning") setOffenseOptions(["2nd Warning"]);
      else if (lastOffense === "2nd Warning") setOffenseOptions(["3rd Warning"]);
      else if (lastOffense === "3rd Warning") setOffenseOptions([]);
    } catch (error) {
      console.error("Error fetching last offense:", error);
    }
  };

  const handleViolationTypeChange = (opt) => {
    setFormData({ ...formData, violation_type: opt?.value || "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/violation-requests", formData);
      Swal.fire("Success", "Request sent to Guidance.", "success");
      setFormData({ student_id: "", violation_type: "", offense_level: "", description: "" });
      setSelectedStudent(null);
      setOffenseOptions([]);
      fetchRequests();
    } catch (error) {
      Swal.fire("Error", "Could not send request", "error");
    }
  };

  return (
    <AdminLayout>
      <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
        <div className="container-fluid p-3">
          <h3 className="fw-bold text-danger mb-4">Submit Violation Request</h3>

          {/* 🟢 Request Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-2">
              <div className="col-md-3">
                <label>Student</label>
                <Select
                  options={studentOptions}
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  placeholder="Search or select student"
                  isClearable
                  classNamePrefix="react-select"
                />
              </div>

              <div className="col-md-3">
                <label>Violation Type</label>
                <Select
                  options={violationTypeOptions}
                  onChange={handleViolationTypeChange}
                  placeholder="Select or search violation type"
                  isClearable
                  classNamePrefix="react-select"
                />
              </div>

              <div className="col-md-3">
                <label>Offense Level</label>
                <select
                  name="offense_level"
                  className="form-control"
                  value={formData.offense_level}
                  onChange={handleChange}
                  required
                  disabled={offenseOptions.length === 0}
                >
                  <option value="">-- Select Warning --</option>
                  {offenseOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-danger mt-3">
              Send Request
            </button>
          </form>

          {/* 🟢 My Requests Table */}
          <h5 className="fw-bold">My Requests</h5>
          <div className="table-responsive">
            <table className="table table-bordered bg-white">
              <thead className="table-danger">
                <tr>
                  <th>Student</th>
                  <th>Violation</th>
                  <th>Offense</th>
                  <th>Description</th>
                    <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.student?.name}</td>
                      <td>{r.violation_type}</td>
                      <td>{r.offense_level}</td>
                      <td>{r.description}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                         <td>
                        {r.status === "pending" && <span className="badge bg-warning">Pending</span>}
                        {r.status === "reviewed" && <span className="badge bg-success">Reviewed</span>}
                        {r.status === "declined" && <span className="badge bg-danger">Rejected</span>}
                      </td>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center">No requests yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
