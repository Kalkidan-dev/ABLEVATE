import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';

import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';


import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import UploadCourse from './pages/UploadCourse';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import VoiceControl from './components/VoiceControl';


const App = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeProvider>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/" element={<CourseList />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/upload-course" element={<UploadCourse />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/login" element={<Login />} />
                {/* Add other routes here */}
              </Routes>

              {/* VoiceControl listens everywhere */}
              <VoiceControl />
            </div>
          </Router>
        </ThemeProvider>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
