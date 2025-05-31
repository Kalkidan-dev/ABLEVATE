import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
// import CourseList from './pages/CourseList';
// import CourseDetail from './pages/CourseDetail';

import Sidebar from './components/layout/Sidebar';

// import DashboardStudent from './pages/DashboardStudent';
import DashboardInstructor from './pages/DashboardInstructor';
// import useVoiceControl from './hooks/useVoiceControl';


import UploadCourse from './pages/UploadCourse';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';



const App = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeProvider>
          <Router>
            <div className="app-container">
              <Routes>
                {/* <Route path="/" element={<Home />} />
                <Route path="/student-dashboard" element={<DashboardStudent />} /> */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/instructor-dashboard" element={<DashboardInstructor />} />
                
                <Route path="/sidebar" element={<Sidebar />} />
                {/* <Route path="/" element={<CourseList />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetail />} /> */}
                <Route path="/upload-course" element={<UploadCourse />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                {/* Add other routes here */}
              </Routes>

              {/* VoiceControl listens everywhere */}
              {/* <useVoiceControl /> */}
            </div>
          </Router>
        </ThemeProvider>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
