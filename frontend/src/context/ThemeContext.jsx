import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Read theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && ['dark', 'light', 'grayscale'].includes(savedTheme)
      ? savedTheme
      : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light', 'grayscale-theme');
    
    // Write new configuration classes
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'grayscale') {
      // For grayscale, we combine dark structure but apply a global monochrome filter
      root.classList.add('dark', 'grayscale-theme');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (['dark', 'light', 'grayscale'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
