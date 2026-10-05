import React from 'react';
import { Sparkles, Heart, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-surface border-t border-glass-border pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-xl text-text-primary">Trip<span className="text-purple-600">Pilot</span></span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Your intelligent day-by-day itinerary optimizer. Plan less, explore more with algorithmic travel planning.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-purple-600 transition-colors"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-purple-600 transition-colors"><Twitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-purple-600 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-purple-600 transition-colors"><Youtube size={16} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-text-primary mb-4">Bookings</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
              <li><Link to="/flights" className="hover:text-purple-500">Flights</Link></li>
              <li><Link to="/hotels" className="hover:text-purple-500">Hotels</Link></li>
              <li><Link to="/plan" className="hover:text-purple-500">Holiday Packages</Link></li>
              <li><Link to="/cabs" className="hover:text-purple-500">Cabs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-4">About</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-purple-500">About Us</a></li>
              <li><a href="#" className="hover:text-purple-500">Careers</a></li>
              <li><a href="#" className="hover:text-purple-500">Blog</a></li>
              <li><a href="#" className="hover:text-purple-500">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-4">Support</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-purple-500">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-500">FAQs</a></li>
              <li><a href="#" className="hover:text-purple-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-500">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} TripPilot. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={12} className="text-accent-pink fill-accent-pink inline" />
            <span>for seamless journeys</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
