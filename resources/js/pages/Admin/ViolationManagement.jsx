import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import AdminLayout from "../../components/AdminLayout";

export default function ViolationManagement() {
  const [violations, setViolations] = useState([]);
  const [students, setStudents] = useState([]);
  const [offenseOptions, setOffenseOptions] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    violation_type: "",
    description: "",
    offense_level: "",
  });
  const [selectedViolationType, setSelectedViolationType] = useState(null);

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
    fetchViolations();
    fetchStudents();
  }, []);

  const fetchViolations = async () => {
    try {
      const res = await axios.get("/api/violations");
      setViolations(res.data);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/violations/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, student_id: studentId, offense_level: "" });
    setSelectedViolationType(null);
    setFormData((prev) => ({ ...prev, violation_type: "" }));

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

  const handleViolationTypeChange = (selectedOption) => {
    setSelectedViolationType(selectedOption);
    setFormData({ ...formData, violation_type: selectedOption ? selectedOption.value : "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/violations", formData);
      Swal.fire("Success", res.data.message, "success");
      setFormData({ student_id: "", violation_type: "", description: "", offense_level: "" });
      setSelectedViolationType(null);
      setOffenseOptions([]);
      fetchViolations();
      fetchStudents();
    } catch (error) {
      if (error.response?.status === 422) {
        Swal.fire(
          "Validation Error",
          Object.values(error.response.data.errors).flat().join("\n"),
          "error"
        );
      } else {
        Swal.fire("Error", error.response?.data?.error || "Server error", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the violation record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/violations/${id}`);
        Swal.fire("Deleted!", "Violation record removed.", "success");
        fetchViolations();
        fetchStudents();
      }
    });
  };

  // const handleEdit = (violation) => {
  //   Swal.fire({
  //     title: "Edit Violation",
  //     html: `
  //       <div class="form-group text-start">
  //         <label>Student</label>
  //         <select id="swal-student" class="form-control">
  //           <option value="">-- Select Student --</option>
  //           ${students.map(s => `<option value="${s.id}" ${s.id === violation.student_id ? "selected" : ""}>${s.name}</option>`).join("")}
  //         </select>
  //       </div>

  //       <div class="form-group text-start mt-2">
  //         <label>Violation Type</label>
  //         <select id="swal-violation" class="form-control">
  //           <option value="">-- Select Violation Type --</option>
  //           ${violationTypeOptions
  //             .map(group => `
  //               <optgroup label="${group.label}">
  //                 ${group.options.map(opt => `<option value="${opt.value}" ${opt.value === violation.violation_type ? "selected" : ""}>${opt.label}</option>`).join("")}
  //               </optgroup>
  //             `).join("")}
  //         </select>
  //       </div>

  //       <div class="form-group text-start mt-2">
  //         <label>Offense Level</label>
  //         <input id="swal-offense" class="form-control" value="${violation.offense_level}" readonly />
  //       </div>

  //       <div class="form-group text-start mt-2">
  //         <label>Description</label>
  //         <input id="swal-description" class="form-control" value="${violation.description}" />
  //       </div>
  //     `,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Update",
  //     preConfirm: () => {
  //       const student_id = document.getElementById("swal-student").value;
  //       const violation_type = document.getElementById("swal-violation").value;
  //       const offense_level = document.getElementById("swal-offense").value;
  //       const description = document.getElementById("swal-description").value;

  //       if (!student_id || !violation_type || !offense_level || !description) {
  //         Swal.showValidationMessage("⚠️ All fields are required!");
  //         return false;
  //       }

  //       return { student_id, violation_type, offense_level, description };
  //     },
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await axios.put(`/api/violations/${violation.id}`, result.value);
  //         Swal.fire("Updated!", "Violation updated successfully.", "success");
  //         fetchViolations();
  //       } catch (error) {
  //         Swal.fire("Error", error.response?.data?.error || "Server error", "error");
  //       }
  //     }
  //   });
  // };

const handleEdit = (violation) => {
  Swal.fire({
    title: "Edit Violation",
    html: `
      <div class="form-group text-start">
        <label>Student</label>
        <select id="swal-student" class="form-control" disabled>
          <option value="">-- Select Student --</option>
          ${students.map(s => `<option value="${s.id}" ${s.id === violation.student_id ? "selected" : ""}>${s.name}</option>`).join("")}
        </select>
        <!-- hidden input to send student_id since the select is disabled -->
        <input type="hidden" id="swal-student-hidden" name="student_id" value="${violation.student_id}" />
      </div>

      <div class="form-group text-start mt-2">
        <label>Violation Type</label>
        <select id="swal-violation" class="form-control">
          <option value="">-- Select Violation Type --</option>
          ${violationTypeOptions
            .map(group => `
              <optgroup label="${group.label}">
                ${group.options.map(opt => `<option value="${opt.value}" ${opt.value === violation.violation_type ? "selected" : ""}>${opt.label}</option>`).join("")}
              </optgroup>
            `).join("")}
        </select>
      </div>

      <div class="form-group text-start mt-2">
        <label>Offense Level</label>
        <input id="swal-offense" class="form-control" value="${violation.offense_level}" readonly />
      </div>

      <div class="form-group text-start mt-2">
        <label>Description</label>
        <input id="swal-description" class="form-control" value="${violation.description}" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update",
    preConfirm: () => {
      const student_id = document.getElementById("swal-student-hidden").value;
      const violation_type = document.getElementById("swal-violation").value;
      const offense_level = document.getElementById("swal-offense").value;
      const description = document.getElementById("swal-description").value;

      if (!student_id || !violation_type || !offense_level || !description) {
        Swal.showValidationMessage("⚠️ All fields are required!");
        return false;
      }

      return { student_id, violation_type, offense_level, description };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`/api/violations/${violation.id}`, result.value);
        Swal.fire("Updated!", "Violation updated successfully.", "success");
        fetchViolations();
      } catch (error) {
        Swal.fire("Error", error.response?.data?.error || "Server error", "error");
      }
    }
  });
};

  return (
    <AdminLayout>
      <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
        <h3 className="fw-bold text-danger mb-4">Violation Management</h3>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col-md-3">
              <label>Student</label>
              <select
                name="student_id"
                className="form-control"
                value={formData.student_id}
                onChange={handleStudentChange}
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>Violation Type</label>
              <Select
                options={violationTypeOptions}
                value={selectedViolationType}
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
                {offenseOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
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
            Add Violation
          </button>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-danger">
              <tr>
                <th>Student</th>
                <th>Violation Type</th>
                <th>Offense Level</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {violations.length > 0 ? (
                violations.map((v) => (
                  <tr key={v.id} className={v.offense_level === "3rd Warning" ? "table-danger" : ""}>
                    <td>{v.student?.name}</td>
                    <td>{v.violation_type}</td>
                    <td>{v.offense_level}</td>
                    <td>{v.description}</td>
                    <td className="text-center">
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        <button
                          onClick={() => handleEdit(v)}
                          className="btn btn-sm d-flex align-items-center gap-1 text-primary fw-bold text-uppercase"
                          style={{ background: 'transparent', border: 'none' }}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="btn btn-sm d-flex align-items-center gap-1 text-danger fw-bold text-uppercase"
                          style={{ background: 'transparent', border: 'none' }}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No violations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
