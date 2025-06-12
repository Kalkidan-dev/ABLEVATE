import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import LessonModal from '../components/course/LessonModal';
import StatCard from '../components/dashboard/StatCard';

// Voice recognition setup
const recognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;

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
  const [lessonIndex, setLessonIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');

  const navigate = useNavigate();

  const fetchLessons = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      setLessons(res.data);
      setLessonIndex(0); // reset index
      setSelectedLesson(res.data[0]); // show first lesson
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  useEffect(() => {
    if (selectedCourse?.id) fetchLessons(selectedCourse.id);
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

  // Voice command logic
  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setFeedback(`You said: "${transcript}"`);

      // Command logic
      if (transcript.includes("start course")) {
        if (dashboard.enrolledCourses.length > 0) {
          const firstCourse = dashboard.enrolledCourses[0];
          setSelectedCourse(firstCourse);
        }
      } else if (transcript.includes("next lesson")) {
        if (lessons.length > lessonIndex + 1) {
          setSelectedLesson(lessons[lessonIndex + 1]);
          setLessonIndex(prev => prev + 1);
        } else {
          setFeedback("You're at the last lesson.");
        }
      } else if (transcript.includes("go back")) {
        if (lessonIndex > 0) {
          setSelectedLesson(lessons[lessonIndex - 1]);
          setLessonIndex(prev => prev - 1);
        } else {
          setFeedback("You're at the first lesson.");
        }
      } else if (transcript.includes("open notifications")) {
        setShowNotifications(true);
      } else if (transcript.includes("close notifications")) {
        setShowNotifications(false);
      } else if (transcript.includes("logout")) {
        navigate('/logout');
      } else if (transcript.startsWith("show course")) {
        const courseTitle = transcript.replace("show course", "").trim();
        const course = dashboard.enrolledCourses.find(c =>
          c.title.toLowerCase().includes(courseTitle)
        );
        if (course) {
          setSelectedCourse(course);
        } else {
          setFeedback(`Course "${courseTitle}" not found`);
        }
      } else if (transcript.includes("go to quiz") && selectedLesson?.id) {
        navigate(`/lessons/${selectedLesson.id}/quiz`);
      }
    };

    recognition.onerror = (event) => {
      setFeedback(`Error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  }, [dashboard.enrolledCourses, lessons, lessonIndex, selectedLesson, navigate]);

  const toggleListening = () => {
    if (!recognition) {
      setFeedback('Speech recognition not supported.');
      return;
    }

    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
      setFeedback('🎤 Listening...');
    }

    setListening(!listening);
  };

  if (!recognition) {
    return <div className="text-center text-red-600">Your browser does not support voice recognition.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Voice Mic Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-full text-white ${listening ? 'bg-red-500' : 'bg-blue-600'}`}
            title="Click to use voice"
          >
            🎤 {listening ? 'Stop' : 'Speak'}
          </button>
        </div>

        {feedback && <p className="text-sm text-gray-500 mb-2">{feedback}</p>}

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/64"
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Welcome, {dashboard.username}</h1>
              <p className="text-gray-500">Your progress overview</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Courses" value={dashboard.total} />
          <StatCard label="In Progress" value={dashboard.inProgress} />
          <StatCard label="Completed" value={dashboard.completed} />
        </div>

        {/* Notifications */}
        {showNotifications && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">🔔 Notifications</h2>
            <ul className="mt-2 space-y-2">
              {notifications.map((noti, index) => (
                <li key={index} className="text-sm text-gray-700">
                  • {noti.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lesson Modal */}
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