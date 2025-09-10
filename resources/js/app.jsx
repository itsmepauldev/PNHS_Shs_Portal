import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import TeacherHome from './components/TeacherHome';
import StudentHome from './components/StudentHome';
import ResetPassword from './components/ResetPassword';
import AdviserHome from './components/AdviserHome';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import SectionManagement from './components/Admin/SectionManagement';
import ClassSchedule from './components/Admin/ClassSchedule';
import GradeManagement from './components/Admin/GradeManagement';
import ViolationManagement from './components/Admin/ViolationManagement';
import DocumentRequests from './components/Admin/DocumentRequests';
import AdviserManageSection from './components/AdviserManageSection';
import ManageSection from './components/Admin/ManageSection';
import StudentInfo from './components/StudentInfo';
import AdviserTeacherInfo from './components/TeacherAdviserInfo';
import AdminScheduleManagement from './components//Admin/AdminScheduleManagement'; // or correct path
import ViewSchedule from './components/Admin/ViewSchedule'; // or correct path

import MySchedule from './components/MySchedule'; // adjust the path if needed
import AdviserMySchedule  from './components/AdviserMySchedule';
import StudentSchedule  from './components/StudentSchedule';
import MyViolations  from './components/MyViolations';
import StudentDocuments from './components/StudentDocuments';
import AdviserSection from './components/AdviserSections';

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
    </Routes>


  </BrowserRouter>

);


