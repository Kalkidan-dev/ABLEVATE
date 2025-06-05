import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import {
  Home,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  Users,
  Layers,
} from 'lucide-react';

const Sidebar = ({ isOpen = true, toggle }) => {
  const location = useLocation();
  const [role, setRole] = useState('guest');
  const [courseOpen, setCourseOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Decode JWT and extract role
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        setRole(decoded?.role || 'guest');
      }
    } catch (err) {
      console.error('Invalid token', err);
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const SidebarLink = ({ to, label, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        isActive(to)
          ? 'bg-yellow-100 text-yellow-700 font-semibold shadow-inner'
          : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-50 hover:text-yellow-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  const CollapsibleSection = ({ title, icon: Icon, open, setOpen, children }) => (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-yellow-50 transition"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="ml-8 mt-1 flex flex-col gap-2">{children}</div>}
    </>
  );

  return (
    <aside className="fixed z-20 h-full w-64 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${role}&background=ffc107&color=000`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {role.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="text-xl text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition md:hidden"
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 py-4">
        {role === 'instructor' && (
          <>
            <SidebarLink to="/instructor-dashboard" label="Dashboard" icon={Home} />
            <CollapsibleSection
              title="Courses"
              icon={BookOpen}
              open={courseOpen}
              setOpen={setCourseOpen}
            >
              <SidebarLink to="/instructor-courses" label="My Courses" icon={BookOpen} />
              <SidebarLink to="/instructor-courses/new" label="Add New" icon={BookOpen} />
            </CollapsibleSection>
            <CollapsibleSection
              title="Settings"
              icon={Settings}
              open={settingsOpen}
              setOpen={setSettingsOpen}
            >
              <SidebarLink to="/settings/profile" label="Profile" icon={Settings} />
              <SidebarLink to="/settings/security" label="Security" icon={Settings} />
            </CollapsibleSection>
          </>
        )}

        {role === 'student' && (
          <>
            <SidebarLink to="/student-dashboard" label="Dashboard" icon={Home} />
            <SidebarLink to="/my-courses" label="Enrolled Courses" icon={BookOpen} />
            <SidebarLink to="/settings" label="Settings" icon={Settings} />
          </>
        )}

        {role === 'admin' && (
          <>
            <SidebarLink to="/admin-dashboard" label="Admin Panel" icon={Home} />
            <SidebarLink to="/manage-users" label="Manage Users" icon={Users} />
            <SidebarLink to="/manage-courses" label="Manage Courses" icon={Layers} />
            <SidebarLink to="/site-settings" label="Site Settings" icon={Settings} />
          </>
        )}

        {role === 'guest' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
            Please login to see menu.
          </p>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/logout"
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
        <p className="text-xs text-gray-400 mt-2">© 2025 InclusiveEd</p>
      </div>
    </aside>
  );
};

export default Sidebar;
