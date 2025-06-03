import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavigationBar from './Navbar';


const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Row */}
      <div className="flex w-full h-16">
        {/* Topbar: 1/5 width */}
        <div className="w-1/5 bg-blue-800 text-white flex items-center px-4">
          <button onClick={toggleSidebar} className="mr-4 text-2xl focus:outline-none">☰</button>
          <span className="text-lg font-bold select-none">ABLEVATE</span>
        </div>

        {/* NavigationBar: 4/5 width */}
        <div className="w-4/5 overflow-hidden">
          <NavigationBar />
        </div>
      </div>

      {/* Sidebar stacked above Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div className="bg-gray-200">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
          </div>
        )}

        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
