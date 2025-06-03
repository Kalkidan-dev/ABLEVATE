// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggle}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed z-20 h-full w-64 bg-white dark:bg-gray-800 shadow transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Close button (mobile only) */}
        <div className="p-4 flex justify-between items-center md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggle} className="text-xl">✖</button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-4 p-4">
          <Link to="/instructor-dashboard" className="hover:text-yellow-500">Dashboard</Link>
          <Link to="/instructor-courses" className="hover:text-yellow-500">My Courses</Link>
          <Link to="/settings" className="hover:text-yellow-500">Settings</Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
