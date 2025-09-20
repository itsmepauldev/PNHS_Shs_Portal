import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://shs-portal.test/api/users');
      setUsers(res.data.users);
    } catch (err) {
      Swal.fire('Error', 'Unable to fetch users.', 'error');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const countByRole = (role) => users.filter((u) => u.role === role).length;

  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New User',
      html:
        '<div class="d-flex flex-column gap-2">' +
        '<select id="swal-role" class="swal2-input" style="margin: 0; color: #6c757d;" onchange="this.style.color = (this.value === \'\') ? \'#6c757d\' : \'#212529\'">' +
        '<option value="" disabled selected hidden>Select Role</option>' +
        '<option value="admin">Admin</option>' +
        '<option value="teacher">Teacher</option>' +
        '<option value="adviser">Adviser</option>' +
        '<option value="student">Student</option>' +
         '<option value="guidance">Guidance</option>' +
        '</select>' +
        '<input id="swal-name" class="swal2-input" placeholder="Name" style="margin: 0;" />' +
        '<input id="swal-email" class="swal2-input" placeholder="Email" style="margin: 0;" />' +
        '<input id="swal-password" class="swal2-input" placeholder="Password" type="password" style="margin: 0; display: none;" />' +
        '</div>',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const passwordInput = document.getElementById('swal-password');
        roleSelect.addEventListener('change', function () {
          passwordInput.style.display = this.value === 'admin' ? '' : 'none';
          this.style.color = this.value === '' ? '#6c757d' : '#212529';
        });
      },
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const role = document.getElementById('swal-role').value.trim();
        const password = document.getElementById('swal-password').value.trim();
        if (!name || !email || !role) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }
        return { name, email, role, password };
      },
    });

    if (formValues) {
      try {
        await axios.post('http://shs-portal.test/api/users', formValues);
        fetchUsers();
        Swal.fire('Success!', 'User added successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to add user.', 'error');
      }
    }
  };

  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit User',
      html:
        '<div class="d-flex flex-column gap-2">' +
        `<select id="swal-role" class="swal2-input" style="margin: 0; color: #6c757d;" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
        `<option value="" disabled hidden ${!user.role ? 'selected' : ''}>Select Role</option>` +
        `<option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>` +
        `<option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>` +
        `<option value="adviser" ${user.role === 'adviser' ? 'selected' : ''}>Adviser</option>` +
        `<option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>` +
         `<option value="guidance" ${user.role === 'guidance' ? 'selected' : ''}>Guidance</option>` +
        '</select>' +
        `<input id="swal-name" class="swal2-input" value="${user.name}" placeholder="Name" style="margin: 0;" />` +
        `<input id="swal-email" class="swal2-input" value="${user.email}" placeholder="Email" style="margin: 0;" />` +
        `<input id="swal-password" class="swal2-input" placeholder="Password" type="password" style="margin: 0; display: none;" />` +
        `<div id="reset-default-container" style="display:none; font-size: 0.9em;">` +
        `<label><input type="checkbox" id="reset-default" /> Reset to default password</label>` +
        '</div>' +
        '</div>',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const passwordInput = document.getElementById('swal-password');
        const resetContainer = document.getElementById('reset-default-container');

        const updatePasswordField = (role) => {
          if (role === 'admin') {
            passwordInput.style.display = '';
            resetContainer.style.display = 'none';
          } else {
            passwordInput.style.display = 'none';
            resetContainer.style.display = 'block';
          }
        };

        updatePasswordField(roleSelect.value);

        roleSelect.addEventListener('change', function () {
          this.style.color = this.value === '' ? '#6c757d' : '#212529';
          updatePasswordField(this.value);
        });
      },
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const role = document.getElementById('swal-role').value.trim();
        const password = document.getElementById('swal-password').value.trim();
        const resetDefault = document.getElementById('reset-default').checked;

        if (!name || !email || !role) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }

        return {
          name,
          email,
          role,
          password: role === 'admin' ? password : resetDefault ? '12345678' : '',
        };
      },
    });

    if (formValues) {
      try {
        await axios.put(`http://shs-portal.test/api/users/${user.id}`, formValues);
        fetchUsers();
        Swal.fire('Updated!', 'User updated successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Update failed', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://shs-portal.test/api/users/${id}`);
        fetchUsers();
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete user.', 'error');
      }
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) &&
        (!filter || user.role === filter)
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-danger">Admin Dashboard</h3>
        </div>

        {/* Summary Cards */}
       <div className="row g-3 mb-4">
  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card shadow-sm border-0">
      <div className="card-body text-center">
        <h5 className="fw-bold text-secondary text-dark">
          <i className="bi bi-mortarboard-fill me-2 text-dark fw-bold"></i> Students
        </h5>
        <p className="fs-3 text-danger fw-bold">{countByRole('student')}</p>
      </div>
    </div>
  </div>

  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card shadow-sm border-0">
      <div className="card-body text-center">
        <h5 className="fw-bold text-secondary text-dark">
          <i className="bi bi-person-badge-fill me-2 text-dark fw-bold"></i> Teachers
        </h5>
        <p className="fs-3 text-danger fw-bold">{countByRole('teacher')}</p>
      </div>
    </div>
  </div>

  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card shadow-sm border-0">
      <div className="card-body text-center">
        <h5 className="fw-bold text-secondary text-dark">
          <i className="bi bi-person-badge-fill me-2 text-dark fw-bold"></i> Advisers
        </h5>
        <p className="fs-3 text-danger fw-bold">{countByRole('adviser')}</p>
      </div>
    </div>
  </div>

  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card shadow-sm border-0">
      <div className="card-body text-center">
        <h5 className="fw-bold text-secondary text-dark">
          <i className="bi bi-person-badge-fill me-2 text-dark fw-bold"></i> Guidance
        </h5>
       <p className="fs-3 text-danger fw-bold">{countByRole('guidance')}</p>
      </div>
    </div>
  </div>
</div>


        {/* Filters */}
        <div className="row g-2 align-items-stretch mb-3">
          <div className="col-12 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="adviser">Adviser</option>
              <option value="guidance">Guidance</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <button
              className="btn btn-danger w-90"
              onClick={handleAddUser}
            >
              Add New User
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="table-responsive mb-3">
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-danger">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td className="text-center">
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
           <button
  className="btn btn-sm d-flex align-items-center gap-1 text-primary fw-bold text-uppercase"
  style={{ background: 'transparent', border: 'none' }}
  onClick={() => handleEdit(user)}
>
  <i className="bi bi-pencil-square"></i>
  Edit
</button>

{JSON.parse(localStorage.getItem('user'))?.id !== user.id && (
  <button
    className="btn btn-sm d-flex align-items-center gap-1 text-danger fw-bold text-uppercase"
    style={{ background: 'transparent', border: 'none' }}
    onClick={() => handleDelete(user.id)}
  >
    <i className="bi bi-trash"></i>
    Delete
  </button>
)}


                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No users found
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
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 ? 'active' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
