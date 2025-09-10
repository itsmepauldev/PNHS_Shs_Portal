// AdminDocuments.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import AdminLayout from '../AdminLayout';
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://shs-portal.test/api";

const AdminDocuments = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Fetch data from Laravel API
  const fetchRequests = () => {
    axios
      .get(`${API_URL}/document-requests`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔎 Filter & Search Logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      !filter ||
      req.document === filter ||
      req.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Upload Document
// Upload Document
const handleUpload = async (req) => {
  const { value: file } = await Swal.fire({
    title: "Upload Document",
    html:
      '<div class="d-flex flex-column gap-2">' +
      `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
      `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
      `<input type="file" id="swal-file" class="form-control" style="margin:0;" />` 
     
      
      +
      "</div>",
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Upload",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const fileInput = document.getElementById("swal-file").files[0];
      if (!fileInput) {
        Swal.showValidationMessage("Please select a file!");
        return false;
      }
      return fileInput;
    },
  });

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/document-requests/${req.id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Uploaded!", "Document has been uploaded.", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to upload.", "error");
    }
  }
};


  // Reject Request
  // Reject Request
const handleReject = async (req) => {
  const { value: reason } = await Swal.fire({
    title: "Reject Request",
    html:
      '<div class="d-flex flex-column gap-2">' +
      `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
      `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
      `<textarea id="swal-reason" class="swal2-input" style="margin:0; height:80px;" placeholder="Reason for rejection"></textarea>` +
      "</div>",
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Reject",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const reasonInput = document.getElementById("swal-reason").value.trim();
      if (!reasonInput) {
        Swal.showValidationMessage("Please provide a reason!");
        return false;
      }
      return reasonInput;
    },
  });

  if (reason) {
    try {
      await axios.post(`${API_URL}/document-requests/${req.id}/reject`, { reason });
      Swal.fire("Rejected!", "Request has been rejected.", "error");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to reject.", "error");
    }
  }
};


  // Reupload Document
 // Reupload Document
const handleReupload = async (req) => {
  const { value: file } = await Swal.fire({
    title: "Reupload Document",
    html:
      '<div class="d-flex flex-column gap-2">' +
      `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
      `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
       `<input type="file" id="swal-file" class="form-control" style="margin:0;" />`  +
      "</div>",
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const fileInput = document.getElementById("swal-reupload").files[0];
      if (!fileInput) {
        Swal.showValidationMessage("Please select a file!");
        return false;
      }
      return fileInput;
    },
  });

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/document-requests/${req.id}/reupload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Reuploaded!", "Document has been reuploaded.", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to reupload.", "error");
    }
  }
};


  // View Document
 // View Document
const handleView = async (req) => {
  await Swal.fire({
    title: "View Document",
    html:
      '<div class="d-flex flex-column gap-3">' +
      `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
      `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
      (req.file_path
        ? `<a href="http://shs-portal.test/storage/${req.file_path}" target="_blank" 
              class="btn btn-primary w-100" 
              style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px;">
               Download / View
            </a>`
        : `<p class="text-danger text-center fw-bold">No file uploaded yet</p>`) +
      "</div>",
    confirmButtonText: "Close",
  });
};



  return (
    <AdminLayout>
    <div className="container-fluid mt-4 px-3">
      <h3>DOCUMENTS REQUEST</h3>

      {/* Search & Filter UI (functional now) */}
      <div className="d-flex justify-content-between my-3">
        <input
          type="text"
          placeholder="🔍 Search Student"
          className="form-control w-50 me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">⏷ Filter by Type or Status</option>
          <option value="Good Moral">Good Moral</option>
          <option value="Form 137">Form 137</option>
          <option value="Enrollment Certificate">Enrollment Certificate</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Document</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ width: "250px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.student.name}</td>
                <td>{req.document}</td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>
                  {req.status === "Pending" && "Pending"}
                  {req.status === "Completed" && "Completed"}
                  {req.status === "Rejected" && "Rejected"}
                </td>
                <td>
                  {req.status === "Pending" && (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleUpload(req)}
                      >
                        Upload
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(req)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === "Completed" && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleView(req)}
                    >
                      View
                    </button>
                  )}
                  {req.status === "Rejected" && (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleReupload(req)}
                    >
                      Reupload
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
