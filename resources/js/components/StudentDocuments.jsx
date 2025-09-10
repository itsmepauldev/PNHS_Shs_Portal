// StudentDocuments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentLayout from './StudentLayout'; 

const API_URL = "http://shs-portal.test/api";

// Pass studentId as prop OR read from localStorage if you prefer
const StudentDocuments = ({ studentId: propStudentId }) => {
  const [requests, setRequests] = useState([]);
  const [documentType, setDocumentType] = useState("");

  // If you store the user in localStorage
  const localStudentId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id;
    } catch {
      return null;
    }
  })();

  const studentId = propStudentId ?? localStudentId;

const fetchRequests = () => {
  axios
    .get(`${API_URL}/my-document-requests`, { params: { student_id: studentId } })
    .then((res) => setRequests(res.data))
    .catch((err) => console.error(err));
};


  useEffect(() => {
    if (!studentId) return;
    fetchRequests();
  }, [studentId]);

  const createRequest = () => {
    if (!documentType) {
      Swal.fire("Oops", "Please choose a document.", "info");
      return;
    }
    axios
      .post(`${API_URL}/document-requests`, {
        student_id: studentId,
        document: documentType,
      })
      .then(() => {
        Swal.fire("Submitted", "Your request has been submitted.", "success");
        setDocumentType("");
        fetchRequests();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Failed to submit request.";
        Swal.fire("Error", msg, "error");
      });
  };

  const cancelRequest = (req) => {
    Swal.fire({
      title: "Cancel this request?",
      text: `${req.document} - created on ${new Date(req.created_at).toLocaleDateString()}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No",
    }).then((r) => {
      if (r.isConfirmed) {
        axios
          .delete(`${API_URL}/document-requests/${req.id}`)
          .then(() => {
            Swal.fire("Cancelled", "Your request was cancelled.", "success");
            fetchRequests();
          })
          .catch(() => Swal.fire("Error", "Failed to cancel request.", "error"));
      }
    });
  };

  const requestAgain = (docName) => {
    setDocumentType(docName);
    createRequest(); // reuses same create flow
  };

  return (
    <StudentLayout>
    <div className="container-fluid ">
      <h3>My Document Requests</h3>

      {/* Request form */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-6">
              <label className="form-label">Document Type</label>
              <select
                className="form-select"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="">-- Select Document --</option>
                <option value="Good Moral">Good Moral (GMC)</option>
                <option value="Form 137">Form 137</option>
                <option value="Enrollment Certificate">Enrollment Certificate</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={createRequest}>
                Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requests table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Document</th>
            <th>Date</th>
            <th>Status</th>
            <th>File / Reason</th>
            <th style={{ width: 220 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req, idx) => (
              <tr key={req.id}>
                <td>{idx + 1}</td>
                <td>{req.document}</td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>
                  {req.status === "Pending" && "Pending"}
                  {req.status === "Completed" && "Completed"}
                  {req.status === "Rejected" && "Rejected"}
                </td>
                <td>
                  {req.status === "Completed" && req.file_path ? (
                    <a
                      href={`http://shs-portal.test/storage/${req.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download / View
                    </a>
                  ) : req.status === "Rejected" ? (
                    <span>Reason: {req.reject_reason || "—"}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {req.status === "Pending" && (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => cancelRequest(req)}>
                      Cancel
                    </button>
                  )}
                  {req.status === "Rejected" && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => requestAgain(req.document)}
                    >
                      Request Again
                    </button>
                  )}
                  {req.status === "Completed" && req.file_path && (
                    <a
                      className="btn btn-primary btn-sm ms-1"
                      href={`http://shs-portal.test/storage/${req.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No requests yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </StudentLayout>
  );
};

export default StudentDocuments;
