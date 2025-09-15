// StudentDocuments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import StudentLayout from '../../components/StudentLayout'; 
const API_URL = "http://shs-portal.test/api";

const StudentDocuments = ({ studentId: propStudentId }) => {
  const [requests, setRequests] = useState([]);
  const [documentType, setDocumentType] = useState("");

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
    createRequest();
  };
const downloadFile = async (filePath, fileName) => {
  try {
    // Fetch the file as a blob
    const response = await axios.get(`http://shs-portal.test/storage/${filePath}`, {
      responseType: "blob",
    });

    // Guess extension from file type (jpg, png, etc.)
    const contentType = response.headers["content-type"];
    let extension = "jpg"; // default
    if (contentType.includes("png")) extension = "png";
    else if (contentType.includes("jpeg")) extension = "jpg";
    else if (contentType.includes("webp")) extension = "webp";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName || "document"}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    Swal.fire("Error", "Failed to download image.", "error");
  }
};
const previewImage = (filePath, docName) => {
  Swal.fire({
    title: docName,
    html: `
      <img 
        src="http://shs-portal.test/storage/${filePath}" 
        alt="Document Preview"
        style="max-width: 100%; max-height: 70vh; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);" 
      />
    `,
    showCloseButton: true,
    showConfirmButton: false,
    background: "#f8f9fa",
    width: "auto", // 🔑 allows SweetAlert to auto-fit to content
    padding: "1rem",
  });
};

  return (
    <StudentLayout>
      <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
        <div className="container-fluid p-3" style={{ backgroundColor: "#f3f3f3" }}>
          <h3 className="text-danger fw-bold">MY DOCUMENT REQUESTS</h3>

          {/* Request form */}
          <div className="d-flex flex-wrap gap-2 my-3">
            <select
              className="form-select w-50"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">-- Select Document --</option>
              <option value="Good Moral">Good Moral (GMC)</option>
              <option value="Form 137">Form 137</option>
              <option value="Enrollment Certificate">Enrollment Certificate</option>
            </select>
            <button className="btn btn-danger text-uppercase fw-bold" onClick={createRequest}>
              Request
            </button>
          </div>

          {/* Requests table */}
          <table className="table table-bordered table-hover">
            <thead className="table-danger text-white">
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
                      <span
                        className={`badge ${
                          req.status === "Pending"
                            ? "bg-warning text-dark"
                            : req.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                   <td>
  {req.status === "Completed" && req.file_path ? (
    <span className="text-success fw-bold">Ready</span>
  ) : req.status === "Rejected" ? (
    <span className="text-danger">Reason: {req.reject_reason || "—"}</span>
  ) : (
    "—"
  )}
</td>

<td className="d-flex flex-wrap gap-2">
  {/* Cancel Button */}
  {req.status === "Pending" && (
    <button
      className="btn btn-link btn-sm fw-bold text-uppercase text-danger d-flex align-items-center gap-1 p-0 text-decoration-none"
      onClick={() => cancelRequest(req)}
    >
      <i className="bi bi-x-circle"></i> Cancel
    </button>
  )}

  {/* Request Again Button */}
  {req.status === "Rejected" && (
    <button
      className="btn btn-link btn-sm fw-bold text-uppercase text-warning d-flex align-items-center gap-1 p-0 text-decoration-none"
      onClick={() => requestAgain(req.document)}
    >
      <i className="bi bi-arrow-repeat"></i> Request Again
    </button>
  )}

  {/* View Button (Popup Preview) */}
  {req.status === "Completed" && req.file_path && (
    <button
      className="btn btn-link btn-sm fw-bold text-uppercase text-primary d-flex align-items-center gap-1 p-0 text-decoration-none"
      onClick={() => previewImage(req.file_path, req.document)}
    >
      <i className="bi bi-eye"></i> View
    </button>
  )}

  {/* Download Button */}
  {req.status === "Completed" && req.file_path && (
    <button
      className="btn btn-link btn-sm fw-bold text-uppercase text-success d-flex align-items-center gap-1 p-0 text-decoration-none"
      onClick={() =>
        downloadFile(
          req.file_path,
          `${req.document.replace(/\s+/g, "_")}_${new Date(req.created_at).toLocaleDateString("en-CA")}`
        )
      }
    >
      <i className="bi bi-download"></i> Download
    </button>
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
      </div>
    </StudentLayout>
  );
};

export default StudentDocuments;
