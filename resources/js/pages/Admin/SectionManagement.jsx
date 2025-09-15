import React, { useEffect, useState } from 'react';
import AdminLayout from "../../components/AdminLayout";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function SectionManagement() {
  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [strandFilter, setStrandFilter] = useState('');
  const [advisers, setAdvisers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const navigate = useNavigate();

 const getCurrentTimeline = () => {
  const today = new Date(/* '2026-02-15' */ );
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // If it's June but before 16, consider it still 2nd Semester of previous year
  let semester;
  let schoolYear;

  if (month > 6 || (month === 6 && day >= 16)) {
    semester = '1st';
    schoolYear = `${year}-${year + 1}`;
  } else {
    semester = '2nd';
    schoolYear = `${year - 1}-${year}`;
  }

  return { semester, schoolYear };
};



  useEffect(() => {
    const width = window.innerWidth;
    if (width < 576) setItemsPerPage(4);
    else setItemsPerPage(6);
  }, []);

 useEffect(() => {
    fetchSections();
    fetchAdvisers();
  }, []);
const currentTimeline = getCurrentTimeline();
const [semesterFilter, setSemesterFilter] = useState(currentTimeline.semester);
const [schoolYearFilter, setSchoolYearFilter] = useState(currentTimeline.schoolYear);

  const fetchSections = async () => {
    try {
      const res = await axios.get('http://shs-portal.test/api/sections');
      setSections(res.data.sections || []);
    } catch (err) {
      console.error(err);
      setSections([]);
    }
  };

  const fetchAdvisers = async () => {
    try {
      const usersRes = await axios.get('http://shs-portal.test/api/users');
      const sectionsRes = await axios.get('http://shs-portal.test/api/sections');
      const assignedIds = sectionsRes.data.sections.map(s => s.adviser_id);
      const advisers = (usersRes.data.users || []).filter(
        u => u.role === 'adviser' && !assignedIds.includes(u.id)
      );
      setAdvisers(advisers);
    } catch (err) {
      console.error(err);
      setAdvisers([]);
    }
  };

 

  const filtered = sections.filter(section => {
  const matchesSearch = section.section_name.toLowerCase().includes(search.toLowerCase());
  const matchesGrade = !filter || section.grade_level === filter;
  const matchesStrand = !strandFilter || section.strand === strandFilter;
  const matchesSem = !semesterFilter || section.semester === semesterFilter;
  const matchesYear = !schoolYearFilter || section.school_year === schoolYearFilter;
  return matchesSearch && matchesGrade && matchesStrand && matchesSem && matchesYear;
});


  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleDeleteSection = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the section.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://shs-portal.test/api/sections/${id}`);
        await fetchSections();
        Swal.fire('Deleted!', 'Section has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete section.', 'error');
      }
    }
  };

// const handleEditSection = async (section) => {
//   const allUsers = await axios.get('http://shs-portal.test/api/users');
//   const adviserList = allUsers.data.users.filter(u => u.role === 'adviser');

//   const adviserOptions = adviserList.map(adviser =>
//     `<option value="${adviser.id}" ${adviser.id === section.adviser_id ? 'selected' : ''}>${adviser.name}</option>`
//   ).join('');

//   const currentYear = new Date().getFullYear();
//   const schoolYears = [
//     `${currentYear}-${currentYear + 1}`,
//     `${currentYear + 1}-${currentYear + 2}`,
//     `${currentYear + 2}-${currentYear + 3}`
//   ];

//   const yearOptions = schoolYears.map(year =>
//     `<option value="${year}" ${section.school_year === year ? 'selected' : ''}>${year}</option>`
//   ).join('');

//   const semOptions = ['1st', '2nd'].map(sem =>
//     `<option value="${sem}" ${section.semester === sem ? 'selected' : ''}>${sem} Semester</option>`
//   ).join('');

//   const { value: formValues } = await Swal.fire({
//     title: 'Edit Section',
//     html:
//       '<div class="d-flex flex-column gap-2">' +
//       `<input id="swal-section-name" class="swal2-input" placeholder="Section Name" style="margin: 0;" value="${section.section_name}" />` +
//       `<select id="swal-strand" class="swal2-input" style="margin: 0; color: ${section.strand ? '#212529' : '#6c757d'};" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
//         `<option value="" disabled hidden>Select Strand</option>` +
//         `<option value="TVL: EIM" ${section.strand === 'TVL: EIM' ? 'selected' : ''}>TVL: EIM</option>` +
//         `<option value="TVL: CSS" ${section.strand === 'TVL: CSS' ? 'selected' : ''}>TVL: CSS</option>` +
//         `<option value="TVL: HE" ${section.strand === 'TVL: HE' ? 'selected' : ''}>TVL: HE</option>` +
//         `<option value="HUMSS" ${section.strand === 'HUMSS' ? 'selected' : ''}>HUMSS</option>` +
//       '</select>' +
//       `<select id="swal-grade" class="swal2-input" style="margin: 0; color: ${section.grade_level ? '#212529' : '#6c757d'};" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
//         `<option value="" disabled hidden>Select Grade</option>` +
//         `<option value="Grade 11" ${section.grade_level === 'Grade 11' ? 'selected' : ''}>Grade 11</option>` +
//         `<option value="Grade 12" ${section.grade_level === 'Grade 12' ? 'selected' : ''}>Grade 12</option>` +
//       '</select>' +
//       `<select id="swal-year" class="swal2-input" style="margin: 0; color: ${section.school_year ? '#212529' : '#6c757d'};" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
//         `<option value="" disabled hidden>Select School Year</option>` +
//         yearOptions +
//       '</select>' +
//       `<select id="swal-sem" class="swal2-input" style="margin: 0; color: ${section.semester ? '#212529' : '#6c757d'};" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
//         `<option value="" disabled hidden>Select Semester</option>` +
//         semOptions +
//       '</select>' +
//       `<select id="swal-adviser" class="swal2-input" style="margin: 0; color: ${section.adviser_id ? '#212529' : '#6c757d'};" onchange="this.style.color = (this.value === '') ? '#6c757d' : '#212529'">` +
//         '<option value="" disabled hidden>Select Adviser</option>' +
//         adviserOptions +
//       '</select>' +
//       '</div>',
//     focusConfirm: false,
//     showCancelButton: true,
//     confirmButtonText: 'Update',
//     cancelButtonText: 'Cancel',
//     didOpen: () => {
//       const selects = ['swal-strand', 'swal-grade', 'swal-adviser', 'swal-year', 'swal-sem'];
//       selects.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//           el.style.color = el.value === '' ? '#6c757d' : '#212529';
//           el.addEventListener('change', function () {
//             this.style.color = this.value === '' ? '#6c757d' : '#212529';
//           });
//         }
//       });
//     },
//     preConfirm: () => {
//       const section_name = document.getElementById('swal-section-name').value.trim();
//       const strand = document.getElementById('swal-strand').value;
//       const grade_level = document.getElementById('swal-grade').value;
//       const adviser_id = document.getElementById('swal-adviser').value;
//       const school_year = document.getElementById('swal-year').value;
//       const semester = document.getElementById('swal-sem').value;

//       if (!section_name || !strand || !grade_level || !adviser_id || !school_year || !semester) {
//         Swal.showValidationMessage('Please fill in all fields');
//         return false;
//       }

//       return { section_name, strand, grade_level, adviser_id, school_year, semester };
//     }
//   });

//   if (formValues) {
//     try {
//       await axios.put(`http://shs-portal.test/api/sections/${section.id}`, formValues);
//       await fetchSections();
//       Swal.fire('Success', 'Section updated!', 'success');
//     } catch (err) {
//       Swal.fire('Error', 'Failed to update section.', 'error');
//     }
//   }
// };


// const handleEditSection = async (section) => {
//   try {
//     // Fetch users and sections
//     const usersRes = await axios.get('http://shs-portal.test/api/users');
//     const sectionsRes = await axios.get('http://shs-portal.test/api/sections');

//     // Get all advisers
//     const allAdvisers = usersRes.data.users.filter(u => u.role === 'adviser');

//     // Get adviser IDs that are already assigned
//     const assignedIds = sectionsRes.data.sections.map(s => s.adviser_id);

//     // Filter advisers: keep unassigned OR the current adviser of this section
//     const adviserList = allAdvisers.filter(
//       adv => !assignedIds.includes(adv.id) || adv.id === section.adviser_id
//     );

//     const adviserOptions = adviserList.map(adviser =>
//       `<option value="${adviser.id}" ${adviser.id === section.adviser_id ? 'selected' : ''}>
//         ${adviser.name}
//       </option>`
//     ).join('');

//     const currentYear = new Date().getFullYear();
//     const schoolYears = [
//       `${currentYear}-${currentYear + 1}`,
//       `${currentYear + 1}-${currentYear + 2}`,
//       `${currentYear + 2}-${currentYear + 3}`
//     ];

//     const yearOptions = schoolYears.map(year =>
//       `<option value="${year}" ${section.school_year === year ? 'selected' : ''}>${year}</option>`
//     ).join('');

//     const semOptions = ['1st', '2nd'].map(sem =>
//       `<option value="${sem}" ${section.semester === sem ? 'selected' : ''}>${sem} Semester</option>`
//     ).join('');

//     const { value: formValues } = await Swal.fire({
//       title: 'Edit Section',
//       html:
//         '<div class="d-flex flex-column gap-2">' +
//         `<input id="swal-section-name" class="swal2-input" placeholder="Section Name" style="margin: 0;" value="${section.section_name}" />` +
//         `<select id="swal-strand" class="swal2-input">` +
//           `<option value="TVL: EIM" ${section.strand === 'TVL: EIM' ? 'selected' : ''}>TVL: EIM</option>` +
//           `<option value="TVL: CSS" ${section.strand === 'TVL: CSS' ? 'selected' : ''}>TVL: CSS</option>` +
//           `<option value="TVL: HE" ${section.strand === 'TVL: HE' ? 'selected' : ''}>TVL: HE</option>` +
//           `<option value="HUMSS" ${section.strand === 'HUMSS' ? 'selected' : ''}>HUMSS</option>` +
//         '</select>' +
//         `<select id="swal-grade" class="swal2-input">` +
//           `<option value="Grade 11" ${section.grade_level === 'Grade 11' ? 'selected' : ''}>Grade 11</option>` +
//           `<option value="Grade 12" ${section.grade_level === 'Grade 12' ? 'selected' : ''}>Grade 12</option>` +
//         '</select>' +
//         `<select id="swal-year" class="swal2-input">${yearOptions}</select>` +
//         `<select id="swal-sem" class="swal2-input">${semOptions}</select>` +
//         `<select id="swal-adviser" class="swal2-input">` +
//           '<option value="" disabled hidden>Select Adviser</option>' +
//           adviserOptions +
//         '</select>' +
//         '</div>',
//       focusConfirm: false,
//       showCancelButton: true,
//       confirmButtonText: 'Update',
//       cancelButtonText: 'Cancel',
//       preConfirm: () => {
//         const section_name = document.getElementById('swal-section-name').value.trim();
//         const strand = document.getElementById('swal-strand').value;
//         const grade_level = document.getElementById('swal-grade').value;
//         const adviser_id = document.getElementById('swal-adviser').value;
//         const school_year = document.getElementById('swal-year').value;
//         const semester = document.getElementById('swal-sem').value;

//         if (!section_name || !strand || !grade_level || !adviser_id || !school_year || !semester) {
//           Swal.showValidationMessage('Please fill in all fields');
//           return false;
//         }

//         return { section_name, strand, grade_level, adviser_id, school_year, semester };
//       }
//     });

//     if (formValues) {
//       await axios.put(`http://shs-portal.test/api/sections/${section.id}`, formValues);
//       await fetchSections();
//       await fetchAdvisers(); // refresh advisers list
//       Swal.fire('Success', 'Section updated!', 'success');
//     }
//   } catch (err) {
//     Swal.fire('Error', 'Failed to load data for editing.', 'error');
//   }
// };

  const handleEditSection = async (section) => {
  try {
    // Fetch users and sections
    const usersRes = await axios.get('http://shs-portal.test/api/users');
    const sectionsRes = await axios.get('http://shs-portal.test/api/sections');

    // Get all advisers
    const allAdvisers = usersRes.data.users.filter(u => u.role === 'adviser');

    // Get adviser IDs that are already assigned
    const assignedIds = sectionsRes.data.sections.map(s => s.adviser_id);

    // Filter advisers: keep unassigned OR the current adviser of this section
    const adviserList = allAdvisers.filter(
      adv => !assignedIds.includes(adv.id) || adv.id === section.adviser_id
    );

    const adviserOptions = adviserList.map(adviser =>
      `<option value="${adviser.id}" ${adviser.id === section.adviser_id ? 'selected' : ''}>
        ${adviser.name}
      </option>`
    ).join('');

    const currentYear = new Date().getFullYear();
    const schoolYears = [
      `${currentYear}-${currentYear + 1}`,
      `${currentYear + 1}-${currentYear + 2}`,
      `${currentYear + 2}-${currentYear + 3}`
    ];

    const yearOptions = schoolYears.map(year =>
      `<option value="${year}" ${section.school_year === year ? 'selected' : ''}>${year}</option>`
    ).join('');

    const semOptions = ['1st', '2nd'].map(sem =>
      `<option value="${sem}" ${section.semester === sem ? 'selected' : ''}>${sem} Semester</option>`
    ).join('');

    const { value: formValues } = await Swal.fire({
      title: 'Edit Section',
      html:
        '<div class="d-flex flex-column gap-2">' +
        `<input id="swal-section-name" class="swal2-input" placeholder="Section Name" style="margin: 0;" value="${section.section_name}" readonly />` + // 🔒 READONLY
        `<select id="swal-strand" class="swal2-input">` +
          `<option value="TVL: EIM" ${section.strand === 'TVL: EIM' ? 'selected' : ''}>TVL: EIM</option>` +
          `<option value="TVL: CSS" ${section.strand === 'TVL: CSS' ? 'selected' : ''}>TVL: CSS</option>` +
          `<option value="TVL: HE" ${section.strand === 'TVL: HE' ? 'selected' : ''}>TVL: HE</option>` +
          `<option value="HUMSS" ${section.strand === 'HUMSS' ? 'selected' : ''}>HUMSS</option>` +
        '</select>' +
        `<select id="swal-grade" class="swal2-input">` +
          `<option value="Grade 11" ${section.grade_level === 'Grade 11' ? 'selected' : ''}>Grade 11</option>` +
          `<option value="Grade 12" ${section.grade_level === 'Grade 12' ? 'selected' : ''}>Grade 12</option>` +
        '</select>' +
        `<select id="swal-year" class="swal2-input">${yearOptions}</select>` +
        `<select id="swal-sem" class="swal2-input">${semOptions}</select>` +
        `<select id="swal-adviser" class="swal2-input">` +
          '<option value="" disabled hidden>Select Adviser</option>' +
          adviserOptions +
        '</select>' +
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const nameInput = document.getElementById('swal-section-name');
        const strandSelect = document.getElementById('swal-strand');
        const gradeSelect = document.getElementById('swal-grade');

        function updateSectionName() {
          const strand = strandSelect.value;
          const grade = gradeSelect.value;

          if (strand && grade) {
            const gradeNumber = grade.replace('Grade ', '');
            const filtered = sectionsRes.data.sections.filter(
              s => s.strand === strand && s.grade_level === grade
            );

            // ✅ When editing, exclude the current section so it doesn't affect count
            const filteredExcludingCurrent = filtered.filter(s => s.id !== section.id);

            const nextLetter = String.fromCharCode(65 + filteredExcludingCurrent.length); // A=65
            nameInput.value = `${gradeNumber}-${strand}-${nextLetter}`;
          } else {
            nameInput.value = '';
          }
        }

        // Recalculate if user changes strand or grade while editing
        strandSelect.addEventListener('change', updateSectionName);
        gradeSelect.addEventListener('change', updateSectionName);
      },
      preConfirm: () => {
        const section_name = document.getElementById('swal-section-name').value.trim();
        const strand = document.getElementById('swal-strand').value;
        const grade_level = document.getElementById('swal-grade').value;
        const adviser_id = document.getElementById('swal-adviser').value;
        const school_year = document.getElementById('swal-year').value;
        const semester = document.getElementById('swal-sem').value;

        if (!section_name || !strand || !grade_level || !adviser_id || !school_year || !semester) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }

        // ✅ Duplicate check (excluding current section)
        const duplicate = sectionsRes.data.sections.find(
          s => s.section_name.toLowerCase() === section_name.toLowerCase() &&
               s.school_year === school_year &&
               s.id !== section.id
        );
        if (duplicate) {
          Swal.showValidationMessage('Section name must be unique for that school year');
          return false;
        }

        return { section_name, strand, grade_level, adviser_id, school_year, semester };
      }
    });

    if (formValues) {
      await axios.put(`http://shs-portal.test/api/sections/${section.id}`, formValues);
      await fetchSections();
      await fetchAdvisers(); // refresh advisers list
      Swal.fire('Success', 'Section updated!', 'success');
    }
  } catch (err) {
    Swal.fire('Error', 'Failed to load data for editing.', 'error');
  }
};


const handleAddSection = async () => {
  const adviserOptions = advisers
    .map(adviser => `<option value="${adviser.id}">${adviser.name}</option>`)
    .join('');

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const schoolYearOptions = `
    <option value="${currentYear - 1}-${currentYear}">${currentYear - 1}-${currentYear}</option>
    <option value="${currentYear}-${nextYear}" selected>${currentYear}-${nextYear}</option>
    <option value="${nextYear}-${nextYear + 1}">${nextYear}-${nextYear + 1}</option>
  `;

  const { value: formValues } = await Swal.fire({
    title: 'Add New Section',
    html:
      '<div class="d-flex flex-column gap-2">' +
      '<input id="swal-section-name" class="swal2-input" placeholder="Section Name" style="margin: 0;" readonly />' + // 🔒 now readonly
      '<select id="swal-strand" class="swal2-input">' +
      '<option value="" disabled selected hidden>Select Strand</option>' +
      '<option value="TVL: EIM">TVL: EIM</option>' +
      '<option value="TVL: CSS">TVL: CSS</option>' +
      '<option value="TVL: HE">TVL: HE</option>' +
      '<option value="HUMSS">HUMSS</option>' +
      '</select>' +
      '<select id="swal-grade" class="swal2-input">' +
      '<option value="" disabled selected hidden>Select Grade</option>' +
      '<option value="Grade 11">Grade 11</option>' +
      '<option value="Grade 12">Grade 12</option>' +
      '</select>' +
      `<select id="swal-adviser" class="swal2-input">` +
      '<option value="" disabled selected hidden>Select Adviser</option>' +
      adviserOptions +
      '</select>' +
      '<select id="swal-semester" class="swal2-input">' +
      '<option value="1st">1st Semester</option>' +
      '<option value="2nd">2nd Semester</option>' +
      '</select>' +
      `<select id="swal-school-year" class="swal2-input">${schoolYearOptions}</select>` +
      '</div>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Add',
    cancelButtonText: 'Cancel',
    didOpen: () => {
      const nameInput = document.getElementById('swal-section-name');
      const strandSelect = document.getElementById('swal-strand');
      const gradeSelect = document.getElementById('swal-grade');

      async function updateSectionName() {
        const strand = strandSelect.value;
        const grade = gradeSelect.value;

        if (strand && grade) {
          // Convert Grade 11 -> "11"
          const gradeNumber = grade.replace('Grade ', '');
          // Filter sections that match grade + strand
          const filtered = sections.filter(
            s => s.strand === strand && s.grade_level === grade
          );
          // Determine next letter based on count
          const nextLetter = String.fromCharCode(65 + filtered.length); // 65 = 'A'
          nameInput.value = `${gradeNumber}-${strand}-${nextLetter}`;
        } else {
          nameInput.value = ''; // reset if selection cleared
        }
      }

      strandSelect.addEventListener('change', updateSectionName);
      gradeSelect.addEventListener('change', updateSectionName);
    },
    preConfirm: async () => {
      const section_name = document.getElementById('swal-section-name').value.trim();
      const strand = document.getElementById('swal-strand').value;
      const grade_level = document.getElementById('swal-grade').value;
      const adviser_id = document.getElementById('swal-adviser').value;
      const semester = document.getElementById('swal-semester').value;
      const school_year = document.getElementById('swal-school-year').value;

      if (!section_name || !strand || !grade_level || !adviser_id || !semester || !school_year) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }

      const duplicate = sections.find(
        s =>
          s.section_name.toLowerCase() === section_name.toLowerCase() &&
          s.school_year === school_year
      );
      if (duplicate) {
        Swal.showValidationMessage('Section name must be unique for that school year');
        return false;
      }

      return { section_name, strand, grade_level, adviser_id, semester, school_year };
    }
  });

  if (formValues) {
    try {
      await axios.post('http://shs-portal.test/api/sections', formValues);
      await fetchSections();
      await fetchAdvisers();
      Swal.fire('Success', 'Section added!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to add section.', 'error');
    }
  }
};


  return (
     <AdminLayout>
       <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh'  }}>
<div className="container-fluid p-3" style={{ backgroundColor: '#f3f3f3' }}>

    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="fw-bold text-danger">Section Management</h3>
      <p className="text-muted mb-2">
        <strong>Current Timeline:</strong> SY {currentTimeline.schoolYear}, {currentTimeline.semester}
      </p>
      <button className="btn btn-danger" onClick={handleAddSection}>Add Section</button>
    </div>

    <div className="row mb-3 g-2">
      <div className="col-md-4 mb-2">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by section name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>
      <div className="col-md-4 mb-2">
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Grade Levels</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
        </select>
      </div>
      <div className="col-md-4 mb-2">
        <select className="form-select" value={strandFilter} onChange={(e) => setStrandFilter(e.target.value)}>
          <option value="">All Strands</option>
          <option value="TVL: EIM">TVL: EIM</option>
          <option value="TVL: CSS">TVL: CSS</option>
          <option value="TVL: HE">TVL: HE</option>
          <option value="HUMSS">HUMSS</option>
        </select>
      </div>

      <div className="col-md-3 mb-2">
        <select className="form-select" value={schoolYearFilter} onChange={(e) => setSchoolYearFilter(e.target.value)}>
          <option value="">All School Years</option>
          {[...new Set(sections.map(s => s.school_year))].map((sy, i) => (
            <option key={i} value={sy}>{sy}</option>
          ))}
        </select>
      </div>

      <div className="col-md-3 mb-2">
        <select className="form-select" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
          <option value={currentTimeline.semester}>Current: {currentTimeline.semester === '1st' ? '1st Semester' : '2nd Semester'}</option>
          <option value="1st">1st Semester</option>
          <option value="2nd">2nd Semester</option>
        </select>
      </div>
    </div>

    <div className="row">
      {paginated.map((section) => (
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-4" key={section.id}>
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold text-danger">{section.section_name}</h5>
              <p><strong>Strand:</strong> {section.strand}</p>
              <p><strong>Grade:</strong> {section.grade_level}</p>
              <p><strong>Adviser:</strong> {section.adviser_name}</p>
              <div className="mt-auto">
                <div className="d-flex flex-wrap gap-2 w-100">
  <button 
    className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 text-uppercase fw-bold text-warning"
    onClick={() => navigate(`/admin/section/${section.id}`)}
    style={{ backgroundColor: 'transparent', border: 'none' }}
  >
    <i className="bi bi-gear"></i> Manage
  </button>
  <button 
    className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 text-uppercase fw-bold text-primary "
    onClick={() => handleEditSection(section)}
    style={{ backgroundColor: 'transparent', border: 'none' }}
  >
    <i className="bi bi-pencil"></i> Edit
  </button>
  <button 
    className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 text-uppercase fw-bold text-danger"
    onClick={() => handleDeleteSection(section.id)}
    style={{ backgroundColor: 'transparent', border: 'none' }}
  >
    <i className="bi bi-trash"></i> Delete
  </button>
</div>

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {totalPages > 1 && (
      <div className="d-flex justify-content-center mt-3">
        <ul className="pagination mb-0">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  </div>
</AdminLayout>

  );
}
