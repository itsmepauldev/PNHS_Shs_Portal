// AdminDocuments.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://shs-portal.test/api";

const AdminDocuments = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const fetchRequests = () => {
    axios
      .get(`${API_URL}/document-requests`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      !filter || req.document === filter || req.status === filter;

    return matchesSearch && matchesFilter;
  });

  // const handleUpload = async (req) => {
  //   const { value: file } = await Swal.fire({
  //     title: "Upload Document",
  //     html:
  //       '<div class="d-flex flex-column gap-2">' +
  //       `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
  //       `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
  //       `<input type="file" id="swal-file" class="form-control" style="margin:0;" />` +
  //       "</div>",
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Upload",
  //     cancelButtonText: "Cancel",
  //     preConfirm: () => {
  //       const fileInput = document.getElementById("swal-file").files[0];
  //       if (!fileInput) {
  //         Swal.showValidationMessage("Please select a file!");
  //         return false;
  //       }
  //       return fileInput;
  //     },
  //   });

  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //       await axios.post(
  //         `${API_URL}/document-requests/${req.id}/upload`,
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       Swal.fire("Uploaded!", "Document has been uploaded.", "success");
  //       fetchRequests();
  //     } catch {
  //       Swal.fire("Error", "Failed to upload.", "error");
  //     }
  //   }
  // };


  const handleUpload = async (req) => {
  const { value: file } = await Swal.fire({
    title: "Upload Image",
    html: `
      <div class="d-flex flex-column gap-2">
        <input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />
        <input class="swal2-input" style="margin:0;" value="${req.document}" readonly />
        <input type="file" id="swal-file" class="form-control" style="margin:0;" accept="image/*" />
        <img id="swal-preview" style="display:none; max-height:200px; margin-top:10px; border-radius:8px;" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Upload",
    cancelButtonText: "Cancel",
    didOpen: () => {
      const fileInput = document.getElementById("swal-file");
      const preview = document.getElementById("swal-preview");

      // Show image preview when file is selected
      fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            Swal.showValidationMessage("Only image files are allowed!");
            fileInput.value = ""; // reset
            preview.style.display = "none";
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "block";
          };
          reader.readAsDataURL(file);
        } else {
          preview.style.display = "none";
        }
      });
    },
    preConfirm: () => {
      const fileInput = document.getElementById("swal-file").files[0];
      if (!fileInput) {
        Swal.showValidationMessage("Please select an image!");
        return false;
      }
      if (!fileInput.type.startsWith("image/")) {
        Swal.showValidationMessage("Only image files are allowed!");
        return false;
      }
      return fileInput;
    },
  });

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/document-requests/${req.id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire("Uploaded!", "Image has been uploaded.", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to upload.", "error");
    }
  }
};

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
        await axios.post(`${API_URL}/document-requests/${req.id}/reject`, {
          reason,
        });
        Swal.fire("Rejected!", "Request has been rejected.", "error");
        fetchRequests();
      } catch {
        Swal.fire("Error", "Failed to reject.", "error");
      }
    }
  };

  // const handleReupload = async (req) => {
  //   const { value: file } = await Swal.fire({
  //     title: "Reupload Document",
  //     html:
  //       '<div class="d-flex flex-column gap-2">' +
  //       `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
  //       `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
  //       `<input type="file" id="swal-file" class="form-control" style="margin:0;" />` +
  //       "</div>",
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Submit",
  //     cancelButtonText: "Cancel",
  //     preConfirm: () => {
  //       const fileInput = document.getElementById("swal-file").files[0];
  //       if (!fileInput) {
  //         Swal.showValidationMessage("Please select a file!");
  //         return false;
  //       }
  //       return fileInput;
  //     },
  //   });

  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //       await axios.post(
  //         `${API_URL}/document-requests/${req.id}/reupload`,
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       Swal.fire("Reuploaded!", "Document has been reuploaded.", "success");
  //       fetchRequests();
  //     } catch {
  //       Swal.fire("Error", "Failed to reupload.", "error");
  //     }
  //   }
  // };

  const handleReupload = async (req) => {
  const { value: file } = await Swal.fire({
    title: "Reupload Image",
    html: `
      <div class="d-flex flex-column gap-2">
        <input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />
        <input class="swal2-input" style="margin:0;" value="${req.document}" readonly />
        <input type="file" id="swal-file" class="form-control" style="margin:0;" accept="image/*" />
        <img id="swal-preview" style="display:none; max-height:200px; margin-top:10px; border-radius:8px;" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    didOpen: () => {
      const fileInput = document.getElementById("swal-file");
      const preview = document.getElementById("swal-preview");

      // Show preview when file is selected
      fileInput.addEventListener("change", (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          if (!selectedFile.type.startsWith("image/")) {
            Swal.showValidationMessage("Only image files are allowed!");
            fileInput.value = ""; // reset
            preview.style.display = "none";
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "block";
          };
          reader.readAsDataURL(selectedFile);
        } else {
          preview.style.display = "none";
        }
      });
    },
    preConfirm: () => {
      const fileInput = document.getElementById("swal-file").files[0];
      if (!fileInput) {
        Swal.showValidationMessage("Please select an image!");
        return false;
      }
      if (!fileInput.type.startsWith("image/")) {
        Swal.showValidationMessage("Only image files are allowed!");
        return false;
      }
      return fileInput;
    },
  });

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/document-requests/${req.id}/reupload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire("Reuploaded!", "Image has been reuploaded.", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to reupload.", "error");
    }
  }
};

  // const handleView = async (req) => {
  //   await Swal.fire({
  //     title: "View Document",
  //     html:
  //       '<div class="d-flex flex-column gap-3">' +
  //       `<input class="swal2-input" style="margin:0;" value="${req.student.name}" readonly />` +
  //       `<input class="swal2-input" style="margin:0;" value="${req.document}" readonly />` +
  //       (req.file_path
  //         ? `<a href="http://shs-portal.test/storage/${req.file_path}" target="_blank" 
  //               class="text-primary fw-bold text-uppercase text-decoration-none d-flex align-items-center justify-content-center gap-2" 
  //               style="text-decoration:none;">
  //                <i class="bi bi-eye"></i> VIEW / DOWNLOAD
  //             </a>`
  //         : `<p class="text-danger text-center fw-bold">No file uploaded yet</p>`) +
  //       "</div>",
  //     confirmButtonText: "Close",
  //   });
  // };


const handleView = (req) => {
  if (!req.file_path) {
    Swal.fire("No file found", "This request has no uploaded file.", "info");
    return;
  }

  Swal.fire({
    title: `${req.document} Preview`,
    html: `
      <div style="display:flex; justify-content:center;">
        <img 
          src="http://shs-portal.test/storage/${req.file_path}" 
          style="max-width:90%; max-height:70vh; border-radius:8px;" 
        />
      </div>
    `,
    width: "auto", // fit image size
    showCloseButton: true,
    showConfirmButton: false,
    background: "#fff",
  });
};

  return (
    <AdminLayout>
     <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>
        <h3 className="text-danger fw-bold">DOCUMENTS REQUEST</h3>

        <div className="d-flex justify-content-between my-3 flex-wrap gap-2">
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

        <table className="table table-bordered table-hover">
          <thead className="table-danger text-white">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Document</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ width: "300px" }}>Action</th>
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
                  <td className="d-flex flex-wrap gap-2">
                    {req.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-link btn-sm fw-bold text-uppercase text-success d-flex align-items-center gap-1 p-0 text-decoration-none"
                          onClick={() => handleUpload(req)}
                        >
                          <i className="bi bi-upload"></i> UPLOAD
                        </button>
                        <button
                          className="btn btn-link btn-sm fw-bold text-uppercase text-danger d-flex align-items-center gap-1 p-0 text-decoration-none"
                          onClick={() => handleReject(req)}
                        >
                          <i className="bi bi-x-circle"></i> REJECT
                        </button>
                      </>
                    )}
                   {req.status === "Completed" && (
  <button
    className="btn btn-link btn-sm fw-bold text-uppercase text-primary d-flex align-items-center gap-1 p-0 text-decoration-none"
    onClick={() => handleView(req)}
  >
    <i className="bi bi-eye"></i> VIEW
  </button>
)}

                    {req.status === "Rejected" && (
                      <button
                        className="btn btn-link btn-sm fw-bold text-uppercase text-warning d-flex align-items-center gap-1 p-0 text-decoration-none"
                        onClick={() => handleReupload(req)}
                      >
                        <i className="bi bi-arrow-repeat"></i> REUPLOAD
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
      </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
