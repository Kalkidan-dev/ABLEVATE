import React from 'react';
import CourseList from '../course/CourseList';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome + Profile Card */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/64"
              alt="Student Avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Welcome, Student</h1>
              <p className="text-gray-600">Ready to continue learning today? 🎯</p>
            </div>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            View Profile
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <h2 className="text-2xl font-bold text-blue-600">12</h2>
            <p className="text-gray-500">Enrolled Courses</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <h2 className="text-2xl font-bold text-green-600">5</h2>
            <p className="text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <h2 className="text-2xl font-bold text-yellow-500">7</h2>
            <p className="text-gray-500">In Progress</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Course List */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <CourseList />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
