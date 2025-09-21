import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import AdminLayout from "../../components/AdminLayout";

export default function AdminViolations() {
  const [violations, setViolations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const violationsPerPage = 10;

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
  }, []);

  const fetchViolations = async () => {
    try {
      const res = await axios.get("/api/violations");
      setViolations(res.data);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };

  // Filtered and paginated data
  const filteredViolations = violations.filter((v) => {
    const violationDate = new Date(v.created_at).toISOString().split("T")[0];

    const matchesSearch =
      v.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      v.violation_type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType ? v.violation_type === filterType.value : true;
    const matchesLevel = filterLevel ? v.offense_level === filterLevel : true;
    const matchesDate =
      (!filterStartDate || violationDate >= filterStartDate) &&
      (!filterEndDate || violationDate <= filterEndDate);

    return matchesSearch && matchesType && matchesLevel && matchesDate;
  });

  const indexOfLastViolation = currentPage * violationsPerPage;
  const indexOfFirstViolation = indexOfLastViolation - violationsPerPage;
  const currentViolations = filteredViolations.slice(indexOfFirstViolation, indexOfLastViolation);
  const totalPages = Math.ceil(filteredViolations.length / violationsPerPage);

  return (
    <AdminLayout>
      <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
        <div className="container-fluid p-3">
          <h3 className="fw-bold text-danger mb-4">Student Violations</h3>

          {/* Filters */}
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by student, violation, or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <Select
                options={violationTypeOptions}
                value={filterType}
                onChange={setFilterType}
                placeholder="Filter by Violation Type"
                isClearable
                classNamePrefix="react-select"
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">Filter by Offense Level</option>
                <option value="1st Warning">1st Warning</option>
                <option value="2nd Warning">2nd Warning</option>
                <option value="3rd Warning">3rd Warning</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white">
              <thead className="table-danger">
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Violation Type</th>
                  <th>Offense Level</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentViolations.length > 0 ? (
                  currentViolations.map((v, index) => (
                    <tr
                      key={v.id}
                      className={v.offense_level === "3rd Warning" ? "table-danger" : ""}
                    >
                      <td>{indexOfFirstViolation + index + 1}</td>
                      <td>{v.student?.name}</td>
                      <td>{v.violation_type}</td>
                      <td>{v.offense_level}</td>
                      <td>{v.description}</td>
                      <td>{new Date(v.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No violations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination mb-0">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
