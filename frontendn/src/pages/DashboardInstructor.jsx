import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import UploadCourseForm from '../components/course/UploadCourseForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mockCourses = [
  { id: 1, title: 'Intro to HTML', status: 'Published', date: '2024-06-10' },
  { id: 2, title: 'React for Beginners', status: 'Draft', date: '2024-06-15' },
];

const DashboardInstructor = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleUpload = (formData) => {
    console.log('Course submitted:', formData);
    setModalOpen(false);
    toast.success('🎉 Course uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-6xl mx-auto w-full">
        {/* Your Courses Table Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-800">Your Courses</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition-all"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date Created</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="py-3 px-4">{course.title}</td>
                    <td className="py-3 px-4">{course.status}</td>
                    <td className="py-3 px-4">{course.date}</td>
                    <td className="py-3 px-4">
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload New Course</h3>
              <UploadCourseForm onSubmit={handleUpload} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInstructor;
