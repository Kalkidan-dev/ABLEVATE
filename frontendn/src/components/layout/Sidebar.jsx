import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Settings, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  // Decode token once on load
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded?.role || null);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-yellow-100 hover:text-yellow-600 transition ${
        isActive(to) ? 'bg-yellow-200 text-yellow-700 font-semibold' : ''
      }`}
    >
      {icon}
      {label}
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
            <NavLink to="/my-courses" icon={<BookOpen className="w-5 h-5" />} label="Enrolled Courses" />
            <NavLink to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          </>
        );
      default:
        return (
          <p className="text-sm text-gray-500">No role assigned</p>
        );
    }
  };

  return (
    <aside className="fixed z-20 h-full w-64 bg-white dark:bg-gray-900 shadow-lg">
      {/* Header with avatar */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src="/avatar-placeholder.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Welcome</p>
            <p className="text-xs text-gray-500 capitalize">{role || 'guest'}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-3 p-6">{renderLinks()}</nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
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
