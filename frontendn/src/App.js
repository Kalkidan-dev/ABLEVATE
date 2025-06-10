import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';

import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import LessonDetailWrapper from './pages/LessonDetailWrapper';
import ProtectedRoute from './routes/ProtectedRoute';
import axios from 'axios';


import CourseDetail from './components/course/CourseDetail';
import LessonQuiz from './components/course/LessonQuiz';
import Home from './pages/Home';
import DashboardInstructor from './pages/DashboardInstructor';
import DashboardStudent from './pages/DashboardStudent';
import UploadCourse from './pages/UploadCourse';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error('API error', err));
  }, []);

  console.log('API message:', message);

  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeProvider>
          <Router>
            <div className="app-container">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/sidebar" element={<Sidebar />} />

                {/* Protected routes */}
                <Route 
                  path="/instructor-dashboard" 
                  element={
                    <ProtectedRoute role="instructor">
                      <DashboardLayout>
                        <DashboardInstructor />
                      </DashboardLayout>
                    </ProtectedRoute>

                  } 
                />
               
                 
                    <Route
                      path="/courses/:courseId/lessons/:lessonId"
                      element={<LessonDetailWrapper />}
                    />

                <Route path="/courses/:id" element={<DashboardLayout><CourseDetail /></DashboardLayout>} />
                <Route path="/lessons/:lessonId/quiz" element={<LessonQuiz />} />
                  <Route
                      path="/student-dashboard"
                      element={
                        <ProtectedRoute role="student">
                           <DashboardLayout>
                            <DashboardStudent />
                           </DashboardLayout>
                          
                        </ProtectedRoute>
                      }
                    />
                <Route
                  path="/upload-course"
                  element={
                    <ProtectedRoute role="instructor">
                      <UploadCourse />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin-panel"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                {/* Add other protected or public routes as needed */}
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
