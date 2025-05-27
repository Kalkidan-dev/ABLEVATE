// Directory: src/pages/DashboardStudent.jsx
import React from 'react';
import CourseList from '../components/course/CourseList';

const DashboardStudent = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
      <CourseList />
    </div>
  );
};

export default DashboardStudent;