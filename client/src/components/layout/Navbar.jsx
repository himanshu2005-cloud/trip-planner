import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'Plan Trip', path: '/plan' },
    { label: 'My Trips', path: '/trips' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="flex items-center justify-between px-6 py-3.5 rounded-2xl bg-white/[0.055] border border-white/[0.09] backdrop-blur-[18px] shadow-glass">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-accent-pink flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-text-primary">
            Trip<span className="text-purple-400">Pilot</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-purple-600/40 text-text-primary shadow-sm border border-purple-500/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action / Auth Controls */}
        <div className="flex items-center gap-3">
          <Link to="/plan" className="hidden sm:inline-flex">
            <Button size="sm" variant="primary">
              <Compass size={16} />
              <span>Plan Trip</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.1]">
              <span className="text-xs text-text-secondary hidden sm:inline">
                {user?.name || 'Traveller'}
              </span>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-white/[0.05] transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="secondary">
                <User size={15} />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
