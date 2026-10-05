import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo
 * Brand logo rendering favicon.svg directly across the application.
 */
export const Logo = ({
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  iconOnly = false,
}) => {
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
      <img
        src="/favicon.svg"
        alt="TripPilot Itinerary Planner"
        className={`${heights[size] || heights.md} w-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;
