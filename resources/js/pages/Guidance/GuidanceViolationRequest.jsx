import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import AdminLayout from "../../components/GuidanceLayout";

export default function GuidanceRequests() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    violation_type: "",
    offense_level: "",
    description: "",
  });

  const [selectedViolationType, setSelectedViolationType] = useState(null);

  // Filters
  const [filterStudent, setFilterStudent] = useState("");
  const [filterViolationType, setFilterViolationType] = useState(null);
  const [filterOffense, setFilterOffense] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

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
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/violation-requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const openModal = (req) => {
    setSelectedRequest(req);
    setFormData({
      student_id: req.student_id,
      violation_type: req.violation_type,
      offense_level: req.offense_level,
      description: req.description,
    });

    // Set the react-select value based on existing value
    const selectedType = violationTypeOptions
      .flatMap(group => group.options)
      .find(opt => opt.value === req.violation_type) || null;
    setSelectedViolationType(selectedType);

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setFormData({
      student_id: "",
      violation_type: "",
      offense_level: "",
      description: "",
    });
    setSelectedViolationType(null);
  };

  const handleViolationTypeChange = (selectedOption) => {
    setSelectedViolationType(selectedOption);
    setFormData({ ...formData, violation_type: selectedOption ? selectedOption.value : "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDecline = async (reqId) => {
    try {
      await axios.put(`/api/violation-requests/${reqId}/declined`);
      Swal.fire("Declined", "Request has been declined", "info");
      fetchRequests();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not decline request", "error");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/violations", formData);
      await axios.put(`/api/violation-requests/${selectedRequest.id}/reviewed`);
      Swal.fire("Success", "Violation recorded & request marked reviewed", "success");
      closeModal();
      fetchRequests();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not record violation", "error");
    }
  };

  // Apply filters
  const filteredRequests = requests.filter((r) => {
    const matchStudent = filterStudent
      ? r.student?.name.toLowerCase().includes(filterStudent.toLowerCase())
      : true;
    const matchViolationType = filterViolationType
      ? r.violation_type === filterViolationType.value
      : true;
    const matchOffense = filterOffense ? r.offense_level === filterOffense : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchDate = filterDate
      ? new Date(r.created_at).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      : true;

    return matchStudent && matchViolationType && matchOffense && matchStatus && matchDate;
  });

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
        <div className="container-fluid p-3">
          <h3 className="fw-bold text-danger mb-4">Violation Requests</h3>

          {/* Filters */}
          <div className="row g-2 mb-3">
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Student"
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <Select
                options={violationTypeOptions}
                value={filterViolationType}
                onChange={setFilterViolationType}
                placeholder="Filter by Violation Type"
                isClearable
                classNamePrefix="react-select"
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterOffense}
                onChange={(e) => setFilterOffense(e.target.value)}
              >
                <option value="">All Offense Levels</option>
                <option value="1st Warning">1st Warning</option>
                <option value="2nd Warning">2nd Warning</option>
                <option value="3rd Warning">3rd Warning</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="declined">Rejected</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered bg-white">
              <thead className="table-danger">
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Violation</th>
                  <th>Offense</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((r, index) => (
                    <tr key={r.id}>
                      <td>{indexOfFirstRequest + index + 1}</td>
                      <td>{r.student?.name}</td>
                      <td>{r.violation_type}</td>
                      <td>{r.offense_level}</td>
                      <td>{r.description}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>{r.submitted_by?.name}</td>
                      <td>
                        {r.status === "pending" && <span className="badge bg-warning">Pending</span>}
                        {r.status === "reviewed" && <span className="badge bg-success">Reviewed</span>}
                        {r.status === "declined" && <span className="badge bg-danger">Rejected</span>}
                      </td>
                      <td>
                        {r.status === "pending" ? (
                          <>
                            <button className="btn btn-success btn-sm me-2" onClick={() => openModal(r)}>Record & Review</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDecline(r.id)}>Decline</button>
                          </>
                        ) : (
                          <span className="text-muted">No action</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination mb-0">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => changePage(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal show fade d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Record Violation</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label>Student</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedRequest?.student?.name || ""}
                        disabled
                      />
                    </div>
                    <div className="mb-2">
                      <label>Violation Type</label>
                      <Select
                        options={violationTypeOptions}
                        value={selectedViolationType}
                        onChange={handleViolationTypeChange}
                        placeholder="Select violation type"
                        isClearable
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Offense Level</label>
                      <input
                        type="text"
                        name="offense_level"
                        className="form-control"
                        value={formData.offense_level}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={closeModal} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-danger">
                      Save Violation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
