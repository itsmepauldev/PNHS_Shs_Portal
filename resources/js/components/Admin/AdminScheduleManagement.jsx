import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';

export default function AdminScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [sections, setSections] = useState([]);

  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStrand, setFilterStrand] = useState('');
  const [filterSY, setFilterSY] = useState('');
  const [filterSem, setFilterSem] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const navigate = useNavigate();

  const fetchSchedules = async () => {
    const res = await axios.get('http://shs-portal.test/api/schedules');
    setSchedules(res.data);
    setCurrentPage(1);
  };

  const fetchSections = async () => {
    const res = await axios.get('http://shs-portal.test/api/sections');
    setSections(Array.isArray(res.data) ? res.data : res.data.sections || []);
  };

  useEffect(() => {
    fetchSchedules();
    fetchSections();
    setItemsPerPage(window.innerWidth < 576 ? 4 : 8);
  }, []);

useEffect(() => {
  const filtered = schedules.filter((schedule) => {
    const section = schedule.section;
    if (!section) return false;

    const matchesSearch =
      section.section_name.toLowerCase().includes(search.toLowerCase()) ||
      (section.adviser?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesGrade =
      !filterGrade || String(section.grade_level) === filterGrade;

    const matchesStrand =
      !filterStrand || section.strand === filterStrand;

    const matchesSY =
      !filterSY || section.school_year === filterSY;

    const matchesSem =
      !filterSem || section.semester === filterSem;

    return matchesSearch && matchesGrade && matchesStrand && matchesSY && matchesSem;
  });

  setFilteredSchedules(filtered);
}, [schedules, search, filterGrade, filterStrand, filterSY, filterSem]);


  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddSchedule = async () => {
    const usedSectionIds = schedules.map((s) => s.section_id);
    const availableSections = sections.filter((s) => !usedSectionIds.includes(s.id));

    const { value: selected } = await Swal.fire({
      title: 'Add Class Schedule',
      html: `
        <div class="d-flex flex-column gap-2">
          <label for="swal-section" class="form-label">Select Section</label>
          <select id="swal-section" class="swal2-select" style="margin: 0; color: #6c757d;">
            <option value="" disabled selected hidden>Select Section</option>
            ${availableSections
              .map(
                (s) =>
                  `<option value="${s.id}">${s.section_name} – Grade ${s.grade_level} (${s.strand})</option>`
              )
              .join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        const select = document.getElementById('swal-section');
        select.addEventListener('change', function () {
          this.style.color = this.value === '' ? '#6c757d' : '#212529';
        });
      },
      preConfirm: () => {
        const section = document.getElementById('swal-section').value;
        if (!section) {
          Swal.showValidationMessage('Please select a section');
        }
        return section;
      },
    });

    if (selected) {
      try {
        await axios.post('http://shs-portal.test/api/schedules', {
          section_id: selected,
        });
        fetchSchedules();
        Swal.fire('Success!', 'Schedule created!', 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to create schedule.', 'error');
      }
    }
  };

  const handleEditSchedule = async (id, currentSectionId) => {
    const availableSections = sections.filter(
      (s) => !schedules.some((sch) => sch.section_id === s.id) || s.id === currentSectionId
    );

    const sectionOptionsHtml = availableSections
      .map(
        (s) => `
          <option value="${s.id}" ${s.id === currentSectionId ? 'selected' : ''}>
            ${s.section_name} – Grade ${s.grade_level} (${s.strand})
          </option>
        `
      )
      .join('');

    const { value: selected } = await Swal.fire({
      title: 'Edit Class Schedule',
      html: `
        <div class="d-flex flex-column gap-2">
          <label for="swal-edit-section" class="form-label">Select Section</label>
          <select id="swal-edit-section" class="swal2-select" style="margin: 0; color: #212529;">
            ${sectionOptionsHtml}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const section = document.getElementById('swal-edit-section').value;
        if (!section) {
          Swal.showValidationMessage('Please select a section');
        }
        return section;
      },
    });

    if (selected) {
      try {
        await axios.put(`http://shs-portal.test/api/schedules/${id}`, {
          section_id: selected,
        });
        fetchSchedules();
        Swal.fire('Updated!', 'Schedule updated successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to update schedule.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the schedule and its entries.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://shs-portal.test/api/schedules/${id}`);
      fetchSchedules();
      Swal.fire('Deleted!', 'Schedule removed.', 'success');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid mt-4 px-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Schedule Management</h3>
          <button className="btn btn-primary" onClick={handleAddSchedule}>
            Add Schedule
          </button>
        </div>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="">All Grades</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={filterStrand}
              onChange={(e) => setFilterStrand(e.target.value)}
            >
              <option value="">All Strands</option>
              <option value="TVL: CSS">TVL: CSS</option>
              <option value="TVL: EIM">TVL: EIM</option>
              <option value="TVL: HE">TVL: HE</option>
              <option value="HUMSS">HUMSS</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={filterSY}
              onChange={(e) => setFilterSY(e.target.value)}
            >
              <option value="">All School Years</option>
              {[...new Set(sections.map((s) => s.school_year))].map((sy) => (
                <option key={sy} value={sy}>
                  {sy}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={filterSem}
              onChange={(e) => setFilterSem(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Section Name</th>
              <th>Grade & Strand</th>
              <th>School Year & Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchedules.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No schedule found.</td>
              </tr>
            ) : (
              paginatedSchedules.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <strong>{schedule.section?.section_name}</strong>
                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                      Adviser: {schedule.section?.adviser?.name || 'N/A'}
                    </div>
                  </td>
                  <td>{schedule.section?.grade_level} {schedule.section?.strand}</td>
                  <td>{schedule.section?.school_year || 'N/A'} {schedule.section?.semester || 'N/A'} Semester</td>
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-1">
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          navigate(`/admin/schedules/${schedule.id}`, {
                            state: { sectionId: schedule.section_id },
                          })
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          handleEditSchedule(schedule.id, schedule.section_id)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
