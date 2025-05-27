// Directory: src/pages/DashboardInstructor.jsx
import React from 'react';
import UploadCourseForm from '../components/course/UploadCourseForm';

const DashboardInstructor = () => {
  const handleUpload = (formData) => {
    console.log('Course submitted:', formData);
    // Integrate with backend API
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload New Course</h2>
      <UploadCourseForm onSubmit={handleUpload} />
    </div>
  );
};

export default DashboardInstructor;