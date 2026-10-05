import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/[0.08] py-8 px-4 text-center text-xs text-text-muted">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-600/30 flex items-center justify-center">
            <Sparkles size={12} className="text-purple-400" />
          </div>
          <span className="font-medium text-text-secondary">TripPilot</span>
          <span>— Intelligent Day-wise Itinerary Optimizer</span>
        </div>

        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart size={12} className="text-accent-pink fill-accent-pink inline" />
          <span>for seamless journeys</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
