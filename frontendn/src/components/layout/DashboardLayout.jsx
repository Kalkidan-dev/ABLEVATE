import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 p-4 ml-64">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">☰</button>
        <ThemeToggle />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
