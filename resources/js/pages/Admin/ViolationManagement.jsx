import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

export default function AdminViolations() {
  const [violations, setViolations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

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

  // ✅ filter logic
  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      v.violation_type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType ? v.violation_type === filterType : true;
    const matchesLevel = filterLevel ? v.offense_level === filterLevel : true;

    return matchesSearch && matchesType && matchesLevel;
  });

  // Get unique types for dropdown
  const violationTypes = [...new Set(violations.map((v) => v.violation_type))];

  return (
    <AdminLayout>
      <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
        <div className="container-fluid p-3">
          <h3 className="fw-bold text-danger mb-4">Student Violations</h3>

          {/* 🔎 Filters */}
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by student, violation, or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Filter by Violation Type</option>
                {violationTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
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
          </div>

          {/* 📋 Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white">
              <thead className="table-danger">
                <tr>
                  <th>Student</th>
                  <th>Violation Type</th>
                  <th>Offense Level</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredViolations.length > 0 ? (
                  filteredViolations.map((v) => (
                    <tr
                      key={v.id}
                      className={v.offense_level === "3rd Warning" ? "table-danger" : ""}
                    >
                      <td>{v.student?.name}</td>
                      <td>{v.violation_type}</td>
                      <td>{v.offense_level}</td>
                      <td>{v.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
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
