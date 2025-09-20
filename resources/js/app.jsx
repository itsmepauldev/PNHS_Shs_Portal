import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherHome from './pages/Teacher/TeacherHome';
import StudentHome from './pages/Students/StudentHome';
import ResetPassword from './components/ResetPassword';
import AdviserHome from './pages/Adviser/AdviserHome';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import SectionManagement from './pages/Admin/SectionManagement';
import ClassSchedule from './pages/Admin/ClassSchedule';
import GradeManagement from './pages/Admin/GradeManagement';
import ViolationManagement from './pages/Admin/ViolationManagement';
import DocumentRequests from './pages/Admin/DocumentRequests';
import AdviserManageSection from './pages/Adviser/AdviserManageSection';
import ManageSection from './pages/Admin/ManageSection';
import StudentInfo from './components/StudentInfo';
import AdviserTeacherInfo from './components/TeacherAdviserInfo';
import AdminScheduleManagement from './pages/Admin/AdminScheduleManagement'; // or correct path
import ViewSchedule from './pages/Admin/ViewSchedule'; // or correct path

import MySchedule from './pages/Teacher/MySchedule'; // adjust the path if needed
import AdviserMySchedule  from './pages/Adviser/AdviserMySchedule';
import StudentSchedule  from './pages/Students/StudentSchedule';
import MyViolations  from './pages/Students/MyViolations';
import StudentDocuments from './pages/Students/StudentDocuments';
import AdviserSection from './pages/Adviser/AdviserSections';
import StudentGrades from './pages/Students/StudentGrades';
import Announcement from './pages/Admin/Announcement'
import GuidanceAnnouncement from './pages/Guidance/GuidanceAnnouncement';
import GuidanceViolation from './pages/Guidance/GuidanceViolationManagement';
// Attach token on reload
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/home"
        element={
          <ProtectedRoute role="teacher">
            <TeacherHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/home"
        element={
          <ProtectedRoute role="student">
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/sections"
  element={
    <ProtectedRoute role="admin">
      <SectionManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/schedule"
  element={
    <ProtectedRoute role="admin">
      <ClassSchedule />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/grades"
  element={
    <ProtectedRoute role="admin">
      <GradeManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/violations"
  element={
    <ProtectedRoute role="admin">
      <ViolationManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/documents"
  element={
    <ProtectedRoute role="admin">
      <DocumentRequests />
    </ProtectedRoute>
  }
/>

      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/adviser" element={  <ProtectedRoute role="adviser">
      <AdviserHome />
    </ProtectedRoute>} />
       <Route path="/adviser/home" element={  <ProtectedRoute role="adviser">
      <AdviserHome />
    </ProtectedRoute>} />
      <Route path="/adviser/section/:id" element={  <ProtectedRoute role="adviser">
     <AdviserManageSection />
    </ProtectedRoute>} />
    <Route path="/admin/section/:id" element={<ManageSection />} />
      <Route path="/admin" element={<SectionManagement  />} />
      <Route path="/student/info" element={<StudentInfo />} />


<Route path="/teacher/info" element={<AdviserTeacherInfo />} />
<Route path="/admin/schedules" element={<AdminScheduleManagement />} />
<Route path="/admin/schedules/create" element={<AdminScheduleManagement/>} />

<Route path="/admin/schedules/:id" element={<ViewSchedule />} />



<Route path="/admin/section/:id/schedule" element={<ViewSchedule />} />


{/* <Route path="/admin/schedules/:id" element={<ViewSchedule />} /> */}



<Route path="/teacher/schedule" element={<MySchedule />} />
<Route path="/adviser/my-schedule" element={<AdviserMySchedule />} />
  <Route path="/my-schedule" element={<StudentSchedule />} />



          <Route path="/my-violations" element={<MyViolations />} />






<Route path="/student/documents" element={<StudentDocuments />} />
<Route path="/adviser/MySection" element={<AdviserSection />} />
<Route path="/student/grades" element={<StudentGrades />} />

<Route path="/Announcements" element={<Announcement />} />
<Route path="/guidance/announcement" element={<GuidanceAnnouncement />} />
<Route path="/guidance/violation" element={<GuidanceViolation />} />
    </Routes>


  </BrowserRouter>

);


