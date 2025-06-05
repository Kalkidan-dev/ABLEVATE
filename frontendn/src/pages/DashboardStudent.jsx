import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseList from '../components/course/CourseList';
import { Bell } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/student/dashboard-stats/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/student/notifications/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchStats();
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 relative animate-fade-in">
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
          <div className="relative mt-4 md:mt-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
            >
              <Bell className="text-blue-600 w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg z-10 p-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No new notifications</p>
                ) : (
                  notifications.map((note) => (
                    <div key={note.id} className="text-sm text-gray-600 mb-1 border-b pb-1">
                      {note.text}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Enrolled Courses" value={stats.total} color="blue" />
          <StatCard label="Completed" value={stats.completed} color="green" />
          <StatCard label="In Progress" value={stats.inProgress} color="yellow" />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">📌 Recent Activity</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1 text-sm">
            <li>Watched: "Intro to Web Accessibility"</li>
            <li>Quiz completed: "React Basics - Week 1"</li>
            <li>Forum reply in "Building with Django"</li>
          </ul>
        </div>

        {/* Search + Courses */}
        <div className="flex items-center bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4">
          <CourseList />
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-500',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow text-center">
      <h2 className={`text-2xl font-bold ${colorMap[color]}`}>{value}</h2>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export default StudentDashboard;
