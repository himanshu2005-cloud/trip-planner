import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-[#181820] hover:bg-[#22222c] border border-[#272733] text-[#cebfdf] hover:text-white'
          : 'bg-[#f0ece1] hover:bg-[#e6e1d5] border border-[#dcd6c8] text-[#4c2275] hover:text-[#18181c]'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark and light theme"
    >
      {isDark ? (
        <Sun size={15} className="transition-transform duration-300 hover:rotate-45 text-[#facc15]" />
      ) : (
        <Moon size={15} className="transition-transform duration-300 -rotate-12 text-[#6D3FD9]" />
      )}
    </button>
  );
};

export default ThemeToggle;
