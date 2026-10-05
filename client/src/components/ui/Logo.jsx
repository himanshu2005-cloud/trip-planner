import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo
 * Brand logo using favicon.svg with optional wordmark and custom sizing.
 */
export const Logo = ({
  className = '',
  showWordmark = true,
  iconOnly = false,
  size = 'md', // 'sm', 'md', 'lg'
}) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-90 ${className}`}
      title="TripPilot — Precision Trip Planner"
    >
      {/* Favicon Icon Part (Paper plane in purple circle) */}
      <div className={`relative shrink-0 overflow-hidden rounded-full ${iconSizes[size] || iconSizes.md}`}>
        <img
          src="/favicon.svg"
          alt="TripPilot"
          className="w-full h-full object-cover scale-[1.3] -translate-x-[2%]"
        />
      </div>

      {showWordmark && !iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] text-[#f5f2eb]">
              TRIP<span className="text-[#cebfdf]">PILOT</span>
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#7a5293] uppercase hidden sm:inline">
              PLANNER
            </span>
          </div>
          <span className="font-mono text-[8px] tracking-[0.25em] text-[#5c5851] uppercase -mt-0.5">
            PRECISION ITINERARY
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
