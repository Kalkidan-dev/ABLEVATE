import React from 'react';
import UploadCourseForm from '../components/course/UploadCourseForm';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseList from '../components/course/CourseList';

const DashboardInstructor = () => {
  const handleUpload = (formData) => {
    console.log('Course submitted:', formData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success('Course upload handled in Dashboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center w-full max-w-5xl mx-auto">
      <ToastContainer />
      
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload New Course</h2>
      <UploadCourseForm onSubmit={handleUpload} />
      <CourseList />
      {/* Add some spacing */}
      <div className="w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Courses</h2>
        {/* <CourseList /> */}
      </div>
    </div>
  );
};

export default DashboardInstructor;
