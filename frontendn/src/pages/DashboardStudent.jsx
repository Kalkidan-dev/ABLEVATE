// src/pages/StudentDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';

const recognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;

const synth = window.speechSynthesis;

const speak = (text) => {
  if (synth) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
};

const playSound = () => {
  const audio = new Audio('/sounds/click.mp3');
  audio.play();
};

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState({
    username: '',
    total: 0,
    completed: 0,
    inProgress: 0,
    enrolledCourses: [],
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
  }, [searchTerm]);

  const fetchLessons = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      setLessons(res.data);
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
      const transcript = event.results[0][0].transcript.toLowerCase();
      setFeedback(`You said: "${transcript}"`);
      speak(`You said: ${transcript}`);

      if (transcript.includes('open notifications')) {
        setShowNotifications(true);
      } else if (transcript.includes('close notifications')) {
        setShowNotifications(false);
      } else if (transcript.includes('logout')) {
        navigate('/logout');
      } else if (transcript.startsWith('search course')) {
        const title = transcript.replace('search course', '').trim();
        setSearchTerm(title);
        speak(`Searching course ${title}`);
      } else if (transcript.includes('go to quiz') && selectedLesson?.id) {
        navigate(`/lessons/${selectedLesson.id}/quiz`);
      } else if (transcript.startsWith('show course')) {
        const title = transcript.replace('show course', '').trim();
        const course = dashboard.enrolledCourses.find(c =>
          c.title.toLowerCase().includes(title)
        );
        if (course) {
          setSelectedCourse(course);
          setSelectedLesson(null);
          playSound();
        } else {
          setFeedback(`Course "${title}" not found`);
          speak(`Course ${title} not found`);
        }
      }
    };

    recognition.onerror = (event) => {
      setFeedback(`Error: ${event.error}`);
      speak(`Error occurred: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  }, [dashboard.enrolledCourses, selectedLesson, navigate]);

  const toggleListening = () => {
    if (!recognition) {
      setFeedback('Speech recognition not supported.');
      return;
    }

    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
      setFeedback('Listening...');
      speak('Listening...');
    }

    setListening(!listening);
  };

  const filteredCourses = dashboard.enrolledCourses.filter(course =>
  course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Voice Mic */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleListening}
            aria-label="Toggle voice recognition"
            className={`px-4 py-2 rounded-full text-white ${listening ? 'bg-red-500' : 'bg-blue-600'}`}
          >
            🎤 {listening ? 'Stop' : 'Speak'}
          </button>
        </div>
        {feedback && <p className="text-sm text-gray-600 mb-2" role="status">{feedback}</p>}

        {/* Welcome and Notifications */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/64"
              alt="User avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Welcome, {dashboard.username}</h1>
              <p className="text-gray-600">Ready to continue learning today? 🎯</p>
            </div>
          </div>
          <div className="relative mt-4 md:mt-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
              aria-label="Show notifications"
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

        {/* Enrolled Courses (Original + Integrated View Button) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🎓 Your Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white p-4 rounded shadow hover:shadow-md">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Lessons
                </button>
              </div>
           
            ))
          ) : (
            <p className="text-gray-500">No courses found matching "{debouncedSearchTerm}"</p>
          )}
        </div>
      </div>
        {/* Lessons */}
        {selectedCourse && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">📚 Lessons in {selectedCourse.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white p-4 rounded shadow border hover:shadow-md transition">
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
                    <p className="text-xs text-gray-500 mt-1">{lesson.progress || 0}% completed</p>
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
    </div>
  );
};

export default StudentDashboard;
