import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivateAccount from './pages/ActivateAccount';
import ResetPassword from './pages/ResetPassword';
import DashboardStudent from './pages/DashboardStudent';
import DashboardInstructor from './pages/DashboardInstructor';
import CourseDetails from './pages/CourseDetails';
import UploadCourse from './pages/UploadCourse';
import AdminPanel from './pages/AdminPanel';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard/student" element={<DashboardStudent />} />
    <Route path="/dashboard/instructor" element={<DashboardInstructor />} />
    <Route path="/course/:id" element={<CourseDetails />} />
    <Route path="/upload-course" element={<UploadCourse />} />
    <Route path="/admin" element={<AdminPanel />} />
  </Routes>
);

export default AppRoutes;


