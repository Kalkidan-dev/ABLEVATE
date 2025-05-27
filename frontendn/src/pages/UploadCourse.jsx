import React from 'react';
import UploadCourseForm from '../components/course/UploadCourseForm';

const UploadCourse = () => {
  const handleCourseUpload = (formData) => {
    console.log('Uploading course:', formData);
    // Add backend API call logic here
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload a New Course</h2>
      <UploadCourseForm onSubmit={handleCourseUpload} />
    </div>
  );
};

export default UploadCourse;