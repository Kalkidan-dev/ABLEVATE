// Layout.jsx
import React from 'react';
import NavigationBar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <NavigationBar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
