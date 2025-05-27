
import React from 'react';
import CourseList from '../course/CourseList';

const StudentDashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Welcome, Student</h1>
    <CourseList />
  </div>
);

export default StudentDashboard;