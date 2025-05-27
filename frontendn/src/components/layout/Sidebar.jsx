import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle }) => (
  <aside className={`fixed z-20 h-full bg-white dark:bg-gray-800 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>
    <button onClick={toggle} className="absolute top-4 right-4">✖</button>
    <nav className="p-4 space-y-4">
      <Link to="/dashboard/student">Student Dashboard</Link>
      <Link to="/dashboard/instructor">Instructor Dashboard</Link>
    </nav>
  </aside>
);

export default Sidebar;