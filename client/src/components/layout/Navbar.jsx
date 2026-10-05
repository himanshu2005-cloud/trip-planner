import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'EXPLORE INDIA', path: '/explore' },
    { label: 'PLAN ITINERARY', path: '/plan' },
    { label: 'MY SAVED TRIPS', path: '/trips' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0c0c0f]/95 backdrop-blur-md border-b border-[#1c1c23] px-6 lg:px-12 flex items-center transition-all">
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
                  ? 'text-[#f5f2eb] font-semibold'
                  : 'text-[#9e9a91] hover:text-[#f5f2eb]'
              }`}
            >
              <span>{link.label}</span>
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7a5293]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Column: User Auth / Quick Action CTA (3 cols) */}
        <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-5">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 text-[11px] tracking-[0.14em]">
              <span className="text-[#9e9a91] hidden lg:inline font-mono">
                {user?.name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="text-[#9e9a91] hover:text-[#f5f2eb] transition-colors uppercase font-medium cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-[11px] tracking-[0.16em]">
              <Link
                to="/login"
                className="text-[#9e9a91] hover:text-[#f5f2eb] transition-colors font-medium hidden sm:inline"
              >
                SIGN IN
              </Link>
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#432357] hover:bg-[#522a6a] border border-[#7a5293] text-[#f5f2eb] font-mono text-[10px] tracking-wider uppercase transition-all duration-200"
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
