// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavigationBar from './Navbar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0f7fd] to-white">
      
      {/* Top Navigation Bar */}
      <div className="relative z-40">
        <NavigationBar />
        {/* Sidebar toggle button (top-left corner) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 text-white text-2xl z-50 lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
        >
          ☰
        </button>
      </div>

      {/* Body Section */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out bg-[#e0f7fd] shadow-inner border-r border-[#3ac6f5] 
            ${isSidebarOpen ? 'w-64' : 'w-0'} 
            overflow-hidden`}
        >
          <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-blue-50 text-blue-800 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
