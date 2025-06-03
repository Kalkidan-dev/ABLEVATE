// Layout.jsx
import React from 'react';
import NavigationBar from './Navbar';


const Layout = ({ children }) => {
  return (
    <div className="flex">
      
      <div className="flex-1">
        <NavigationBar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
