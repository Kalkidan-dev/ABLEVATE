// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { token, role }

  const login = ({ token, role }) => {
    setUser({ token, role });
    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role) {
    setUser({ token, role });
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



