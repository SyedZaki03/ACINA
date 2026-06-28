// Import React and hooks for managing theme context states, effects, and creations
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a ThemeContext namespace to share theme data across different elements
const ThemeContext = createContext();

// Create and export a ThemeProvider wrapper component
export const ThemeProvider = ({ children }) => {
  // Initialize state variable 'theme' using local storage settings, defaulting to 'dark' mode
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Trigger side-effect class additions/removals on the html document element when the theme changes
  useEffect(() => {
    // Reference root html element
    const root = window.document.documentElement;
    // Add or remove Tailwind's 'dark' mode class from the root layout
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Sync the current theme setting value to the browser local storage
    localStorage.setItem('theme', theme);
  }, [theme]); // Re-run effect when state variable 'theme' updates

  // Toggles between 'dark' and 'light' mode strings
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Render context provider wrapper carrying the theme state and toggle function down to child routes
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook helper to directly import and consume ThemeContext in components
export const useTheme = () => useContext(ThemeContext);