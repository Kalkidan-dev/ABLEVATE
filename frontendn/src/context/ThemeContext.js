// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Apply the theme to <body> class
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const activeTheme = savedTheme || 'light';
    setTheme(activeTheme);
    applyThemeToBody(activeTheme);
  }, []);

  useEffect(() => {
    applyThemeToBody(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const applyThemeToBody = (theme) => {
    document.body.classList.remove('light', 'dark', 'braille');
    document.body.classList.add(theme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const enableBrailleMode = () => {
    setTheme('braille');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, enableBrailleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

