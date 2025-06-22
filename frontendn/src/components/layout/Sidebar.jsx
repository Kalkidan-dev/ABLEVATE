import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Settings, LogOut, PaintBucket } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const sidebarThemes = {
  blue: 'bg-[#f0faff] border-blue-200',
  dark: 'bg-[#0a2b6d] border-[#0a2b6d]',
  white: 'bg-white border-gray-200',
};

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { role: contextRole } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [theme, setTheme] = useState('blue');

  const [showCourses, setShowCourses] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    } else if (contextRole) {
      setRole(contextRole);
    }

    const storedTheme = localStorage.getItem('sidebarTheme');
    if (storedTheme && sidebarThemes[storedTheme]) {
      setTheme(storedTheme);
    }
  }, [contextRole]);

  useEffect(() => {
    if (role === 'student') {
      const fetchEnrolled = async () => {
        setLoadingCourses(true);
        setError(null);
        try {
          const res = await axiosInstance.get('/dashboard-stats/');
          setEnrolledCourses(res.data.enrolledCourses || []);
        } catch (err) {
          console.error('Failed to load courses', err);
          setError('Failed to load courses');
        } finally {
          setLoadingCourses(false);
        }
      };
      fetchEnrolled();
    }
  }, [role]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('sidebarTheme', newTheme);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      onClick={() => isOpen && toggle()}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg no-underline text-gray-700 dark:text-gray-300 hover:bg-yellow-100 hover:text-yellow-600 transition ${
        isActive(to) ? 'bg-yellow-200 text-yellow-700 font-semibold' : ''
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  const renderLinks = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <NavLink to="/admin-dashboard" icon={<Home className="w-5 h-5" />} label="Admin Dashboard" />
            <NavLink to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          </>
        );
      case 'instructor':
        return (
          <>
            <NavLink to="/instructor-dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" />
            <NavLink to="/instructor-courses" icon={<BookOpen className="w-5 h-5" />} label="My Courses" />
            <NavLink to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          </>
        );
      case 'student':
        return (
          <>
            <NavLink to="/student-dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" />
            <div
              onClick={() => setShowCourses((prev) => !prev)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg select-none transition ${
                showCourses
                  ? 'bg-yellow-200 text-yellow-700 font-semibold'
                  : 'hover:bg-yellow-100 hover:text-yellow-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Enrolled Courses</span>
              <svg
                className={`ml-auto w-4 h-4 transform transition-transform ${
                  showCourses ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {showCourses && (
              <div className="ml-10 mt-2 space-y-2 text-sm">
                {loadingCourses && <p className="text-yellow-600 dark:text-yellow-400">Loading courses...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loadingCourses && !error && enrolledCourses.length === 0 && (
                  <p className="text-yellow-600 dark:text-yellow-400">No courses enrolled yet.</p>
                )}
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="block text-yellow-700 hover:text-yellow-900 hover:underline"
                    onClick={() => isOpen && toggle()}
                  >
                    • {course.title}
                  </Link>
                ))}
              </div>
            )}

            <NavLink to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          </>
        );
      default:
        return <p className="text-sm text-gray-500 p-4">No role assigned</p>;
    }
  };

  if (role === null) return null;

  return (
    <aside
      className={`h-full w-full shadow-inner transition-all duration-300 ease-in-out border-r dark:bg-gray-900 relative ${sidebarThemes[theme]}`}
    >
      <nav className="flex flex-col gap-3 p-6">{renderLinks()}</nav>

      {/* Theme Switcher */}
      <div className="px-4 pb-4">
        <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2">
          <PaintBucket className="w-4 h-4" />
          Sidebar Theme
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => handleThemeChange('blue')}
            className={`w-4 h-4 rounded-full bg-[#c2e9f7] border ${theme === 'blue' ? 'ring-2 ring-blue-500' : ''}`}
            title="Blue"
          />
          <button
            onClick={() => handleThemeChange('dark')}
            className={`w-4 h-4 rounded-full bg-[#0a2b6d] border ${theme === 'dark' ? 'ring-2 ring-gray-500' : ''}`}
            title="Dark"
          />
          <button
            onClick={() => handleThemeChange('white')}
            className={`w-4 h-4 rounded-full bg-white border ${theme === 'white' ? 'ring-2 ring-yellow-400' : ''}`}
            title="White"
          />
        </div>
      </div>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/logout"
          className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
