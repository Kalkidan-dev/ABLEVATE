import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavigationBar from './Navbar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar Row */}
      <div className="flex w-full h-16">
        <div className="w-1/5 bg-blue-800 text-white flex items-center px-4">
          <button onClick={toggleSidebar} className="mr-4 text-2xl focus:outline-none">☰</button>
          <span className="text-lg font-bold select-none">ABLEVATE</span>
        </div>
        <div className="w-4/5 overflow-hidden">
          <NavigationBar />
        </div>
      </div>

      {/* Main Body Row: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (horizontal beside main content) */}
        {isSidebarOpen && (
          <div className="w-64 bg-gray-200">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
