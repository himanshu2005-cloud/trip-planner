import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, LogOut, Menu, X, Plane, Building2, Palmtree, Train, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Flights', icon: Plane, path: '/flights' },
    { label: 'Hotels', icon: Building2, path: '/hotels' },
    { label: 'Holidays', icon: Palmtree, path: '/plan' },
    { label: 'Trains', icon: Train, path: '/trains' },
    { label: 'Cabs', icon: Car, path: '/cabs' },
    { label: 'My Trips', icon: null, path: '/trips' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-glass-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary">
              Trip<span className="text-purple-600">Pilot</span>
            </span>
          </Link>

          {/* Center Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex flex-col items-center gap-1 transition-all duration-200 group ${
                  isActive(link.path) ? 'text-purple-600' : 'text-text-secondary hover:text-purple-500'
                }`}
              >
                {link.icon && <link.icon size={20} className={isActive(link.path) ? "text-purple-600" : "text-text-muted group-hover:text-purple-500"} />}
                <span className="text-xs font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Controls - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-sm text-purple-700 font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-primary font-bold">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                  <button onClick={logout} className="text-[10px] text-text-muted hover:text-danger text-left">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white shadow-none">
                  <User size={14} className="mr-1" />
                  <span>Login / Signup</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-glass-border shadow-lg flex flex-col px-4 py-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 border-b border-glass-border last:border-0 ${
                isActive(link.path) ? 'text-purple-600 font-bold' : 'text-text-secondary font-medium'
              }`}
            >
              {link.icon && <link.icon size={18} />}
              <span>{link.label}</span>
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-4 pb-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" variant="primary" className="w-full bg-purple-600">
                  <User size={16} className="mr-2" /> Login / Signup
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
