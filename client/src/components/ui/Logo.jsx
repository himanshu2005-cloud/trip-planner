import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

/**
 * Logo
 * Brand logo rendering favicon.svg directly across the application,
 * automatically optimizing contrast for dark and light modes.
 */
export const Logo = ({
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  iconOnly = false,
}) => {
  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeContext.isDark;
  } catch {
    // Fallback if rendered outside ThemeProvider
    isDark = true;
  }

  const heights = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
  };

  if (iconOnly) {
    return (
      <Link
        to="/"
        className={`inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
        title="TripPilot — Trip Planner"
      >
        <svg viewBox="68 88 124 124" className={size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'}>
          <circle cx="130" cy="150" r="62" fill="#6D3FD9" />
          <path d="M92 196 C100 176 108 172 124 166" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
          <polygon points="180,114 98,150 130,161 146,192" fill="#FFFFFF" />
          <path d="M130 161 L180 114" fill="none" stroke="#6D3FD9" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={`inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
      title="TripPilot — Trip Planner"
    >
      <svg
        viewBox="68 88 430 124"
        className={`${heights[size] || heights.md} w-auto`}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>TripPilot Itinerary Planner</title>
        {/* Icon Mark (favicon.svg) */}
        <circle cx="130" cy="150" r="62" fill="#6D3FD9" />
        <path d="M92 196 C100 176 108 172 124 166" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
        <polygon points="180,114 98,150 130,161 146,192" fill="#FFFFFF" />
        <path d="M130 161 L180 114" fill="none" stroke="#6D3FD9" strokeWidth="4" strokeLinecap="round" />

        {/* Wordmark */}
        <text
          x="218"
          y="170"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="66"
          fontWeight="700"
          letterSpacing="-2"
          fill={isDark ? '#f5f2eb' : '#18181c'}
        >
          Trip<tspan fill={isDark ? '#A78BFA' : '#6D3FD9'}>Pilot</tspan>
        </text>
        <text
          x="222"
          y="202"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="12"
          fontWeight="600"
          letterSpacing="4"
          fill={isDark ? '#9e9a91' : '#686255'}
        >
          TRIP PLANNER · INDIA
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
