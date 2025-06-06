import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonModal from '../components/course/LessonModal'; // modal component
import StatCard from '../components/dashboard/StatCard'; // extracted for reuse

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState({
    username: '',
    total: 0,
    completed: 0,
    inProgress: 0,
    enrolledCourses: []
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const navigate = useNavigate();

  const fetchLessons = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };
useEffect(() => {
  if (selectedCourse?.id) {
    fetchLessons(selectedCourse.id);
  }
}, [selectedCourse]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [statsRes, notiRes] = await Promise.all([
          axiosInstance.get('dashboard-stats/', { headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get('/notifications/', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDashboard(statsRes.data);
        setNotifications(notiRes.data);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 relative">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/64"
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Welcome, {dashboard.username}</h1>
              <p className="text-gray-600">Ready to continue learning today? 🎯</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative mt-4 md:mt-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
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
                {notifications.map((note) => (
                  <div key={note.id} className="text-sm text-gray-600 mb-1 border-b pb-1">
                    {note.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Enrolled" value={dashboard.total} color="blue" />
          <StatCard label="Completed" value={dashboard.completed} color="green" />
          <StatCard label="In Progress" value={dashboard.inProgress} color="yellow" />
        </div>

        {/* Courses */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🎓 Your Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dashboard.enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      console.log("Selected course:", course); 
                      if (course?.id) {
                        setSelectedCourse(course);
                        setSelectedLesson(null);
                        
                      } else {
                        console.warn("No course ID found!", course);
                      }
                    }}
                    className="cursor-pointer bg-blue-50 rounded-xl p-4 shadow hover:shadow-md transition"
                  >
                    <img
                      src={course.image || 'https://via.placeholder.com/300x150'}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h3 className="text-lg font-semibold text-blue-800">{course.title}</h3>
                    <p className="text-sm text-gray-500">Status: {course.status}</p>
                  </div>
                ))}

          </div>

          {/* Lessons */}
          {selectedCourse && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                📚 Lessons in {selectedCourse.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-white p-4 rounded shadow border hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-blue-700">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{lesson.video_file}</p>
                        
                      </div>
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-200 rounded">
                        <div
                          className="h-full bg-green-500 rounded"
                          style={{ width: `${lesson.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {lesson.progress || 0}% completed
                      </p>
                    </div>
                    {lesson.has_quiz && (
                      <button
                        onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
                        className="mt-3 text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Take Quiz
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for lesson */}
        {selectedLesson && (
          <LessonModal
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onNavigate={() => {
              navigate(`/lessons/${selectedLesson.id}`);
              setSelectedLesson(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
