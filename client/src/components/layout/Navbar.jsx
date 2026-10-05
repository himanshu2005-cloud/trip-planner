import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, User, LogOut, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Plan Trip', path: '/plan' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Explore', path: '/explore' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/[0.055] border border-white/[0.09] backdrop-blur-[18px] shadow-glass">
        {/* Brand Logo - Geometric & Clean (DESIGN.md §7) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-accent-pink flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-text-primary">
            Trip<span className="text-purple-400">Pilot</span>
          </span>
        </Link>

        {/* Center Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-purple-600/40 text-text-primary shadow-sm border border-purple-500/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls - Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/plan">
            <Button size="sm" variant="primary">
              <Compass size={15} />
              <span>Plan Trip</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.1]">
              <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs text-purple-300 font-semibold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-xs text-text-secondary font-medium">
                {user?.name || 'User'}
              </span>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-white/[0.05] transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="secondary">
                <User size={14} />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-background-secondary/95 border border-white/[0.1] backdrop-blur-2xl shadow-glass flex flex-col gap-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-purple-600/30 text-white border border-purple-500/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <Link
              to="/plan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button size="sm" variant="primary" className="w-full">
                <Compass size={15} />
                <span>Plan Trip</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
