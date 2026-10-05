import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'EXPLORE INDIA', path: '/explore' },
    { label: 'PLAN ITINERARY', path: '/plan' },
    { label: 'MY SAVED TRIPS', path: '/trips' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[64px] dark:bg-[#121217]/95 bg-[#fbf9f4]/95 backdrop-blur-md border-b dark:border-[#262633] border-[#e8e2d5] px-6 lg:px-12 flex items-center transition-colors duration-200 shadow-sm">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-12 items-center">
        {/* Left Column: Brand Logo with favicon.svg (3 cols) */}
        <div className="col-span-6 md:col-span-3 flex items-center">
          <Logo size="md" />
        </div>

        {/* Center Column: Perfectly Centered Navigation (6 cols) */}
        <nav className="hidden md:flex col-span-6 items-center justify-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[11px] tracking-[0.18em] font-medium transition-all relative py-1 ${
                isActive(link.path)
                  ? 'dark:text-[#ffffff] text-[#18181c] font-semibold'
                  : 'dark:text-[#a09c93] text-[#635f56] dark:hover:text-[#ffffff] hover:text-[#18181c]'
              }`}
            >
              <span>{link.label}</span>
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] dark:bg-[#a855f7] bg-[#6D3FD9] shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Column: User Auth, Theme Toggle & Quick Action CTA (3 cols) */}
        <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-3 sm:gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 text-[11px] tracking-[0.14em]">
              <span className="dark:text-[#a09c93] text-[#635f56] hidden lg:inline font-mono">
                {user?.name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="dark:text-[#a09c93] text-[#635f56] dark:hover:text-[#ffffff] hover:text-[#18181c] transition-colors uppercase font-medium cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[11px] tracking-[0.16em]">
              <Link
                to="/login"
                className="dark:text-[#a09c93] text-[#635f56] dark:hover:text-[#ffffff] hover:text-[#18181c] transition-colors font-medium hidden sm:inline"
              >
                SIGN IN
              </Link>
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-[#6D3FD9] to-[#7c3aed] hover:from-[#5b2fb8] hover:to-[#6d28d9] border border-[#a855f7]/50 text-white font-mono text-[10px] tracking-wider uppercase transition-all duration-200 shadow-[0_2px_10px_rgba(109,63,217,0.35)]"
              >
                <span>+ PLAN A TRIP</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
